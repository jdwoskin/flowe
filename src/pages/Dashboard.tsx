import { useEffect, useState } from 'react';
import { BalanceCard } from '../components/BalanceCard';
import { AIInsightCard } from '../components/AIInsightCard';
import { TransactionItem } from '../components/TransactionItem';
import { CategoryCard } from '../components/CategoryCard';
import { useTransactions } from '../hooks/useTransactions';
import { Transaction } from '../types';

export const Dashboard = () => {
  const { transactions } = useTransactions();
  const [balance, setBalance] = useState(4280.5);
  const [income, setIncome] = useState(5200);
  const [spent, setSpent] = useState(0);
  const [saved, setSaved] = useState(0);
  const [categories, setCategories] = useState<Record<string, number>>({});

  useEffect(() => {
    // Calculate totals
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryTotals: Record<string, number> = {};

    transactions.forEach((t) => {
      if (t.type === 'income') {
        totalIncome += t.amount;
      } else {
        totalExpense += Math.abs(t.amount);
      }

      if (!categoryTotals[t.category]) {
        categoryTotals[t.category] = 0;
      }
      categoryTotals[t.category] += Math.abs(t.amount);
    });

    setIncome(totalIncome);
    setSpent(totalExpense);
    setSaved(totalIncome - totalExpense);
    setCategories(categoryTotals);
  }, [transactions]);

  const topCategories = Object.entries(categories)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .reduce(
      (acc, [cat, amount]) => {
        acc[cat] = amount;
        return acc;
      },
      {} as Record<string, number>
    );

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#0a0a0f] pb-32 pt-4">
      <div className="max-w-[390px] mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-white/60 text-sm">Welcome back,</p>
            <h1 className="text-2xl font-syne font-bold">Jordan</h1>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center">
            <span className="text-xl">✦</span>
          </div>
        </div>

        <BalanceCard balance={balance} income={income} spent={spent} saved={saved} />

        <AIInsightCard
          title="Smart Savings Opportunity"
          description="You have $4,280 available. Based on your goals, putting $800 into savings this week would get you to your emergency fund goal 3 weeks early."
        />

        <div className="mb-6">
          <h2 className="text-white font-syne font-bold text-lg mb-3">Spending by Category</h2>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(topCategories).map(([category, amount]) => (
              <CategoryCard key={category} category={category} amount={amount} />
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-syne font-bold text-lg">Recent Transactions</h2>
            <a href="/transactions" className="text-accent-purple text-sm font-semibold hover:text-accent-pink transition-colors">
              View all
            </a>
          </div>
          <div className="space-y-2">
            {recentTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
