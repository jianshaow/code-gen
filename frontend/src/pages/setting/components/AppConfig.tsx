
import { useEffect, useState, type ChangeEvent } from 'react';
import { useSetting } from '../../../context/SettingContext';
import { fetchApiSpecs, updateConfig } from '../../../services/backend';
import type { AppConfig } from '../../../types/config';

export default function AppConfigSetting() {
  const settingContext = useSetting();
  const [apiSpecs, setApiSpecs] = useState<string[]>([]);
  const [appConfig, setAppConfig] = useState<AppConfig>(settingContext.appConfig);

  const handleSaveConfig = async () => {
    const config = {
      'api_spec': appConfig.apiSpec,
      'tpl_dir': appConfig.tplDir,
    };
    updateConfig(JSON.stringify(config)).then(() => {
      alert('Setting Saved!');
    });
  };

  useEffect(() => {
    fetchApiSpecs().then(setApiSpecs);
    setAppConfig(settingContext.appConfig);
  }, [settingContext.appConfig]);

  return (
    <>
      <label className='title'>Backend</label>
      <div className='setting-container'>
        <div className='setting'>
          <div>
            <label className='config-lable'>API Spec: </label>
            <select value={appConfig.apiSpec} onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setAppConfig(prev => ({ ...prev, apiSpec: e.target.value }));
            }}>{apiSpecs.map(apiSpec => (
              <option key={apiSpec} value={apiSpec}>{apiSpec}</option>
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
