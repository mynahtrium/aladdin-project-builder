"use client";

import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const CsvUploader: React.FC = () => {
  const { t } = useLanguage();
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          setData(results.data);
          setHeaders(Object.keys(results.data[0] as object));
        }
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
      }
    });
  };

  return (
    <Card className="w-full mt-8 border-white/10 text-card-foreground">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <FileText size={20} className="text-primary" />
          {t('csv.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            variant="outline"
            className="w-full h-32 border-dashed border-2 border-white/20 bg-muted/20 hover:bg-muted/40 hover:border-primary/50 flex flex-col gap-2 transition-all group"
          >
            <Upload size={32} className="text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-muted-foreground font-medium group-hover:text-foreground">{t('csv.uploadButton')}</span>
          </Button>
          <input 
            type="file" 
            accept=".csv" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileUpload}
          />
        </div>

        {data.length > 0 && (
          <div className="overflow-x-auto rounded-md border border-white/10">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-foreground font-medium">
                <tr>
                  {headers.map((header) => (
                    <th key={header} className="px-4 py-3 border-b border-white/10">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.slice(0, 5).map((row, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors">
                    {headers.map((header) => (
                      <td key={`${i}-${header}`} className="px-4 py-3 text-muted-foreground">{row[header]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-3 text-xs text-muted-foreground text-center bg-muted/30 border-t border-white/10">
              {t('csv.showingRows').replace('{count}', data.length.toString())}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
