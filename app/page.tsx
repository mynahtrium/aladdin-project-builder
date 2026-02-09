"use client";

import { useState } from 'react';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { CsvUploader } from '@/components/data/CsvUploader';
import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { MessageSquare, BarChart2, Settings, Atom } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'chat' | 'data' | 'settings'>('chat');
  const { t } = useLanguage();

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#111111] text-[#ededed]">
      {/* Top Navigation Bar */}
      <div className="w-full border-b border-[#27272a] bg-[#111111] p-4 flex justify-center items-center sticky top-0 z-50">
        
        {/* Navigation Tabs */}
        <div className="flex items-center bg-[#27272a] p-1 rounded-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 rounded-md transition-all ${activeTab === 'chat' ? 'bg-[#3f3f46] text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
          >
            <MessageSquare size={16} />
            <span className="hidden sm:inline">{t('nav.chat')}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab('data')}
            className={`flex items-center gap-2 rounded-md transition-all ${activeTab === 'data' ? 'bg-[#3f3f46] text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
          >
            <BarChart2 size={16} />
            <span className="hidden sm:inline">{t('nav.data')}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 rounded-md transition-all ${activeTab === 'settings' ? 'bg-[#3f3f46] text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
          >
            <Settings size={16} />
            <span className="hidden sm:inline">{t('nav.settings')}</span>
          </Button>
        </div>
      </div>

      <div className="w-full max-w-5xl flex-1 flex flex-col p-4 md:p-8 h-[calc(100vh-80px)] overflow-hidden">
        {activeTab === 'chat' && <ChatInterface />}
        
        {activeTab === 'data' && (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-semibold mb-2 text-gray-200">{t('data.title')}</h2>
              <p className="text-gray-400 mb-6">{t('data.description')}</p>
              <CsvUploader />
           </div>
        )}

        {activeTab === 'settings' && <SettingsPanel />}
      </div>
    </main>
  );
}
