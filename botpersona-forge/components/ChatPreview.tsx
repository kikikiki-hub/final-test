import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User as UserIcon, RefreshCw } from 'lucide-react';
import { GeneratedPersona, ChatMessage } from '../types';
import { sendChatMessage } from '../services/geminiService';

interface ChatPreviewProps {
  persona: GeneratedPersona;
  botName: string;
}

export const ChatPreview: React.FC<ChatPreviewProps> = ({ persona, botName }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<{ role: string; parts: { text: string }[] }[]>([]);

  // Initialize chat with welcome message when persona changes
  useEffect(() => {
    setMessages([{ role: 'model', text: persona.welcomeMessage }]);
    historyRef.current = []; 
    // We don't add the welcome message to historyRef strictly for Gemini's SDK if we want to start fresh,
    // but usually it helps to keep context. However, for a clean slate logic:
    historyRef.current.push({ role: 'model', parts: [{ text: persona.welcomeMessage }] });
  }, [persona]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      // Prepare history for API (excluding the message we just added to UI state, as we pass it as current message)
      // Actually, the service function takes history. Let's format the state into history.
      // The history needs to be alternating user/model.
      
      const response = await sendChatMessage(
        historyRef.current,
        userMsg,
        persona.systemInstruction
      );

      // Update history ref
      historyRef.current.push({ role: 'user', parts: [{ text: userMsg }] });
      historyRef.current.push({ role: 'model', parts: [{ text: response }] });

      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, { role: 'model', text: "Error: I lost my train of thought." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-slate-800/50 rounded-xl border border-slate-700 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900/80 px-4 py-3 border-b border-slate-700 flex items-center justify-between backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">{botName || 'Bot Preview'}</h3>
            <p className="text-xs text-blue-400">bot</p>
          </div>
        </div>
        <button 
          onClick={() => {
            setMessages([{ role: 'model', text: persona.welcomeMessage }]);
            historyRef.current = [{ role: 'model', parts: [{ text: persona.welcomeMessage }] }];
          }}
          className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400"
          title="Reset Chat"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/30">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-md ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-3 border border-slate-700 flex items-center space-x-2">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message..."
            className="w-full bg-slate-800 text-white rounded-full pl-5 pr-12 py-3 border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder-slate-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
