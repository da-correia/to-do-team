import { supabase } from "../supabaseClient";

interface DebtFilter {
    type?: string;           // e.g., "Credit Card", "Loan"
    minBalance?: number;     // filter debts above this balance
    maxBalance?: number;     // filter debts below this balance
    dueBefore?: Date;        // debts due before a date
    dueAfter?: Date;         // debts due after a date
}

export const RepaymentPlanService = {

    // Gets The Plan
    getPlanSummary: async (userId: number, projectionDays = 30, filter: DebtFilter = {}) => {
        let query = supabase
            .from("debt")
            .select("id, balance, interest_rate, minimum_payment, type, due_date")
            .eq("user_id", userId)
            .eq("is_active", true);

        // Apply optional filters
        if (filter.type) query = query.eq("type", filter.type);
        if (filter.minBalance !== undefined) query = query.gte("balance", filter.minBalance);
        if (filter.maxBalance !== undefined) query = query.lte("balance", filter.maxBalance);
        if (filter.dueBefore) query = query.lte("due_date", filter.dueBefore.toISOString().split("T")[0]);
        if (filter.dueAfter) query = query.gte("due_date", filter.dueAfter.toISOString().split("T")[0]);

        const { data: debts, error: debtError } = await query;

        if (debtError) throw debtError;

        const { data: payments, error: paymentError } = await supabase
            .from("payment")
            .select("id, debt_id, amount, payment_date")
            .in("debt_id", debts.map(d => d.id));

        if (paymentError) throw paymentError;

        const now = new Date();
        const projectionEnd = new Date(now.getTime() + projectionDays * 24 * 60 * 60 * 1000);

        // --- Past payments ---
        const pastPayments = payments
            .filter(p => new Date(p.payment_date) <= now)
            .reduce((sum, p) => sum + Number(p.amount), 0);

        // --- Future projection for the next N days ---
        let projectedFuturePayments = 0;
        let projectedInterest = 0;

        debts.forEach(d => {
            const balance = Number(d.balance);
            const minPayment = Number(d.minimum_payment) || 0;
            const monthlyRate = Number(d.interest_rate) / 100 / 12;

            // Daily interest approximation
            const dailyRate = monthlyRate / 30;
            const interest = balance * dailyRate * projectionDays;
            projectedInterest += interest;

            // Projected payment: assume minimum payment if balance > 0
            const payment = Math.min(balance + interest, minPayment);
            projectedFuturePayments += payment;
        });

        // --- Total balances ---
        const totalBalance = debts.reduce((sum, d) => sum + Number(d.balance), 0);
        const projectedBalanceAfter = totalBalance - projectedFuturePayments + projectedInterest;

        // --- Simple payoff estimate ---
        const payoffMonths = debts.reduce((sum, d) => {
            const months = Math.ceil(Number(d.balance) / (Number(d.minimum_payment) || 1));
            return Math.max(sum, months);
        }, 0);

        const payoffEstimate = `${Math.floor(payoffMonths / 12)} yr ${payoffMonths % 12} mo`;

        return {
            totalBalance,
            projectedBalanceAfter,
            pastPayments,
            projectedFuturePayments,
            projectedInterest,
            payoffEstimate,
            projectionStart: now.toISOString().split("T")[0],
            projectionEnd: projectionEnd.toISOString().split("T")[0],
            projectionDays,
            totalDebts: debts.length
        };
    },

    // Get distinct debt types
    getDebtType: async (): Promise<string[]> => {
        const { data, error } = await supabase
            .from("debt")
            .select("type", { count: "exact", head: false }) // select type column
            .neq("type", null); // exclude null types

        if (error) throw error;

        // Extract unique types
        const uniqueTypes = Array.from(new Set(data?.map(d => d.type) || []));
        return uniqueTypes;
    },

};
