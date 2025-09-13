import { supabase } from "../supabaseClient";

export type User = {
  id: string | null; // Supabase UUID
  name: string | null;
  email: string | null;
  level: string | null;
  isActive: boolean | null;
  created_at: string | null;
  updated_at: string | null;
};

export type NewUser = {
  name: string;
  email: string;
};

export const userService = {
  create: async ({ name, email }: NewUser) => {
    const { data, error } = await supabase
      .from("users")
      .insert({ name, email })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

