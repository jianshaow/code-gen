
import React, { useEffect, useState } from 'react';
import { fetchApiConfig, fetchConfig, getBeBaseUrl } from '../services/backend';
import type { AppConfig, ModelConfig } from '../types/config';
import { SettingContext } from './SettingContext';

export function SettingProvider({ children }: React.PropsWithChildren) {
  const [beBaseUrl, setBeBaseUrl] = useState<string>(getBeBaseUrl());
  const [appConfig, setAppConfig] = useState<AppConfig>({ modelProvider: '', tplDir: '' });
  const [modelConfig, setModelConfig] = useState<ModelConfig>({ baseUrl: '', apiKey: '', model: '' });
  const [appConfigLoading, setAppConfigLoading] = useState(false);
  const [modelConfigLoading, setModelConfigLoading] = useState(false)

  async function loadConfig() {
    setAppConfigLoading(true);
    const appConfig = await fetchConfig();
    setAppConfig({ modelProvider: appConfig.api_spec || '', tplDir: appConfig.tpl_dir || '' });
    // await loadModelConfig(appConfig.api_spec);
    setAppConfigLoading(false);
  };

  async function loadModelConfig(modelProvider: string) {
    setModelConfigLoading(true)
    if (!modelProvider) return;
    const modelConfig = await fetchApiConfig(modelProvider);
    setModelConfig({
      baseUrl: modelConfig.base_url || '',
      apiKey: modelConfig.api_key || '',
      model: modelConfig.model || '',
    });
    setModelConfigLoading(false)
  }

  useEffect(() => {
    async function reload() {
      await loadConfig();
    }
    reload()
    // eslint-disable-next-line
  }, [beBaseUrl]);

  useEffect(() => {
    if (appConfig.modelProvider) {
      async function reload() {
        await loadModelConfig(appConfig.modelProvider);
      }
      reload()
    }
  }, [appConfig.modelProvider]);


  return (
    <SettingContext.Provider
      value={{
        beBaseUrl, setBeBaseUrl,
        appConfig, setAppConfig,
        modelConfig, setModelConfig,
        appConfigLoading, modelConfigLoading,
      }}
    >
      {children}
    </SettingContext.Provider>
  );
};