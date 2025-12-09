import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, RefreshCw, AlertTriangle } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageStream, resetSession } from '../services/geminiService';
import { GenerateContentResponse } from '@google/genai';

const TriageBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "Hi, I'm Sam. I can help you decide if you need an ER, Urgent Care, or just some rest. What symptoms are you experiencing?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const streamResponse = await sendMessageStream(userMsg.text);
      
      const botMsgId = (Date.now() + 1).toString();
      // Add placeholder for bot message
      setMessages(prev => [...prev, {
        id: botMsgId,
        role: 'model',
        text: '',
        isStreaming: true
      }]);

      let fullText = '';
      
      for await (const chunk of streamResponse) {
        const c = chunk as GenerateContentResponse;
        const text = c.text || '';
        fullText += text;
        
        setMessages(prev => prev.map(msg => 
          msg.id === botMsgId 
            ? { ...msg, text: fullText }
            : msg
        ));
      }
      
      setMessages(prev => prev.map(msg => 
        msg.id === botMsgId 
          ? { ...msg, isStreaming: false }
          : msg
      ));

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "I'm having trouble connecting to the triage service. Please call 911 if this is a medical emergency."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    resetSession();
    setMessages([{
      id: Date.now().toString(),
      role: 'model',
      text: "Hi, I'm Sam. Let's start over. What symptoms are you experiencing?"
    }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 p-4 flex items-center justify-between text-white shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Bot size={24} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold">Triage Assistant</h2>
            <p className="text-xs text-blue-100 opacity-90">AI-powered medical guidance</p>
          </div>
        </div>
        <button 
          onClick={handleReset}
          className="p-2 hover:bg-blue-700 rounded-lg transition-colors text-blue-100 hover:text-white"
          title="Restart Chat"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {/* Warning Banner */}
      <div className="bg-red-50 border-b border-red-100 p-2 text-center text-xs text-red-700 flex items-center justify-center gap-2">
        <AlertTriangle size={14} />
        <span>This is an AI tool. For life-threatening emergencies, call 911 immediately.</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
              }`}
            >
              <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</div>
              {msg.isStreaming && (
                 <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-pulse ml-1"></span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your symptoms here..."
            className="flex-1 bg-gray-100 border-0 text-gray-900 text-sm rounded-full focus:ring-2 focus:ring-blue-500 focus:bg-white block w-full pl-5 p-3 transition-all"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className={`p-3 rounded-full text-white shadow-md transition-all ${
              isLoading || !inputValue.trim()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TriageBot;