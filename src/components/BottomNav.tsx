import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Send, Plus, Sparkles, MessageCircle, Target } from 'lucide-react';

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/transactions', icon: Send, label: 'Transactions' },
    { path: '/add', icon: Plus, label: 'Add', special: true },
    { path: '/insights', icon: Sparkles, label: 'Insights' },
    { path: '/chat', icon: MessageCircle, label: 'Chat' },
    { path: '/goals', icon: Target, label: 'Goals' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-black/40 backdrop-blur-lg border-t border-white/10 pb-safe max-w-[390px] mx-auto">
      <div className="flex justify-around items-center px-2 py-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-300 ${
                tab.special
                  ? 'bg-accent-purple hover:bg-opacity-90 text-white scale-110 -mt-4 shadow-lg shadow-accent-purple/50 active:scale-95'
                  : isActive
                    ? 'text-accent-purple'
                    : 'text-white/60 hover:text-white/80'
              }`}
            >
              <Icon size={24} />
              {!tab.special && <span className="text-xs mt-1 font-medium">{tab.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
