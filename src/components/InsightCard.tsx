import { AIInsight } from '../types';

interface InsightCardProps {
  insight: AIInsight;
  onAskFlowe: () => void;
}

export const InsightCard = ({ insight, onAskFlowe }: InsightCardProps) => {
  const getBadgeStyle = () => {
    switch (insight.type) {
      case 'savings_opportunity':
        return 'bg-accent-green/20 text-accent-green';
      case 'spending_alert':
        return 'bg-red-500/20 text-red-400';
      case 'subscription_audit':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-accent-purple/20 text-accent-purple';
    }
  };

  const getTypeLabel = () => {
    switch (insight.type) {
      case 'savings_opportunity':
        return '💡 Savings Opportunity';
      case 'spending_alert':
        return '⚠️ Spending Alert';
      case 'subscription_audit':
        return '🔍 Subscription Audit';
      default:
        return '✨ Insight';
    }
  };

  return (
    <div className="glass-card-hover p-5 mb-4">
      <div className="flex items-start gap-3 mb-3">
        <div className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getBadgeStyle()}`}>
          {getTypeLabel()}
        </div>
      </div>

      <h3 className="text-white font-bold text-sm font-syne mb-2">{insight.title}</h3>
      <p className="text-white/70 text-sm leading-relaxed mb-3">{insight.description}</p>

      <button
        onClick={onAskFlowe}
        className="text-accent-purple text-sm font-semibold hover:text-accent-pink transition-colors"
      >
        Ask Flowe →
      </button>
    </div>
  );
};
