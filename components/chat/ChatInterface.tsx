"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Sparkles, RefreshCw, Paperclip, Brain, BrainCircuit } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { AladdinLauncher } from '@/components/aladdin/AladdinLauncher';
import { ModelSelector } from './ModelSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { createClient } from '@/utils/supabase/client';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Message } from 'ai';
import { useChat } from 'ai/react';
import { useQuery } from '@tanstack/react-query';

export const ChatInterface: React.FC = () => {
  const { t, language } = useLanguage();
  const { selectedModel, isDeepThinking, apiKey, setDeepThinking } = useSettingsStore();
  // We can use local auth state or the store. Let's use the hook for consistency if we populated it, 
  // but we haven't populated useAuthStore yet. We'll stick to local Supabase client for now or quick-fix auth store later.
  // For now, let's just use the supabase client directly as before, it's simpler for this migration.
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<any>(null);
  
  const isSupabaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  // 1. Fetch History
  const { data: history, isLoading: isHistoryLoading } = useQuery({
    queryKey: ['chatHistory', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('chat_messages')
        .select('role, content, generated_prompt, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(300);
      
      if (error) throw error;
      
      // Map Supabase messages to Vercel AI SDK Message format
      return (data || []).map((msg: any) => ({
        id: msg.created_at, // use timestamp as temp ID
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
        // If there was a generated prompt in the legacy format, we could theoretically try to show it,
        // but Vercel AI SDK expects tool invocations. 
        // For migration, we'll just ignore old generated prompts in the message history or append them?
        // Let's just load the text content.
      } as Message));
    },
    enabled: !!user && isSupabaseConfigured,
    staleTime: 1000 * 60 * 5, // 5 mins
  });

  // 2. Vercel AI SDK Hook
  const { messages, input, setInput, append, isLoading, setMessages, reload } = useChat({
    api: '/api/chat',
    body: {
      language,
      model: selectedModel,
      apiKey: apiKey || undefined,
    },
    initialMessages: history || [],
    onFinish: async (message) => {
      // Save assistant message to Supabase
      if (user && isSupabaseConfigured) {
        // Check for tool invocations to extract generated prompt
        const promptTool = message.toolInvocations?.find(t => t.toolName === 'generatePrompt');
        const generatedPrompt = promptTool && 'result' in promptTool ? (promptTool.result as string) : null;

        await supabase.from('chat_messages').insert({
          user_id: user.id,
          role: 'assistant',
          content: message.content,
          generated_prompt: generatedPrompt,
        });
      }
    },
  });

  // Sync history when loaded
  useEffect(() => {
    if (history) {
      setMessages(history);
    }
  }, [history, setMessages]);

  // Auth Listener
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    // Initial check
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    return () => subscription.unsubscribe();
  }, [supabase, isSupabaseConfigured]);


  // Derived State
  const generatedPrompt = useMemo(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.toolInvocations) {
      const tool = lastMsg.toolInvocations.find(t => t.toolName === 'generatePrompt');
      if (tool && 'result' in tool) {
        return tool.result as string;
      }
    }
    return null;
  }, [messages]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    let finalInput = input;
    if (isDeepThinking) {
      finalInput += language === 'tr'
        ? "\n\n[Sistem Notu: Lütfen bunu bilimsel ilkeler ve adım adım akıl yürütme ile derinlemesine analiz et.]"
        : "\n\n[System Note: Please analyze this deeply using scientific principles and step-by-step reasoning.]";
    }

    // Save user message to Supabase immediately (fire and forget)
    if (user && isSupabaseConfigured) {
      void supabase.from('chat_messages').insert({
        user_id: user.id,
        role: 'user',
        content: input, // Save original input
      });
    }

    // Append to chat
    await append({
      role: 'user',
      content: finalInput,
    });
    
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setInput((prev) => {
          const prefix = prev.trim() ? prev + "\n\n" : "";
          return prefix + `[Attached File: ${file.name}]\n${text}\n`;
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = async () => {
    setMessages([]);
    if (user && isSupabaseConfigured) {
       await supabase.from('chat_messages').delete().eq('user_id', user.id);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] w-full max-w-4xl mx-auto relative">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {isHistoryLoading && messages.length === 0 && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm p-6 animate-pulse">
            <Sparkles size={16} /> {t('chat.thinking')}
          </div>
        )}
        
        {messages.length === 0 && !isHistoryLoading ? (
             <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-6">
                 <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center shadow-2xl shadow-primary/10 border border-white/5 backdrop-blur-md overflow-hidden group">
                   <img src="/favicon.ico" alt="Aladdin AI" className="w-full h-full object-cover opacity-85 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-transform duration-700 group-hover:scale-110" />
                 </div>
                 <p className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">{t('chat.ready')}</p>
             </div>
        ) : (
            messages.map((msg, index) => (
                msg.content ? <MessageBubble key={msg.id || index} role={msg.role} content={msg.content} /> : null
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

      <div className="p-4 pb-8 bg-transparent">
        <div className={`relative w-full max-w-3xl mx-auto bg-card/80 backdrop-blur-xl rounded-2xl border ${isDeepThinking ? 'border-purple-500/50 shadow-purple-900/20' : 'border-white/10'} shadow-lg transition-all`}>
          <Input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={handleKeyDown}
            placeholder={isDeepThinking ? t('chat.deepThinking') : t('chat.placeholder')}
            disabled={isLoading || !!generatedPrompt}
            className="w-full bg-transparent border-0 focus-visible:ring-0 text-foreground placeholder:text-muted-foreground py-4 pl-4 pr-80 h-14 text-base"
          />
          
          <div className="absolute right-2 top-2 bottom-2 flex items-center gap-2">
             <ModelSelector disabled={isLoading || !!generatedPrompt} />
             
             <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setDeepThinking(!isDeepThinking)}
                className={`rounded-lg h-9 w-9 transition-colors ${isDeepThinking ? 'text-purple-400 bg-purple-500/10 hover:bg-purple-500/20' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
                title={t('chat.deepThinkingTitle')}
             >
                {isDeepThinking ? <BrainCircuit size={18} /> : <Brain size={18} />}
             </Button>
             
             <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => fileInputRef.current?.click()}
                className="text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg h-9 w-9"
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
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
        
        <div className="text-center mt-3 text-xs text-muted-foreground">
            {t('chat.disclaimer')}
            {messages.length > 0 && (
                 <Button variant="link" size="sm" onClick={handleReset} className="text-muted-foreground hover:text-foreground ml-2 h-auto p-0">
                    <RefreshCw size={12} className="mr-1" /> {t('chat.reset')}
                 </Button>
            )}
        </div>
      </div>
    </div>
  );
};
