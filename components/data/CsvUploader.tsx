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
    <Card className="w-full mt-8 bg-[#1c1c1c] border-gray-800 text-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-100">
          <FileText size={20} className="text-blue-500" />
          {t('csv.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            variant="outline"
            className="w-full h-32 border-dashed border-2 border-gray-700 bg-[#27272a]/50 hover:bg-[#27272a] flex flex-col gap-2 transition-all"
          >
            <Upload size={32} className="text-gray-400" />
            <span className="text-gray-400 font-medium">{t('csv.uploadButton')}</span>
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
          <div className="overflow-x-auto rounded-md border border-gray-700">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#27272a] text-gray-200 font-medium">
                <tr>
                  {headers.map((header) => (
                    <th key={header} className="px-4 py-3 border-b border-gray-700">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {data.slice(0, 5).map((row, i) => (
                  <tr key={i} className="hover:bg-gray-800/50 transition-colors">
                    {headers.map((header) => (
                      <td key={`${i}-${header}`} className="px-4 py-3 text-gray-300">{row[header]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-3 text-xs text-gray-500 text-center bg-[#27272a]/50 border-t border-gray-700">
              {t('csv.showingRows').replace('{count}', data.length.toString())}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
