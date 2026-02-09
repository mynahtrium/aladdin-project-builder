"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const SettingsPanel: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const handleReset = () => {
    setLanguage('en');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-gray-100 mb-6">{t('settings.title')}</h2>

      {/* General Settings */}
      <Card className="bg-[#1c1c1c] border-gray-800 text-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-100">
            <Globe size={20} className="text-emerald-500" />
            {t('settings.general.title')}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {t('settings.general.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-[#27272a]/50 rounded-lg border border-gray-700">
            <div className="flex items-center gap-3">
              <Globe size={20} className="text-gray-400" />
              <div>
                <p className="font-medium text-gray-200">{t('settings.general.language.title')}</p>
                <p className="text-sm text-gray-500">{t('settings.general.language.description')}</p>
              </div>
            </div>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value as 'en' | 'tr')}
              className="bg-[#1c1c1c] border border-gray-700 text-gray-200 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="en">{t('settings.general.language.english')}</option>
              <option value="tr">{t('settings.general.language.turkish')}</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Reset Area */}
      <div className="flex justify-end pt-4">
        <Button 
          variant="destructive" 
          onClick={handleReset}
          className="bg-red-900/50 hover:bg-red-900 border border-red-900 text-red-200"
        >
          <RefreshCw size={16} className="mr-2" />
          {t('settings.reset')}
        </Button>
      </div>
    </div>
  );
};
