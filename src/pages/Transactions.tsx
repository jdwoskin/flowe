import { useState, useMemo } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { TransactionItem } from '../components/TransactionItem';
import { formatCurrency, calculateMonthlyTotals, groupTransactionsByDate } from '../utils/helpers';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export const Transactions = () => {
  const { transactions } = useTransactions();
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filters = ['All', 'Income', 'Expenses', 'Housing', 'Food', 'Transport', 'Entertainment'];

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return transactions;
    if (activeFilter === 'Income') return transactions.filter((t) => t.type === 'income');
    if (activeFilter === 'Expenses') return transactions.filter((t) => t.type === 'expense');
    return transactions.filter((t) => t.category === activeFilter);
  }, [transactions, activeFilter]);

  const grouped = useMemo(() => {
    const map = groupTransactionsByDate(filtered);
    return Array.from(map.entries());
  }, [filtered]);

  const monthlyTotals = calculateMonthlyTotals(transactions);

  return (
    <div className="min-h-screen bg-[#0a0a0f] pb-32 pt-4">
      <div className="max-w-[390px] mx-auto px-4">
        <h1 className="text-2xl font-syne font-bold mb-6">Transactions</h1>

        <div className="glass-card p-4 mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-white/60 text-xs font-medium mb-1">Income</p>
              <p className="text-lg font-bold text-accent-green flex items-center justify-center gap-1">
                <ArrowDownLeft size={16} />
                {formatCurrency(monthlyTotals.income)}
              </p>
            </div>
            <div className="text-center border-l border-r border-white/10">
              <p className="text-white/60 text-xs font-medium mb-1">Expenses</p>
              <p className="text-lg font-bold text-red-400 flex items-center justify-center gap-1">
                <ArrowUpRight size={16} />
                {formatCurrency(monthlyTotals.expenses)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-white/60 text-xs font-medium mb-1">Net</p>
              <p className={`text-lg font-bold flex items-center justify-center gap-1 ${monthlyTotals.net >= 0 ? 'text-accent-green' : 'text-red-400'}`}>
                {formatCurrency(monthlyTotals.net)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 font-medium text-sm ${
                activeFilter === filter
                  ? 'bg-accent-purple text-white shadow-lg shadow-accent-purple/50'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {grouped.map(([dateStr, items]) => (
            <div key={dateStr}>
              <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">{dateStr}</h3>
              <div className="space-y-2">
                {items.map((transaction) => (
                  <TransactionItem key={transaction.id} transaction={transaction} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-white/60 text-sm mb-2">No transactions found</p>
            <p className="text-white/40 text-xs">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};
