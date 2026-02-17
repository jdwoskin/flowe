import { formatCurrency } from '../utils/helpers';
import { ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
  income: number;
  spent: number;
  saved: number;
}

export const BalanceCard = ({ balance, income, spent, saved }: BalanceCardProps) => {
  return (
    <div className="gradient-border bg-gradient-to-br from-accent-purple/10 to-accent-pink/10 p-6 mb-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-white/60 text-sm font-medium mb-1">Available Balance</p>
          <h2 className="text-4xl font-syne font-bold text-gradient-purple">{formatCurrency(balance)}</h2>
        </div>
        <Wallet className="text-accent-purple" size={32} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <ArrowDownLeft className="text-accent-green" size={20} />
          </div>
          <p className="text-white/60 text-xs font-medium">Income</p>
          <p className="text-lg font-bold text-accent-green mt-1">{formatCurrency(income)}</p>
        </div>

        <div className="glass-card p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <ArrowUpRight className="text-red-400" size={20} />
          </div>
          <p className="text-white/60 text-xs font-medium">Spent</p>
          <p className="text-lg font-bold text-red-400 mt-1">{formatCurrency(spent)}</p>
        </div>

        <div className="glass-card p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Wallet className="text-accent-purple" size={20} />
          </div>
          <p className="text-white/60 text-xs font-medium">Saved</p>
          <p className="text-lg font-bold text-accent-purple mt-1">{formatCurrency(saved)}</p>
        </div>
      </div>
    </div>
  );
};
