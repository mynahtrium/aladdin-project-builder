"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Sparkles, RefreshCw, Paperclip, Brain, BrainCircuit } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { AladdinLauncher } from '@/components/aladdin/AladdinLauncher';
import { useLanguage } from '@/contexts/LanguageContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatInterface: React.FC = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [isDeepThinking, setIsDeepThinking] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasUserInteracted = useRef(false);

  // Initialize or update welcome message when language changes, 
  // but only if the user hasn't started a conversation
  useEffect(() => {
    if (!hasUserInteracted.current && messages.length <= 1) {
      setMessages([{ role: 'assistant', content: t('chat.welcome') }]);
    }
  }, [t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    hasUserInteracted.current = true;
    let finalInput = input;
    if (isDeepThinking) {
      finalInput += "\n\n[System Note: Please analyze this deeply using scientific principles and step-by-step reasoning.]";
    }

    const userMessage = { role: 'user' as const, content: input }; // Display original input
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Send the modified input to the backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, { role: 'user', content: finalInput }] 
        }),
      });

      const data = await response.json();
      
      if (data.message) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      }
      
      if (data.generatedPrompt) {
        setGeneratedPrompt(data.generatedPrompt);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: t('chat.error') }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReset = () => {
    hasUserInteracted.current = false;
    setMessages([{ role: 'assistant', content: t('chat.welcome') }]);
    setGeneratedPrompt(null);
    setIsDeepThinking(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional: Visual feedback or toast could be added here
    console.log(`Reading file: ${file.name}`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        // We append the file content to the input but make it visible to the user immediately
        // so they know it's attached.
        setInput((prev) => {
          const prefix = prev.trim() ? prev + "\n\n" : "";
          return prefix + `[Attached File: ${file.name}]\n${text}\n`;
        });
      }
    };
    
    reader.onerror = (err) => {
        console.error("Error reading file:", err);
        alert("Failed to read file");
    };

    reader.readAsText(file);
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  return (
    <div className="flex flex-col h-[80vh] w-full max-w-4xl mx-auto relative">
      {/* Main Chat Area - Expanded since header is gone */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.length === 1 ? (
             <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                 <Sparkles size={48} className="text-gray-600" />
                 <p className="text-lg">{t('chat.ready')}</p>
             </div>
        ) : (
            messages.map((msg, index) => (
                <MessageBubble key={index} role={msg.role} content={msg.content} />
            ))
        )}
        
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-400 text-sm p-6 animate-pulse">
            <Sparkles size={16} /> {t('chat.thinking')}
          </div>
        )}
        <div ref={messagesEndRef} />
        
        {generatedPrompt && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AladdinLauncher prompt={generatedPrompt} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#111111]">
        <div className={`relative w-full max-w-3xl mx-auto bg-[#2c2c2e] rounded-2xl border ${isDeepThinking ? 'border-purple-500/50 shadow-purple-900/20' : 'border-gray-700/50'} shadow-lg focus-within:ring-1 focus-within:ring-gray-600 transition-all`}>
          <Input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={handleKeyDown}
            placeholder={isDeepThinking ? t('chat.deepThinking') : t('chat.placeholder')}
            disabled={isLoading || !!generatedPrompt}
            className="w-full bg-transparent border-0 focus-visible:ring-0 text-gray-100 placeholder:text-gray-500 py-4 pl-4 pr-32 h-14 text-base"
          />
          
          <div className="absolute right-2 top-2 bottom-2 flex items-center gap-2">
             <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsDeepThinking(!isDeepThinking)}
                className={`rounded-lg h-9 w-9 transition-colors ${isDeepThinking ? 'text-purple-400 bg-purple-500/10 hover:bg-purple-500/20' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'}`}
                title={t('chat.deepThinkingTitle')}
             >
                {isDeepThinking ? <BrainCircuit size={18} /> : <Brain size={18} />}
             </Button>
             
             <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 rounded-lg h-9 w-9"
                title={t('chat.attachFile')}
             >
                <Paperclip size={18} />
             </Button>
             <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".txt,.md,.csv,.json,.js,.ts"
                onChange={handleFileUpload}
             />

            <Button 
                onClick={handleSendMessage} 
                disabled={isLoading || !!generatedPrompt || !input.trim()} 
                size="icon"
                className={`rounded-lg h-9 w-9 transition-colors ${
                    input.trim() 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
        
        <div className="text-center mt-3 text-xs text-gray-500">
            {t('chat.disclaimer')}
            {messages.length > 1 && (
                 <Button variant="link" size="sm" onClick={handleReset} className="text-gray-500 hover:text-gray-300 ml-2 h-auto p-0">
                    <RefreshCw size={12} className="mr-1" /> {t('chat.reset')}
                 </Button>
            )}
        </div>
      </div>
    </div>
  );
};
