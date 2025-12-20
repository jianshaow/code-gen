
import { useEffect, useState, type ChangeEvent } from 'react';
import { useSetting } from '../../../context/SettingContext';
import { fetchModelProviders, updateAppConfig } from '../../../services/backend';
import type { AppConfig } from '../../../types/config';

export default function AppConfigSetting() {
  const settingContext = useSetting();
  const [modelProviders, setModelProviders] = useState<string[]>([]);
  const [appConfig, setAppConfig] = useState<AppConfig>(settingContext.appConfig);

  const handleSaveConfig = async () => {
    const config = {
      'api_spec': appConfig.modelProvider,
      'tpl_dir': appConfig.tplDir,
    };
    updateAppConfig(JSON.stringify(config)).then(() => {
      alert('Setting Saved!');
    });
    settingContext.setAppConfig(appConfig)
  };

  useEffect(() => {
    fetchModelProviders().then(setModelProviders);
    async function reload() {
      setAppConfig(settingContext.appConfig)
    }
    reload()
  }, [settingContext.appConfig]);

  return (
    <>
      <label className='title'>App Config</label>
      <div className='setting-container'>
        <div className='setting'>
          <div>
            <label className='config-lable'>Model Provider: </label>
            <select value={appConfig.modelProvider} onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setAppConfig(prev => ({ ...prev, modelProvider: e.target.value }));
            }}>{modelProviders.map(modelProvider => (
              <option key={modelProvider} value={modelProvider}>{modelProvider}</option>
            ))}
            </select>
          </div>
        </div>
        <div className='setting'>
          <div>
            <label className='config-lable'>Template Dir: </label>
            <input
              type='text'
              value={appConfig.tplDir}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setAppConfig(prev => ({ ...prev, tplDir: e.target.value }));
              }}
            />
          </div>
        </div>
        <div className='setting'>
          <div>
            <button onClick={handleSaveConfig}>Save</button>
          </div>
        </div>
      </div>
    </>
  );
}
