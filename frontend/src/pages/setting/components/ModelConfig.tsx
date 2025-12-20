
import { type ChangeEvent, useEffect, useState } from 'react';
import { useSetting } from '../../../context/SettingContext';
import { fetchModels, updateModelConfig } from '../../../services/backend';

export default function ModelConfigSetting() {
  const settingContext = useSetting();
  const [modelConfig, setModelConfig] = useState(settingContext.modelConfig);

  const handleReloadModels = async () => {
    fetchModels(true).then(settingContext.setModels);
  };

  const handleSaveModelConfig = async () => {
    const config = {
      'base_url': modelConfig.baseUrl,
      'api_key': modelConfig.apiKey,
      'model': modelConfig.model,
    };
    updateModelConfig(settingContext.appConfig.modelProvider, JSON.stringify(config)).then(() => {
      alert('API Config Saved!');
    });
    settingContext.setModelConfig(modelConfig)
  };

  useEffect(() => {
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
            }}>{settingContext.models.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
            </select>
            <button onClick={handleReloadModels}>Reload Models</button>
          </div>
        </div>
        <div className='setting'>
          <div>
            <button onClick={handleSaveModelConfig}>Save</button>
          </div>
        </div>
      </div>
    </>
  );
}
