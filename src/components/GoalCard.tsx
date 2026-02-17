import { formatCurrency } from '../utils/helpers';

interface GoalCardProps {
  icon: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
}

export const GoalCard = ({ icon, name, targetAmount, currentAmount }: GoalCardProps) => {
  const percentage = Math.round((currentAmount / targetAmount) * 100);

  return (
    <div className="glass-card-hover p-5 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{icon}</span>
          <div>
            <p className="text-white font-bold text-sm">{name}</p>
            <p className="text-white/60 text-xs">{percentage}% Complete</p>
          </div>
        </div>
      </div>

      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-accent-purple to-accent-pink transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-white/60">
        <span>{formatCurrency(currentAmount)}</span>
        <span>{formatCurrency(targetAmount)}</span>
      </div>
    </div>
  );
};
