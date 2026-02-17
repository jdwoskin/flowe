import { useState, useEffect, useRef } from 'react';
import { useChat } from '../hooks/useChat';
import { ChatMessage } from '../components/ChatMessage';
import { TypingIndicator } from '../components/TypingIndicator';
import { generateAIResponse, generateConversationId } from '../utils/helpers';
import { Send } from 'lucide-react';

export const Chat = () => {
  const conversationId = 'main';
  const { messages, sendMessage, addAIMessage } = useChat(conversationId);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    'Can I afford a vacation?',
    "How's my spending vs last month?",
    'Any subscription I can cancel?',
    'How to boost my savings?',
    'Suggest a monthly budget',
    'Am I on track with goals?',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    await sendMessage(text);
    setInput('');
    setIsTyping(true);

    setTimeout(async () => {
      const response = generateAIResponse(text);
      await addAIMessage(response);
      setIsTyping(false);
    }, 1500);
  };

  const handleSendClick = () => {
    if (input.trim()) {
      handleSendMessage(input);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] pb-32 pt-4 flex flex-col">
      <div className="max-w-[390px] w-full mx-auto px-4 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center">
            <span className="text-lg">✦</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm">Flowe AI</p>
            <p className="text-accent-green text-xs">● Online</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto mb-4 space-y-2">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <div className="text-4xl mb-3">✦</div>
              <p className="text-white font-syne font-bold mb-2">Hello, I'm Flowe</p>
              <p className="text-white/60 text-sm">Your AI financial advisor</p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isTyping && <TypingIndicator />}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 0 && (
          <div className="mb-4 space-y-2">
            <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Quick Questions</p>
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(suggestion)}
                className="glass-card-hover w-full text-left p-3 text-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-20 left-0 right-0 max-w-[390px] mx-auto px-4">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Ask Flowe..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendClick()}
            className="input-field"
          />
          <button
            onClick={handleSendClick}
            disabled={!input.trim()}
            className="flex-shrink-0 bg-accent-purple hover:bg-opacity-90 text-white p-3 rounded-2xl transition-all duration-300 active:scale-95 disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
