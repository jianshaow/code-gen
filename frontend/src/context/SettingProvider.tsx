
import React, { useEffect, useState } from 'react';
import { fetchApiConfig, fetchConfig, fetchTemplate, fetchTemplates, getBeBaseUrl } from '../services/backend';
import type { AppConfig, ModelConfig } from '../types/config';
import { SettingContext } from './SettingContext';

export function SettingProvider({ children }: React.PropsWithChildren) {
  const [beBaseUrl, setBeBaseUrl] = useState<string>(getBeBaseUrl());
  const [appConfig, setAppConfig] = useState<AppConfig>({ apiSpec: '', tplDir: '' });
  const [modelConfig, setModelConfig] = useState<ModelConfig>({ baseUrl: '', apiKey: '', model: '' });
  const [templates, setTemplates] = useState<string[]>([]);
  const [template, setTemplate] = useState('');
  const [content, setContent] = useState('');

  async function refreshAll() {
    const appConfig = await fetchConfig();
    setAppConfig({ apiSpec: appConfig.api_spec || '', tplDir: appConfig.tpl_dir || '' });
    fetchApiConfig(appConfig.api_spec).then(config => {
      setModelConfig({
        baseUrl: config.base_url || '',
        apiKey: config.api_key || '',
        model: config.model || '',
      });
    });
    fetchTemplates(false).then(setTemplates);
    if (template) fetchTemplate(template).then(setContent);
  };

  useEffect(() => {
    refreshAll();
    // eslint-disable-next-line
  }, [beBaseUrl]);

  return (
    <SettingContext.Provider
      value={{
        beBaseUrl, setBeBaseUrl,
        appConfig, setAppConfig,
        modelConfig, setModelConfig,
        templates, template, setTemplate,
        content, setContent,
        refreshAll
      }}
    >
      {children}
    </SettingContext.Provider>
  );
};