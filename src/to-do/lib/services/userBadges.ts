import { supabase } from "../supabaseClient";
import { Badge } from "./badges";

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_date: string;
}

// Award a badge to a user
export async function awardBadge(user_id: string, badge_id: string): Promise<UserBadge> {
  // Check if user already has the badge
  const { data: existing } = await supabase
  .from("user_badge")
  .select("*")
  .eq("user_id", user_id)
  .eq("badge_id", badge_id)
  .single();

  if (existing) throw new Error("Badge already earned");

  const { data, error } = await supabase
  .from("user_badge")
  .insert([{ user_id, badge_id, earned_date: new Date() }])
  .select()
  .single();

  if (error) throw error;
  return data as UserBadge;
}

// Get all badges earned by a user
export async function getUserBadges(user_id: string): Promise<(UserBadge & { badge: Badge })[]> {
  const { data, error } = await supabase
  .from("user_badge")
  .select("*, badge(*)")
  .eq("user_id", user_id);

  if (error) throw error;
  return data as (UserBadge & { badge: Badge })[];
}

// Remove a badge from a user
export async function removeUserBadge(user_id: string, badge_id: string) {
  const { data, error } = await supabase
  .from("user_badge")
  .delete()
  .eq("user_id", user_id)
  .eq("badge_id", badge_id);

  if (error) throw error;
  return data;
}
