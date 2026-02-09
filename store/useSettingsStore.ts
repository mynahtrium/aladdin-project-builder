import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  selectedModel: string;
  isDeepThinking: boolean;
  apiKey: string | null;
  setModel: (model: string) => void;
  setDeepThinking: (enabled: boolean) => void;
  setApiKey: (key: string | null) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      selectedModel: 'gemini-3-pro-preview',
      isDeepThinking: false,
      apiKey: null,
      setModel: (model) => set({ selectedModel: model }),
      setDeepThinking: (enabled) => set({ isDeepThinking: enabled }),
      setApiKey: (key) => set({ apiKey: key }),
    }),
    {
      name: 'aladdin-settings-storage',
      partialize: (state) => ({ selectedModel: state.selectedModel, apiKey: state.apiKey }), // Only persist model and API key
    }
  )
);
