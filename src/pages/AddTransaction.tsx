import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions';
import { formatCurrency, getCategoryEmoji } from '../utils/helpers';
import { ChevronLeft } from 'lucide-react';

const CATEGORIES = [
  { name: 'Food', emoji: '🍔' },
  { name: 'Housing', emoji: '🏠' },
  { name: 'Transport', emoji: '🚗' },
  { name: 'Entertainment', emoji: '🎬' },
  { name: 'Health', emoji: '💊' },
  { name: 'Shopping', emoji: '🛍️' },
  { name: 'Subscriptions', emoji: '📱' },
  { name: 'Other', emoji: '✨' },
];

export const AddTransaction = () => {
  const navigate = useNavigate();
  const { addTransaction, loading } = useTransactions();

  const [amount, setAmount] = useState('0');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAddDigit = (digit: string) => {
    if (amount === '0') {
      setAmount(digit);
    } else {
      setAmount(amount + digit);
    }
  };

  const handleBackspace = () => {
    if (amount.length === 1) {
      setAmount('0');
    } else {
      setAmount(amount.slice(0, -1));
    }
  };

  const handleDecimal = () => {
    if (!amount.includes('.')) {
      setAmount(amount + '.');
    }
  };

  const handleSave = async () => {
    const numAmount = parseFloat(amount);
    if (numAmount > 0 && description.trim()) {
      await addTransaction(numAmount, type, description, category, date);
      navigate('/');
    }
  };

  const displayAmount = parseFloat(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="min-h-screen bg-[#0a0a0f] pb-32">
      <div className="max-w-[390px] mx-auto px-4 pt-4">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl font-syne font-bold">Add Transaction</h1>
        </div>

        <div className="glass-card p-6 mb-6 text-center">
          <p className="text-white/60 text-sm mb-2">{type === 'expense' ? 'Amount Spent' : 'Amount Earned'}</p>
          <p className="text-5xl font-syne font-bold text-gradient-purple mb-4">${displayAmount}</p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => setType('expense')}
              className={`py-2 px-4 rounded-xl font-semibold transition-all duration-300 ${
                type === 'expense'
                  ? 'bg-accent-purple text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              Expense
            </button>
            <button
              onClick={() => setType('income')}
              className={`py-2 px-4 rounded-xl font-semibold transition-all duration-300 ${
                type === 'income'
                  ? 'bg-accent-green text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              Income
            </button>
          </div>
        </div>

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field mb-6"
        />

        <div className="mb-6">
          <p className="text-white/60 text-sm font-medium mb-3">Category</p>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setCategory(cat.name)}
                className={`p-3 rounded-2xl transition-all duration-300 ${
                  category === cat.name
                    ? 'glass-card bg-accent-purple/20 border-accent-purple ring-2 ring-accent-purple'
                    : 'glass-card hover:bg-white/10'
                }`}
              >
                <div className="text-2xl mb-1">{cat.emoji}</div>
                <p className="text-white text-xs font-medium">{cat.name}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-white/60 text-sm font-medium mb-3">Date</p>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              onClick={() => handleAddDigit(num)}
              className="glass-card-hover py-3 font-semibold text-lg"
            >
              {num}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6">
          <button onClick={() => handleAddDigit('0')} className="glass-card-hover py-3 font-semibold text-lg col-span-2">
            0
          </button>
          <button onClick={handleDecimal} className="glass-card-hover py-3 font-semibold text-lg">
            .
          </button>
        </div>

        <button
          onClick={handleBackspace}
          className="glass-card-hover py-3 font-semibold w-full mb-4 text-lg text-red-400"
        >
          ← Delete
        </button>

        <button
          onClick={handleSave}
          disabled={loading || !description.trim() || parseFloat(amount) === 0}
          className="btn-primary w-full text-lg"
        >
          {loading ? 'Saving...' : 'Save Transaction'}
        </button>
      </div>
    </div>
  );
};
