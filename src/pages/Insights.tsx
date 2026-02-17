import { useNavigate } from 'react-router-dom';
import { useInsights } from '../hooks/useInsights';
import { useTransactions } from '../hooks/useTransactions';
import { InsightCard } from '../components/InsightCard';
import { BarChart3 } from 'lucide-react';

export const Insights = () => {
  const navigate = useNavigate();
  const { insights } = useInsights();
  const { transactions } = useTransactions();

  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];

    const dayTransactions = transactions.filter((t) => t.date === dateStr);
    const income = dayTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = dayTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      income,
      expenses,
    };
  });

  const maxValue = Math.max(...weeklyData.map((d) => Math.max(d.income, d.expenses)), 1000);

  return (
    <div className="min-h-screen bg-[#0a0a0f] pb-32 pt-4">
      <div className="max-w-[390px] mx-auto px-4">
        <h1 className="text-2xl font-syne font-bold mb-6">AI Insights</h1>

        <div className="glass-card p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="text-accent-purple" size={20} />
            <p className="text-white font-semibold text-sm">Weekly Overview</p>
          </div>

          <div className="h-40 flex items-end justify-between gap-1">
            {weeklyData.map((day, idx) => {
              const incomePct = (day.income / maxValue) * 100 || 5;
              const expensePct = (day.expenses / maxValue) * 100 || 5;
              const total = incomePct + expensePct;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end gap-1">
                  <div className="relative w-full flex flex-col items-center justify-end" style={{ height: `${total}px` }}>
                    {day.income > 0 && (
                      <div
                        className="w-3/4 bg-accent-green rounded-t-lg"
                        style={{ height: `${incomePct}px` }}
                        title={`Income: $${day.income}`}
                      />
                    )}
                    {day.expenses > 0 && (
                      <div
                        className="w-3/4 bg-red-500 rounded-b-lg"
                        style={{ height: `${expensePct}px` }}
                        title={`Expense: $${day.expenses}`}
                      />
                    )}
                  </div>
                  <p className="text-white/60 text-xs">{day.date}</p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-green" />
              <p className="text-white/60 text-xs">Income</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <p className="text-white/60 text-xs">Expenses</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-white font-syne font-bold text-lg mb-3">Smart Recommendations</h2>
          <div className="space-y-2">
            {insights.map((insight) => (
              <InsightCard
                key={insight.id}
                insight={insight}
                onAskFlowe={() => navigate('/chat')}
              />
            ))}
          </div>
        </div>

        {insights.length === 0 && (
          <div className="glass-card p-8 text-center">
            <p className="text-white/60 mb-2">No insights yet</p>
            <p className="text-white/40 text-sm">More insights will appear as you track your spending</p>
          </div>
        )}
      </div>
    </div>
  );
};
