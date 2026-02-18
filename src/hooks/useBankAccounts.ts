import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export interface BankAccount {
  id: string;
  user_id: string;
  bank_name: string;
  account_type: 'checking' | 'savings';
  last_four: string;
  is_connected: boolean;
  last_synced: string | null;
  sync_error: string | null;
  created_at: string;
}

export const useBankAccounts = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('bank_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setAccounts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bank accounts');
    } finally {
      setLoading(false);
    }
  };

  const connectBank = async (
    bankName: string,
    accountType: 'checking' | 'savings',
    lastFour: string
  ) => {
    try {
      const { error: insertError } = await supabase.from('bank_accounts').insert([
        {
          bank_name: bankName,
          account_type: accountType,
          last_four: lastFour,
          is_connected: true,
        },
      ]);

      if (insertError) throw insertError;
      await fetchAccounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect bank account');
    }
  };

  const disconnectBank = async (id: string) => {
    try {
      const { error: updateError } = await supabase
        .from('bank_accounts')
        .update({ is_connected: false })
        .eq('id', id);

      if (updateError) throw updateError;
      await fetchAccounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect bank account');
    }
  };

  const deleteBank = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('bank_accounts')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await fetchAccounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete bank account');
    }
  };

  const syncBankTransactions = async (accountId: string) => {
    try {
      setError(null);
      await supabase
        .from('bank_accounts')
        .update({ last_synced: new Date().toISOString() })
        .eq('id', accountId);

      await fetchAccounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync transactions');
    }
  };

  return {
    accounts,
    loading,
    error,
    connectBank,
    disconnectBank,
    deleteBank,
    syncBankTransactions,
    refetch: fetchAccounts,
  };
};
