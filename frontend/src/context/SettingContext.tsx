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
  setTemplates: React.Dispatch<React.SetStateAction<string[]>>;
  template: string;
  setTemplate: React.Dispatch<React.SetStateAction<string>>;
  appConfigLoading: boolean;
  modelConfigLoading: boolean;
}

export const SettingContext = createContext<SettingContextType | undefined>(undefined);

export function useSetting() {
  const context = useContext(SettingContext);
  if (!context) throw new Error('useSetting must be used within SettingProvider');
  return context;
};


