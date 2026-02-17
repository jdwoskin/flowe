import { formatCurrency, formatDateShort, getCategoryEmoji } from '../utils/helpers';
import { Transaction } from '../types';

interface TransactionItemProps {
  transaction: Transaction;
}

export const TransactionItem = ({ transaction }: TransactionItemProps) => {
  const isIncome = transaction.type === 'income';
  const emoji = getCategoryEmoji(transaction.category);

  return (
    <div className="transaction-item">
      <div className="flex items-center gap-3 flex-1">
        <div className="text-2xl">{emoji}</div>
        <div className="flex-1">
          <p className="text-white font-medium text-sm">{transaction.description}</p>
          <p className="text-white/50 text-xs">{formatDateShort(transaction.date)}</p>
        </div>
      </div>
      <p className={`font-semibold text-sm ${isIncome ? 'text-accent-green' : 'text-white'}`}>
        {isIncome ? '+' : ''}{formatCurrency(transaction.amount)}
      </p>
    </div>
  );
};
