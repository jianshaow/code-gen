import { useEffect, useState, type ChangeEvent } from 'react';
import { fetchApiConfig, fetchModels, updateApiConfig } from '../services/backend';

export default function ApiConfigSetting({ apiSpec }: { apiSpec: string }) {
  const [baseUrl, setBaseUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [models, setModels] = useState<string[]>([]);
  const [model, setModel] = useState('');

  useEffect(() => {
    if (apiSpec) {
      fetchApiConfig(apiSpec).then((config) => {
        setBaseUrl(config.base_url || "");
        setApiKey(config.api_key || "");
        setModel(config.model);
      });
      fetchModels(false).then((modelsData) => {
        setModels(modelsData);
      });
    }
  }, [apiSpec]);

  const handleReloadModels = async () => {
    fetchModels(true).then((modelsData) => {
      setModels(modelsData);
    });
  };

  const handleSaveApiConfig = async () => {
    const config = {
      'base_url': baseUrl,
      'api_key': apiKey,
      'model': model,
    };
    updateApiConfig(apiSpec, JSON.stringify(config)).then(() => {
      alert('API Config Saved!');
    });
  };

  return (
    <>
      <label className='title'>API Config</label>
      <div className='setting-container'>
        <div className='setting'>
          <div>
            <label className='config-lable'>API Base URL: </label>
            <input
              type='text'
              value={baseUrl}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setBaseUrl(e.target.value);
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
              value={apiKey}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setApiKey(e.target.value);
              }}
              style={{ width: 280 }}
            />
          </div>
        </div>
        <div className='setting'>
          <div>
            <label className='config-lable'>Model: </label>
            <select value={model} onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setModel(e.target.value);
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
