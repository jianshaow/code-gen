import { createContext, useContext } from 'react';
import type { AppConfig, ModelConfig } from '../types/config';

interface SettingContextType {
  beBaseUrl: string;
  setBeBaseUrl: React.Dispatch<React.SetStateAction<string>>;
  appConfig: AppConfig;
  setAppConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
  modelConfig: ModelConfig;
  setModelConfig: React.Dispatch<React.SetStateAction<ModelConfig>>;
  templates: string[];
  template: string;
  setTemplate: (v: string) => void;
  content: string;
  setContent: (v: string) => void;
  refreshAll: () => void;
}

export const SettingContext = createContext<SettingContextType | undefined>(undefined);

export function useSetting() {
  const context = useContext(SettingContext);
  if (!context) throw new Error('useSetting must be used within SettingProvider');
  return context;
};


