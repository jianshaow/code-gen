
import { type ChangeEvent, useEffect, useState } from 'react';
import { useSetting } from '../../../context/SettingContext';
import { fetchModels, updateApiConfig } from '../../../services/backend';

export default function ModelConfigSetting() {
  const settingContext = useSetting();
  const [modelConfig, setModelConfig] = useState(settingContext.modelConfig);
  const [models, setModels] = useState<string[]>([]);

  const handleReloadModels = async () => {
    fetchModels(true).then(setModels);
  };

  const handleSaveApiConfig = async () => {
    const config = {
      'base_url': modelConfig.baseUrl,
      'api_key': modelConfig.apiKey,
      'model': modelConfig.model,
    };
    updateApiConfig(settingContext.appConfig.modelProvider, JSON.stringify(config)).then(() => {
      alert('API Config Saved!');
    });
    settingContext.setModelConfig(modelConfig)
  };

  useEffect(() => {
    fetchModels(false).then(setModels);
    async function reload() {
      setModelConfig(settingContext.modelConfig)
    }
    reload()
  }, [settingContext.modelConfig]);

  return (
    <>
      <label className='title'>Model Config</label>
      <div className='setting-container'>
        <div className='setting'>
          <div>
            <label className='config-lable'>API Base URL: </label>
            <input
              type='text'
              value={modelConfig.baseUrl}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setModelConfig({ ...modelConfig, baseUrl: e.target.value });
              }}
              style={{ width: 240 }}
            />
          </div>
        </div>
        <div className='setting'>
          <div>
            <label className='config-lable'>API Key: </label>
            <input
              type='text'
              value={modelConfig.apiKey}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setModelConfig({ ...modelConfig, apiKey: e.target.value });
              }}
              style={{ width: 280 }}
            />
          </div>
        </div>
        <div className='setting'>
          <div>
            <label className='config-lable'>Model: </label>
            <select value={modelConfig.model} onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setModelConfig({ ...modelConfig, model: e.target.value });
            }}>{models.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
            </select>
            <button onClick={handleReloadModels}>Reload Models</button>
          </div>
        </div>
        <div className='setting'>
          <div>
            <button onClick={handleSaveApiConfig}>Save</button>
          </div>
        </div>
      </div>
    </>
  );
}
