import { useEffect, useState, type ChangeEvent } from 'react';
import { fetchApiSpecs, fetchConfig, updateConfig } from '../../../services/backend';

export default function AppConfigSetting({ onChange }: { onChange?: (apiSpec: string) => void }) {
  const [apiSpecs, setApiSpecs] = useState<string[]>([]);
  const [apiSpec, setApiSpec] = useState('');
  const [tplDir, setTplDir] = useState('');

  useEffect(() => {
    fetchApiSpecs().then(setApiSpecs);
    fetchConfig().then(config => {
      setApiSpec(config.api_spec);
      setTplDir(config.tpl_dir);
    });
  }, []);

  const handleSaveConfig = async () => {
    const config = {
      'api_spec': apiSpec,
      'tpl_dir': tplDir,
    };
    updateConfig(JSON.stringify(config)).then(() => {
      alert('Setting Saved!');
      onChange && onChange(apiSpec);
    });
  };

  return (
    <>
      <label className='title'>Backend</label>
      <div className='setting-container'>
        <div className='setting'>
          <div>
            <label className='config-lable'>API Spec: </label>
            <select value={apiSpec} onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setApiSpec(e.target.value);
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
              value={tplDir}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setTplDir(e.target.value);
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
