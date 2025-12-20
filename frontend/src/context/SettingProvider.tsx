
import React, { useEffect, useState } from 'react';
import { fetchAppConfig, fetchModelConfig, fetchModelProviders, fetchModels, fetchTemplates, getBeBaseUrl } from '../services/backend';
import type { AppConfig, ModelConfig } from '../types/config';
import { SettingContext } from './SettingContext';

export function SettingProvider({ children }: React.PropsWithChildren) {
  const [beBaseUrl, setBeBaseUrl] = useState<string>(getBeBaseUrl());
  const [modelProviders, setModelProviders] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [appConfig, setAppConfig] = useState<AppConfig>({ modelProvider: '', tplDir: '' });
  const [modelConfig, setModelConfig] = useState<ModelConfig>({ baseUrl: '', apiKey: '', model: '' });
  const [templates, setTemplates] = useState<string[]>([]);
  const [template, setTemplate] = useState<string>('');
  const [appConfigLoading, setAppConfigLoading] = useState(false);
  const [modelConfigLoading, setModelConfigLoading] = useState(false)

  function loadTemplates() {
    fetchTemplates(false).then((templates) => {
      setTemplates(templates);
      setTemplate(templates[0] || '');
    });
  }

  async function loadAppConfig() {
    setAppConfigLoading(true);
    const appConfig = await fetchAppConfig();
    setAppConfig({ modelProvider: appConfig.api_spec || '', tplDir: appConfig.tpl_dir || '' });
    setAppConfigLoading(false);
  };

  async function loadModelConfig(modelProvider: string) {
    setModelConfigLoading(true)
    if (!modelProvider) return;
    const modelConfig = await fetchModelConfig(modelProvider);
    setModelConfig({
      baseUrl: modelConfig.base_url || '',
      apiKey: modelConfig.api_key || '',
      model: modelConfig.model || '',
    });
    setModelConfigLoading(false)
  }

  useEffect(() => {
    async function reload() {
      fetchModelProviders().then(setModelProviders);
      await loadAppConfig();
      loadTemplates();
    }
    reload()
  }, [beBaseUrl]);

  useEffect(() => {
    if (appConfig.modelProvider) {
      async function reload() {
        fetchModels(false).then(setModels);
        await loadModelConfig(appConfig.modelProvider);
      }
      reload()
    }
  }, [appConfig.modelProvider]);

  return (
    <SettingContext.Provider
      value={{
        beBaseUrl, setBeBaseUrl,
        modelProviders, setModelProviders,
        models, setModels,
        appConfig, setAppConfig,
        modelConfig, setModelConfig,
        templates, setTemplates,
        template, setTemplate,
        appConfigLoading, modelConfigLoading,
      }}
    >
      {children}
    </SettingContext.Provider>
  );
};