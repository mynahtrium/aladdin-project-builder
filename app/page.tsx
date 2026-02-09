"use client";

import { useState } from 'react';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { CsvUploader } from '@/components/data/CsvUploader';
import { MessageSquare, BarChart2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import AuthButton from '@/components/auth/AuthButton';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'chat' | 'data'>('chat');
  const { t, language, setLanguage } = useLanguage();

  return (
    <main className="flex min-h-screen flex-col items-center relative overflow-hidden text-foreground">
      
      {/* Ambient Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Navigation Bar */}
      <div className="w-full p-6 sticky top-0 z-50 flex justify-center">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-5xl backdrop-blur-xl bg-background/60 border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center justify-between"
        >
          {/* Logo / Brand */}
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/25 relative overflow-hidden group">
              <img src="/favicon.ico" alt="Logo" className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              Aladdin AI
            </span>
          </div>

          {/* Center Tabs */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex bg-secondary/50 p-1 rounded-xl border border-white/5">
            {['chat', 'data'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as 'chat' | 'data')}
                className={`relative px-6 py-2 rounded-lg text-sm font-medium transition-colors z-10 ${
                  activeTab === tab ? 'text-white' : 'text-muted-foreground hover:text-white'
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-primary/20 border border-primary/30 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  {tab === 'chat' ? <MessageSquare size={16} /> : <BarChart2 size={16} />}
                  {t(`nav.${tab}`)}
                </span>
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
             {/* Mobile Tab Toggle (Visible only on small screens) */}
             <div className="flex md:hidden bg-secondary/50 p-1 rounded-lg mr-2">
                <button
                  onClick={() => setActiveTab(activeTab === 'chat' ? 'data' : 'chat')}
                  className="p-2 text-muted-foreground"
                >
                  {activeTab === 'chat' ? <BarChart2 size={18} /> : <MessageSquare size={18} />}
                </button>
             </div>

            <div className="hidden sm:flex items-center bg-secondary/30 p-1 rounded-lg border border-white/5">
              {(['en', 'tr'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    language === lang 
                      ? 'bg-background text-white shadow-sm border border-white/10' 
                      : 'text-muted-foreground hover:text-white'
                  }`}
                >
                  {lang === 'en' ? 'EN' : 'TR'}
                </button>
              ))}
            </div>
            <AuthButton />
          </div>
        </motion.div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-5xl flex-1 flex flex-col p-4 md:p-6 h-[calc(100vh-120px)] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} // Custom easing
            className="w-full h-full flex flex-col"
          >
            {activeTab === 'chat' ? (
              <ChatInterface />
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 border border-white/5 rounded-3xl bg-card/30 backdrop-blur-md">
                <div className="w-full max-w-2xl space-y-8">
                  <div className="text-center space-y-4">
                    <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                      {t('data.title')}
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {t('data.description')}
                    </p>
                  </div>
                  <div className="bg-background/50 p-1 rounded-2xl border border-white/10 shadow-inner">
                    <CsvUploader />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
