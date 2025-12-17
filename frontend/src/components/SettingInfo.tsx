import { useEffect, useState, type ChangeEvent } from 'react';
import { fetchApiConfig, fetchConfig, fetchTemplates } from '../services/backend';
import './Common.css';

interface SettingInfoProps {
  onSettingChange: (setting: {
    apiSpec: string;
    model: string;
    templates: string[];
    template: string;
  }) => void;
}

export default function SettingInfo({ onSettingChange }: SettingInfoProps) {
  const [apiSpec, setApiSpec] = useState('');
  const [model, setModel] = useState('');
  const [templates, setTemplates] = useState<string[]>([]);
  const [template, setTemplate] = useState('');

  useEffect(() => {
    fetchConfig().then(config => {
      setApiSpec(config.api_spec);
      fetchApiConfig(config.api_spec).then(config2 => {
        setModel(config2.model);
        onSettingChange({
          apiSpec: config.api_spec,
          model: config2.model,
          templates,
          template,
        });
      });
    });
    fetchTemplates(false).then(templatesData => {
      setTemplates(templatesData);
      setTemplate(templatesData[0]);
      onSettingChange({
        apiSpec,
        model,
        templates: templatesData,
        template: templatesData[0],
      });
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    onSettingChange({ apiSpec, model, templates, template });
    // eslint-disable-next-line
  }, [apiSpec, model, templates, template]);

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
