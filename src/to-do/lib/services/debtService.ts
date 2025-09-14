import { supabase } from "../supabaseClient";

export type Debt = {
  id: number | null;
  user_id: string | null; // Changed to string for Supabase UUID
  debt_name: string | null;
  type: string | null;
  balance: number | null;
  interest_rate: number | null;
  minimum_payment: number | null;
  due_date: Date | null;
  isActive: boolean | null;
  created_at: string | null;
  updated_at: string | null;
};

export type NewDebt = {
  debt_name: string;
  type: string;
  balance: number;
  interest_rate: number;
  minimum_payment: number;
  due_date?: Date;
};

export const debtService = {
  create: async (debtData: NewDebt) => {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const newDebt = {
      ...debtData,
      user_id: user.id,
      due_date: debtData.due_date || new Date(),
    };

    const { data, error } = await supabase
      .from("debt")
      .insert(newDebt)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  getByUserId: async () => {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log("Current user:", user);
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("debt")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  getUpcomingDebts: async () => {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log("Current user:", user);
    if (!user) throw new Error("User not authenticated");

    const today = new Date().toISOString().split("T")[0];
    const next7Days = new Date();
    next7Days.setDate(next7Days.getDate() + 7);
    const next7DaysStr = next7Days.toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("debt")
      .select("*")
      .eq("user_id", user.id)
      .gte("due_date", today)
      .lte("due_date", next7DaysStr)
      .order("due_date", { ascending: true });

    if (error) throw error;
    return data;
  },

  delete: async (id: number) => {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("debt")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id); // Ensure user can only delete their own debts

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  update: async (id: number, updatedData: Partial<Debt>) => {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Remove user_id from update data to prevent changing ownership
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user_id, ...dataToUpdate } = updatedData;

    const { data, error } = await supabase
      .from("debt")
      .update({
        ...dataToUpdate,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id) // Ensure user can only update their own debts
      .select();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },
};

