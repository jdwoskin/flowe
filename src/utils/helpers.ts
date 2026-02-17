export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
};

export const formatDateShort = (date: string): string => {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (d.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(d);
};

export const getCategoryEmoji = (category: string): string => {
  const emojiMap: Record<string, string> = {
    Housing: '🏠',
    Food: '🍔',
    Transport: '🚗',
    Entertainment: '🎬',
    Health: '💊',
    Shopping: '🛍️',
    Subscriptions: '📱',
    Salary: '💰',
    Fun: '🎬',
    Other: '✨',
  };
  return emojiMap[category] || '✨';
};

export const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    Housing: 'from-blue-500 to-blue-600',
    Food: 'from-green-500 to-emerald-600',
    Transport: 'from-orange-500 to-red-600',
    Entertainment: 'from-purple-500 to-pink-600',
    Health: 'from-rose-500 to-pink-600',
    Shopping: 'from-amber-500 to-orange-600',
    Subscriptions: 'from-violet-500 to-purple-600',
    Salary: 'from-green-400 to-emerald-500',
    Fun: 'from-pink-500 to-rose-600',
    Other: 'from-gray-500 to-slate-600',
  };
  return colorMap[category] || 'from-gray-500 to-slate-600';
};

export const groupTransactionsByDate = (
  transactions: Array<{ date: string; [key: string]: any }>
): Map<string, Array<{ date: string; [key: string]: any }>> => {
  const grouped = new Map();

  transactions.forEach((transaction) => {
    const dateStr = formatDate(transaction.date);
    if (!grouped.has(dateStr)) {
      grouped.set(dateStr, []);
    }
    grouped.get(dateStr)!.push(transaction);
  });

  return grouped;
};

export const calculateMonthlyTotals = (
  transactions: Array<{ type: string; amount: number }>
) => {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return {
    income,
    expenses,
    net: income - expenses,
  };
};

export const generateConversationId = (): string => {
  return `conv_${Date.now()}`;
};

export const generateAIResponse = (userMessage: string): string => {
  const responses: Record<string, string[]> = {
    vacation: [
      'Based on your current balance of $4,280 and your Vacation Fund at 35%, I\'d recommend saving another $2,000 before taking a trip. You could reach that in about 3 months with your current savings rate.',
      'A budget vacation of $2,000-3,000 could work within your current balance. However, I\'d suggest boosting your emergency fund first since it\'s not quite at full capacity.',
    ],
    spending: [
      'Your spending this month is tracking about 8% higher than last month, mainly due to increased entertainment expenses. I\'d suggest reviewing your entertainment budget.',
      'Good news! Your spending is actually 5% lower than last month. Your groceries have been efficiently managed.',
    ],
    savings: [
      'You could save an extra $300/month by canceling unused subscriptions and meal planning. That\'s $3,600 per year!',
      'Your savings rate of 12% is solid. To accelerate your goals, consider redirecting 5% of your entertainment budget to your emergency fund.',
    ],
    budget: [
      'I\'d recommend allocating 30% for housing, 20% for food, 10% for transport, and 15% for entertainment. That leaves 25% for savings and emergency funds.',
      'Based on your income, a good budget split would be: Essential expenses 50%, Goals 20%, Fun 15%, Emergency savings 15%.',
    ],
    afford: [
      'Let me check your finances... Yes, you can comfortably afford this with your current balance and savings rate.',
      'That depends on the price and your priorities. What\'s your target price range?',
    ],
  };

  const message = userMessage.toLowerCase();
  for (const [keyword, responseList] of Object.entries(responses)) {
    if (message.includes(keyword)) {
      return responseList[Math.floor(Math.random() * responseList.length)];
    }
  }

  return 'Based on your financial data, I\'d be happy to help. Could you tell me more about what you\'d like to know?';
};
