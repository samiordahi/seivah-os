import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type ContextFilter = 'all' | 'pessoal' | 'profissional';

interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  monthlyTransactions: number;
  currentBalance: number;
}

export function useFinancialSummary(contextFilter: ContextFilter) {
  return useQuery<FinancialSummary>({
    queryKey: ['financial-summary', contextFilter],
    queryFn: async () => {
      let query = supabase.from('transactions').select('amount, type, date');

      if (contextFilter !== 'all') {
        query = query.eq('context', contextFilter);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      let totalIncome = 0;
      let totalExpense = 0;
      let monthlyTransactions = 0;

      data?.forEach((transaction) => {
        const transactionDate = new Date(transaction.date);
        const amount = Number(transaction.amount);

        if (transaction.type === 'receita') {
          totalIncome += amount;
        } else {
          totalExpense += Math.abs(amount);
        }

        // Count transactions from current month
        if (
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        ) {
          monthlyTransactions++;
        }
      });

      return {
        totalIncome,
        totalExpense,
        monthlyTransactions,
        currentBalance: totalIncome - totalExpense,
      };
    },
  });
}