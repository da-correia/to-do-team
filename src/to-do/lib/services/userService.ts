import { supabase } from "../supabaseClient";

export const userService = {
  getUserById: async (userId) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) throw error;
    return data;
  },
};
