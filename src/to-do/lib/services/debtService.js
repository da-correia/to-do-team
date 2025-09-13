import { supabase } from "./supabaseClient";

export const debtService = {
  // Get all debts for the authenticated user
  getDebts: async (userId) => {
    const { data, error } = await supabase
    .from("debt")
    .select("*")
    .eq("user_id", userId);
    if (error) throw error;
    return data;
  },

  // Create a new debt for the authenticated user
  createDebt: async (userId, debt) => {
    const { data, error } = await supabase
    .from("debt")
    .insert([{ ...debt, user_id: userId }]);
    if (error) throw error;
    return data;
  },

  // Update a debt (must belong to the user)
  updateDebt: async (userId, id, updates) => {
    updates.updated_at = new Date().toISOString();
    const { data, error } = await supabase
    .from("debt")
    .update(updates)
    .eq("id", id)
    .eq("user_id", userId);
    if (error) throw error;
    return data;
  },

  // Delete a debt (must belong to the user)
  deleteDebt: async (userId, id) => {
    const { data, error } = await supabase
    .from("debt")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
    if (error) throw error;
    return data;
  }
};
