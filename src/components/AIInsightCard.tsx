import { Zap } from 'lucide-react';

interface AIInsightCardProps {
  title: string;
  description: string;
}

export const AIInsightCard = ({ title, description }: AIInsightCardProps) => {
  return (
    <div className="gradient-border bg-gradient-to-br from-accent-purple/10 to-accent-pink/10 p-5 mb-6">
      <div className="flex gap-4">
        <div className="flex-shrink-0 mt-1">
          <Zap className="text-accent-green" size={24} />
        </div>
        <div>
          <p className="text-white font-semibold text-sm mb-1 font-syne">{title}</p>
          <p className="text-white/70 text-sm leading-relaxed">{description}</p>
          <button className="text-accent-purple text-sm font-semibold mt-3 hover:text-accent-pink transition-colors">
            Ask Flowe →
          </button>
        </div>
      </div>
    </div>
  );
};
