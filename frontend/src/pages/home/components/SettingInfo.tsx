import { useEffect, useState, type ChangeEvent } from 'react';
import { useSetting } from '../../../context/SettingContext';
import '../../../styles/Common.css';

export default function SettingInfo() {
  const { templates, appConfig, modelConfig, template, setTemplate } = useSetting();
  const [apiSpec, setApiSpec] = useState('');
  const [model, setModel] = useState('');

  useEffect(() => {
    setApiSpec(appConfig.modelProvider);
  }, [appConfig]);

  useEffect(() => {
    setModel(modelConfig.model);
  }, [modelConfig]);

  return (
    <>
      <label>Current Setting</label>
      <div className='info-block'>
        <div>
          <label>API Spec</label>
          <div className='info-value'>{apiSpec}</div>
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
