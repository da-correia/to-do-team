import { supabase } from "./supabaseClient";

export const debtService = {
  // Get all debts for a user
  getDebts: async (user_id) => {
    const { data, error } = await supabase
    .from("debt")
    .select("*")
    .eq("user_id", user_id);
    if (error) throw error;
    return data;
  },

  // Create a new debt
  createDebt: async (debt) => {
    const { data, error } = await supabase
    .from("debt")
    .insert([debt]);
    if (error) throw error;
    return data;
  },

  // Update an existing debt
  updateDebt: async (id, updates) => {
    updates.updated_at = new Date().toISOString();
    const { data, error } = await supabase
    .from("debt")
    .update(updates)
    .eq("id", id);
    if (error) throw error;
    return data;
  },

  // Delete a debt
  deleteDebt: async (id) => {
    const { data, error } = await supabase
    .from("debt")
    .delete()
    .eq("id", id);
    if (error) throw error;
    return data;
  }
};
