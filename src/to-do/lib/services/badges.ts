import { supabase } from "../supabaseClient";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  created_at: string;
  is_active: boolean;
}

// Get all active badges
export async function getAllBadges(): Promise<Badge[]> {
  const { data, error } = await supabase
  .from("badge")
  .select("*")
  .eq("is_active", true)
  .order("created_at", { ascending: true });

  if (error) throw error;
  return data as Badge[];
}

// Create a new badge
export async function createBadge(badge: Omit<Badge, "id" | "created_at">) {
  const { data, error } = await supabase
  .from("badge")
  .insert([{ ...badge, created_at: new Date() }])
  .select()
  .single();

  if (error) throw error;
  return data as Badge;
}
