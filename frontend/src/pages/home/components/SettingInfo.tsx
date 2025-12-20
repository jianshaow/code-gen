import { useEffect, useState, type ChangeEvent } from 'react';
import { useSetting } from '../../../context/SettingContext';
import '../../../styles/Common.css';

export default function SettingInfo() {
  const { templates, appConfig, modelConfig, template, setTemplate } = useSetting();
  const [modelProvider, setModelProvider] = useState('');
  const [model, setModel] = useState('');

  useEffect(() => {
    setModelProvider(appConfig.modelProvider);
  }, [appConfig.modelProvider]);

  useEffect(() => {
    setModel(modelConfig.model);
  }, [modelConfig]);

  return (
    <>
      <label>Current Setting</label>
      <div className='info-block'>
        <div>
          <label>Model Provider</label>
          <div className='info-value'>{modelProvider}</div>
        </div>
        <div>
          <label>Model</label>
          <div className='info-value'>{model}</div>
        </div>
        <div>
          <label>Template</label>
          <div>
            <select value={template} onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setTemplate(e.target.value);
            }}>{templates.map(data => (
              <option key={data} value={data}>{data}</option>
            ))}
            </select>
          </div>
        </div>
      </div>
    </>
  );
}
