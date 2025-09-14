import { supabase } from "../supabaseClient";

export interface Badge {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  created_at: string;
  is_active: boolean;
}

export interface UserBadge {
  id: number;
  user_id: string;
  badge_id: number;
  earned_date: string;
  badge?: Badge; // include badge details when joined
}

export const AchievementService = {
  // Get achievements earned by a specific user
  getUserAchievements: async (userId: string): Promise<UserBadge[]> => {
    try {
      const { data, error } = await supabase
        .from("user_badge")
        .select(
          `
          id,
          user_id,
          badge_id,
          earned_date,
          badge:badge_id (
            id,
            name,
            description,
            icon,
            created_at,
            is_active
          )
        `
        )
        .eq("user_id", userId);

      if (error) throw error;
      // Map badge from array to single object
      return (data ?? []).map((item: any) => ({
        ...item,
        badge: Array.isArray(item.badge) ? item.badge[0] : item.badge,
      }));
    } catch (err) {
      console.error("getUserAchievements error:", err);
      throw err;
    }
  },

  // Get all possible achievements (badges)
  getAllAchievements: async (): Promise<Badge[]> => {
    try {
      const { data, error } = await supabase
        .from("badge")
        .select("*")
        .eq("is_active", true);

      if (error) throw error;
      return data ?? [];
    } catch (err) {
      console.error("getAllAchievements error:", err);
      throw err;
    }
  },
};


export const AchievementLogic = {
  checkAndAssignAchievements: async (userId: string) => {
    // Fetch all payments and debts
    const { data: payments } = await supabase
      .from("payment")
      .select("*")
      .eq("user_id", userId);

    const { data: debts } = await supabase
      .from("debt")
      .select("*")
      .eq("user_id", userId);

    // 1️⃣ First Payment
    if (payments?.length === 1) {
      await AchievementLogic.awardBadge(userId, 1); // badge_id 1
    }

    // 2️⃣ One Debt Cleared
    debts?.forEach(async (d) => {
      if (d.balance === 0) {
        await AchievementLogic.awardBadge(userId, 2); // badge_id 2
      }
    });

    // 3️⃣ High Roller
    const totalPaid = payments?.reduce((sum, p) => sum + Number(p.amount), 0) ?? 0;
    if (totalPaid >= 10000) {
      await AchievementLogic.awardBadge(userId, 3); // badge_id 3
    }

    // 4️⃣ & 5️⃣ Payment Streaks
    // Group payments by debt and month
    const debtsWithStreak = debts?.map(d => {
      const debtPayments = payments?.filter(p => p.debt_id === d.id)
        .sort((a, b) => new Date(a.payment_date).getTime() - new Date(b.payment_date).getTime());
      return { debt: d, payments: debtPayments };
    });

    // Example: check 6-month streak
    debtsWithStreak?.forEach(async ({ debt, payments }) => {
      if (AchievementLogic.hasConsecutiveOnTimeMonths(payments ?? [], 6)) {
        await AchievementLogic.awardBadge(userId, 4); // 6-month badge
      }
      if (AchievementLogic.hasConsecutiveOnTimeMonths(payments ?? [], 12)) {
        await AchievementLogic.awardBadge(userId, 5); // 12-month badge
      }
    });
  },

  awardBadge: async (userId: string, badgeId: number) => {
    const { error } = await supabase.from("user_badge").upsert({
      user_id: userId,
      badge_id: badgeId,
      earned_date: new Date().toISOString(),
    }, { onConflict: "user_id,badge_id" }); // avoid duplicates
    if (error) console.error("Awarding badge failed:", error);
  },

  hasConsecutiveOnTimeMonths: (payments: any[], monthsRequired: number) => {
    if (!payments || payments.length === 0) return false;
    const paidMonths = payments.map(p => new Date(p.payment_date).toISOString().slice(0, 7)); // YYYY-MM
    const uniqueMonths = Array.from(new Set(paidMonths)).sort();
    let streak = 1;
    for (let i = 1; i < uniqueMonths.length; i++) {
      const prev = new Date(uniqueMonths[i - 1] + "-01");
      const curr = new Date(uniqueMonths[i] + "-01");
      const diffMonths = (curr.getFullYear() - prev.getFullYear()) * 12 + (curr.getMonth() - prev.getMonth());
      if (diffMonths === 1) streak++;
      else streak = 1;
      if (streak >= monthsRequired) return true;
    }
    return false;
  }
};
