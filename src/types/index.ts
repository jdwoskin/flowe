export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  description: string;
  category: string;
  date: string;
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  icon: string;
  deadline: string | null;
  created_at: string;
}

export interface AIInsight {
  id: string;
  user_id: string;
  type: 'savings_opportunity' | 'spending_alert' | 'subscription_audit';
  title: string;
  description: string;
  badge_color: string;
  is_read: boolean;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  sender: 'user' | 'ai';
  message_text: string;
  conversation_id: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export type CategoryType = 'Housing' | 'Food' | 'Transport' | 'Entertainment' | 'Health' | 'Shopping' | 'Subscriptions' | 'Salary' | 'Other';
