import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { ChatMessage } from '../types';

export const useChat = (conversationId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, [conversationId]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      setMessages(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (messageText: string) => {
    try {
      const { error: insertError } = await supabase.from('chat_messages').insert([
        {
          sender: 'user',
          message_text: messageText,
          conversation_id: conversationId,
        },
      ]);

      if (insertError) throw insertError;
      await fetchMessages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  };

  const addAIMessage = async (messageText: string) => {
    try {
      const { error: insertError } = await supabase.from('chat_messages').insert([
        {
          sender: 'ai',
          message_text: messageText,
          conversation_id: conversationId,
        },
      ]);

      if (insertError) throw insertError;
      await fetchMessages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add AI message');
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    addAIMessage,
    refetch: fetchMessages,
  };
};
