import { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 animate-slide-up`}>
      {!isUser && <span className="text-2xl mr-3 self-end mb-2">✦</span>}

      <div
        className={`max-w-xs px-4 py-3 rounded-2xl ${
          isUser
            ? 'bg-gradient-to-r from-accent-purple to-accent-pink text-white rounded-br-none'
            : 'bg-white/10 text-white rounded-bl-none'
        }`}
      >
        <p className="text-sm leading-relaxed">{message.message_text}</p>
      </div>
    </div>
  );
};
