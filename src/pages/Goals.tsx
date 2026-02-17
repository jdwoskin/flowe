import { useState } from 'react';
import { useGoals } from '../hooks/useGoals';
import { GoalCard } from '../components/GoalCard';
import { Plus } from 'lucide-react';

export const Goals = () => {
  const { goals, addGoal, loading } = useGoals();
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', amount: '' });

  const handleAddGoal = async () => {
    if (newGoal.name.trim() && newGoal.amount) {
      await addGoal(newGoal.name, parseFloat(newGoal.amount), '🎯');
      setNewGoal({ name: '', amount: '' });
      setShowForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] pb-32 pt-4">
      <div className="max-w-[390px] mx-auto px-4">
        <h1 className="text-2xl font-syne font-bold mb-6">Financial Goals</h1>

        <div className="space-y-3 mb-6">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              icon={goal.icon}
              name={goal.name}
              targetAmount={goal.target_amount}
              currentAmount={goal.current_amount}
            />
          ))}
        </div>

        {showForm && (
          <div className="glass-card p-5 mb-6">
            <input
              type="text"
              placeholder="Goal name"
              value={newGoal.name}
              onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
              className="input-field mb-3"
            />
            <input
              type="number"
              placeholder="Target amount"
              value={newGoal.amount}
              onChange={(e) => setNewGoal({ ...newGoal, amount: e.target.value })}
              className="input-field mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddGoal}
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? 'Adding...' : 'Add Goal'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="glass-card-hover w-full p-4 flex items-center justify-center gap-2 text-white font-semibold"
          >
            <Plus size={20} />
            Add New Goal
          </button>
        )}
      </div>
    </div>
  );
};
