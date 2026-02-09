"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AladdinLauncherProps {
  prompt: string;
}

export const AladdinLauncher: React.FC<AladdinLauncherProps> = ({ prompt }) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenAladdin = () => {
    window.open('https://institute-for-future-intelligence.github.io/aladdin/', '_blank');
  };

  return (
    <Card className="w-full mt-4 border-emerald-900/50 bg-[#051c10]">
      <CardHeader>
        <CardTitle className="text-emerald-400 flex items-center gap-2">
          {t('launcher.title')}
        </CardTitle>
        <CardDescription className="text-emerald-500/80">
          {t('launcher.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <pre className="bg-[#02100a] p-4 rounded-md border border-emerald-900/50 text-sm overflow-x-auto whitespace-pre-wrap max-h-60 text-emerald-100/90 font-mono">
            {prompt}
          </pre>
          <Button 
            size="sm" 
            variant="outline" 
            className="absolute top-2 right-2 h-8 bg-[#051c10] hover:bg-[#0a2e1b] border-emerald-900 text-emerald-400 hover:text-emerald-300"
            onClick={handleCopy}
          >
            {copied ? <Check size={14} className="mr-1 text-emerald-500" /> : <Copy size={14} className="mr-1" />}
            {copied ? t('launcher.copied') : t('launcher.copy')}
          </Button>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleOpenAladdin} className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium">
            {t('launcher.openButton')} <ExternalLink size={16} className="ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
