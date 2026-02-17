import { formatCurrency, getCategoryEmoji, getCategoryColor } from '../utils/helpers';

interface CategoryCardProps {
  category: string;
  amount: number;
}

export const CategoryCard = ({ category, amount }: CategoryCardProps) => {
  const emoji = getCategoryEmoji(category);
  const gradientColor = getCategoryColor(category);

  return (
    <div className="glass-card-hover p-4 text-center">
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${gradientColor} mb-2 mx-auto`}>
        <span className="text-xl">{emoji}</span>
      </div>
      <p className="text-white/70 text-xs font-medium mb-1">{category}</p>
      <p className="text-white font-bold text-sm">{formatCurrency(amount)}</p>
    </div>
  );
};
