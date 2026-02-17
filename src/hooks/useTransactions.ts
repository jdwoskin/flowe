import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Transaction } from '../types';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (fetchError) throw fetchError;
      setTransactions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (
    amount: number,
    type: 'income' | 'expense' | 'transfer',
    description: string,
    category: string,
    date: string
  ) => {
    try {
      const { error: insertError } = await supabase.from('transactions').insert([
        {
          amount: type === 'expense' ? -Math.abs(amount) : amount,
          type,
          description,
          category,
          date,
        },
      ]);

      if (insertError) throw insertError;
      await fetchTransactions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add transaction');
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error: deleteError } = await supabase.from('transactions').delete().eq('id', id);

      if (deleteError) throw deleteError;
      await fetchTransactions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete transaction');
    }
  };

  return {
    transactions,
    loading,
    error,
    addTransaction,
    deleteTransaction,
    refetch: fetchTransactions,
  };
};
