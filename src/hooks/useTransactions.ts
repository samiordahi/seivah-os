import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface TransactionFilters {
  context?: 'pessoal' | 'profissional';
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  category?: string;
  type?: string;
  status?: string;
}

export function useTransactions(filters: TransactionFilters = {}) {
  const queryClient = useQueryClient();

  const transactionsQuery = useQuery({
    queryKey: ['transactions', filters],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      // Apply filters
      if (filters.context) {
        query = query.eq('context', filters.context);
      }

      if (filters.search) {
        query = query.ilike('description', `%${filters.search}%`);
      }

      if (filters.dateFrom) {
        query = query.gte('date', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.lte('date', filters.dateTo);
      }

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.type) {
        query = query.eq('type', filters.type);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data;
    },
  });

  const updateTransaction = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<any> }) => {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: "Sucesso",
        description: "Transação atualizada com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar transação",
        variant: "destructive",
      });
    },
  });

  const deleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: "Sucesso",
        description: "Transação excluída com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao excluir transação",
        variant: "destructive",
      });
    },
  });

  return {
    data: transactionsQuery.data,
    isLoading: transactionsQuery.isLoading,
    error: transactionsQuery.error,
    updateTransaction: updateTransaction.mutate,
    deleteTransaction: deleteTransaction.mutate,
    isUpdating: updateTransaction.isPending,
    isDeleting: deleteTransaction.isPending,
  };
}