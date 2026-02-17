import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Goal } from '../types';

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setGoals(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch goals');
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async (
    name: string,
    targetAmount: number,
    icon: string,
    deadline?: string
  ) => {
    try {
      const { error: insertError } = await supabase.from('goals').insert([
        {
          name,
          target_amount: targetAmount,
          current_amount: 0,
          icon,
          deadline: deadline || null,
        },
      ]);

      if (insertError) throw insertError;
      await fetchGoals();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add goal');
    }
  };

  const updateGoal = async (id: string, currentAmount: number) => {
    try {
      const { error: updateError } = await supabase
        .from('goals')
        .update({ current_amount: currentAmount })
        .eq('id', id);

      if (updateError) throw updateError;
      await fetchGoals();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update goal');
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const { error: deleteError } = await supabase.from('goals').delete().eq('id', id);

      if (deleteError) throw deleteError;
      await fetchGoals();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete goal');
    }
  };

  return {
    goals,
    loading,
    error,
    addGoal,
    updateGoal,
    deleteGoal,
    refetch: fetchGoals,
  };
};
