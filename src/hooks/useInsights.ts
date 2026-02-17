import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { AIInsight } from '../types';

export const useInsights = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('ai_insights')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setInsights(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch insights');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error: updateError } = await supabase
        .from('ai_insights')
        .update({ is_read: true })
        .eq('id', id);

      if (updateError) throw updateError;
      await fetchInsights();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark insight as read');
    }
  };

  return {
    insights,
    loading,
    error,
    markAsRead,
    refetch: fetchInsights,
  };
};
