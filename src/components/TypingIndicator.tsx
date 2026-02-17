export const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1 mb-3">
      <span className="text-2xl mr-3">✦</span>
      <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-bl-none flex gap-1">
        <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse-dot" />
        <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse-dot" style={{ animationDelay: '0.2s' }} />
        <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse-dot" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  );
};
