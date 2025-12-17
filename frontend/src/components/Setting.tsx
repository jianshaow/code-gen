import { useEffect, useState, type ChangeEvent, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchApiConfig,
  fetchApiSpecs,
  fetchConfig,
  fetchModels,
  fetchTemplate,
  fetchTemplates,
  getBeBaseUrl,
  setBeBaseUrl,
  updateApiConfig,
  updateConfig,
  updateTemplate
} from '../services/backend';
import './Common.css';
import './Setting.css';

function Setting() {
  const [beBaseUrl, setBeBaseUrlState] = useState(getBeBaseUrl());
  const [apiSpecs, setApiSpecs] = useState<string[]>([]);
  const [apiSpec, setApiSpec] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [models, setModels] = useState<string[]>([]);
  const [model, setModel] = useState('');
  const [tplDir, setTplDir] = useState('');
  const [templates, setTemplates] = useState<string[]>([]);
  const [template, setTemplate] = useState('');
  const [content, setContent] = useState('');

  function initSetting() {
    initApiSpecs();
    initModels();
    initTemplates();
    initConfig();
  }

  const handleSaveBeBaseUrl = async (_e: MouseEvent) => {
    setBeBaseUrl(beBaseUrl);
    initSetting();
  };

  const handleDetectBeBaseUrl = async (_e: MouseEvent) => {
    const protocol = window.location.protocol;
    const host = window.location.host;
    const url = `${protocol}//${host}`;
    setBeBaseUrlState(url);
  };

  function initApiSpecs() {
    fetchApiSpecs().then((apiSpecs) => {
      setApiSpecs(apiSpecs);
    });
  }

  function initModels() {
    fetchModels(false).then((modelsData) => {
      if (!modelsData.includes(model)) {
        modelsData.push(model);
      }
      setModels([...modelsData]);
    });
  }

  const handleReloadModels = async (_e: MouseEvent) => {
    fetchModels(true).then((modelsData) => {
      if (!modelsData.includes(model)) {
        modelsData.push(model);
      }
      setModels([...modelsData]);
    });
  };

  function initConfig() {
    fetchConfig().then(config => {
      setApiSpec(config.api_spec);
      setTplDir(config.tpl_dir);
      reloadApiConfig(config.api_spec);
    });
  }

  function initTemplates() {
    fetchTemplates(false).then(templatesData => {
      setTemplates(templatesData);
      setTemplate(templatesData[0]);
    });
  }

  function reloadApiConfig(apiSpec: string) {
    fetchApiConfig(apiSpec).then((config) => {
      setBaseUrl(config.base_url || "");
      setApiKey(config.api_key || "");
      setModel(config.model);
    });
  }

  const handelReloadTemplates = async (_e: MouseEvent) => {
    fetchTemplates(true).then(templatesData => {
      setTemplates(templatesData);
      setTemplate(templatesData[0]);
    });
  };

  const handleLoadTemplate = async (_e: MouseEvent) => {
    fetchTemplate(template).then(contentData => {
      setContent(contentData);
    });
  };

  const handleSaveTemplate = async (_e: MouseEvent) => {
    updateTemplate(template, content).then(() => {
      alert('Saved!');
    });
  };

  const handleSaveConfig = async (_e: MouseEvent) => {
    const config = {
      'api_spec': apiSpec,
      'tpl_dir': tplDir,
    };
    updateConfig(JSON.stringify(config)).then(() => {
      alert('Setting Saved!');
      initModels();
      reloadApiConfig(apiSpec);
    });
  };

  const handleSaveApiConfig = async (_e: MouseEvent) => {
    const config = {
      'base_url': baseUrl,
      'api_key': apiKey,
      'model': model,
    };
    updateApiConfig(apiSpec, JSON.stringify(config)).then(() => {
      alert('API Config Saved!');
    });
  };

  useEffect(() => {
    initSetting();
  }, []);

  return (
    <div className='main-frame'>
      <div className='header'>
        <Link to='/'>Return Home</Link>
      </div>
      <h1 className='title'>Settings</h1>
      <label className='title'>General</label>
      <div className='setting-container'>
        <div className='setting'>
          <div>
            <label className='config-lable'>Backend Base URL: </label>
            <input
              type='text'
              value={beBaseUrl}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setBeBaseUrlState(e.target.value);
              }}
            />
            <button onClick={handleSaveBeBaseUrl}>Save</button>
            <button onClick={handleDetectBeBaseUrl}>Detect</button>
          </div>
        </div>
      </div>
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
      <label className='title'>Template</label>
      <div className='setting-container'>
        <div>
          <button onClick={handelReloadTemplates}>Reload</button>
          <label className='config-lable'>Template: </label>
          <select value={template} onChange={(e: ChangeEvent<HTMLSelectElement>) => {
            setTemplate(e.target.value);
          }}>{templates.map(template => (
            <option key={template} value={template}>{template}</option>
          ))}
          </select>
          <button onClick={handleLoadTemplate}>Load</button>
          <button onClick={handleSaveTemplate}>Save</button>
        </div>
        <textarea value={content} rows={20}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
            setContent(e.target.value);
          }} />
      </div>
    </div>
  );
}

export default Setting;