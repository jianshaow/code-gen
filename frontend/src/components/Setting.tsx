import { type ChangeEvent, Component, type MouseEvent } from 'react';
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

interface SettingState {
  beBaseUrl: string;
  apiSpecs: string[];
  apiSpec: string;
  baseUrl: string;
  apiKey: string;
  models: string[];
  model: string;
  tplDir: string;
  templates: string[];
  template: string;
  content: string;
}

class Setting extends Component<{}, SettingState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      beBaseUrl: getBeBaseUrl(),
      apiSpecs: [],
      apiSpec: '',
      baseUrl: '',
      apiKey: '',
      model: '',
      models: [],
      tplDir: '',
      templates: [],
      template: '',
      content: '',
    };
  }

  componentDidMount() {
    this.initSetting();
  }

  initSetting() {
    this.initApiSpecs();
    this.initModels();
    this.initTemplates();
    this.initConfig();
  }

  handleSaveBeBaseUrl = async (_e: MouseEvent) => {
    const { beBaseUrl } = this.state;
    setBeBaseUrl(beBaseUrl);
    this.initSetting();
  };

  handleDetectBeBaseUrl = async (_e: MouseEvent) => {
    const protocol = window.location.protocol;
    const host = window.location.host;
    const url = `${protocol}//${host}`;
    this.setState({ beBaseUrl: url })
  };

  initApiSpecs() {
    fetchApiSpecs().then((apiSpecs) => {
      this.setState({ apiSpecs: apiSpecs });
    });
  }

  initModels() {
    fetchModels(false).then((models) => {
      const { model } = this.state;
      if (!models.includes(model)) {
        models.push(model);
      }
      this.setState({ models: models });
    });
  }

  handleReloadModels = async (_e: MouseEvent) => {
    fetchModels(true).then((models) => {
      const { model } = this.state;
      if (!models.includes(model)) {
        models.push(model);
      }
      this.setState({ models: models });
    });
  };

  initConfig() {
    fetchConfig().then(config => {
      this.setState({
        apiSpec: config.api_spec,
        tplDir: config.tpl_dir,
      });
      this.reloadApiConfig(config.api_spec);
    });
  }

  initTemplates() {
    fetchTemplates(false).then(templates => {
      this.setState({ templates: templates, template: templates[0] });
    });
  }

  reloadApiConfig(apiSpec: string) {
    fetchApiConfig(apiSpec).then((config) => {
      console.log(config);
      this.setState({
        baseUrl: config.base_url || "",
        apiKey: config.api_key || "",
        model: config.model,
      });
    })
  }

  handelReloadTemplates = async (_e: MouseEvent) => {
    fetchTemplates(true).then(templates => {
      this.setState({ templates: templates, template: templates[0] });
    });
  };

  handleLoadTemplate = async (_e: MouseEvent) => {
    const { template } = this.state;
    fetchTemplate(template).then(content => {
      this.setState({ content: content });
    });
  };

  handleSaveTemplate = async (_e: MouseEvent) => {
    const { template, content } = this.state;
    updateTemplate(template, content).then(() => {
      alert('Saved!');
    })
  };

  handleSaveConfig = async (_e: MouseEvent) => {
    const { apiSpec, tplDir } = this.state;
    const config = {
      'api_spec': apiSpec,
      'tpl_dir': tplDir,
    };
    updateConfig(JSON.stringify(config)).then(() => {
      alert('Setting Saved!');
      this.initModels();
      this.reloadApiConfig(apiSpec);
    })
  };

  handleSaveApiConfig = async (_e: MouseEvent) => {
    const { apiSpec, baseUrl, apiKey, model } = this.state
    const config = {
      'base_url': baseUrl,
      'api_key': apiKey,
      'model': model,
    };
    updateApiConfig(apiSpec, JSON.stringify(config)).then(() => {
      alert('API Config Saved!');
    })
  };

  render() {
    const {
      beBaseUrl, apiSpecs, apiSpec, baseUrl, apiKey, models, model, tplDir, templates, template, content
    } = this.state;

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
                  this.setState({ beBaseUrl: e.target.value });
                }}
              />
              <button onClick={this.handleSaveBeBaseUrl}>Save</button>
              <button onClick={this.handleDetectBeBaseUrl}>Detect</button>
            </div>
          </div>
        </div>
        <label className='title'>Backend</label>
        <div className='setting-container'>
          <div className='setting'>
            <div>
              <label className='config-lable'>API Spec: </label>
              <select value={apiSpec} onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                this.setState({ apiSpec: e.target.value })
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
                  this.setState({ tplDir: e.target.value });
                }}
              />
            </div>
          </div>
          <div className='setting'>
            <div>
              <button onClick={this.handleSaveConfig}>Save</button>
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
                  this.setState({ baseUrl: e.target.value });
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
                  this.setState({ apiKey: e.target.value });
                }}
                style={{ width: 280 }}
              />
            </div>
          </div>
          <div className='setting'>
            <div>
              <label className='config-lable'>Model: </label>
              <select value={model} onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                this.setState({ model: e.target.value })
              }}>{models.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
              </select>
              <button onClick={this.handleReloadModels}>Reload Models</button>
            </div>
          </div>
          <div className='setting'>
            <div>
              <button onClick={this.handleSaveApiConfig}>Save</button>
            </div>
          </div>
        </div>
        <label className='title'>Template</label>
        <div className='setting-container'>
          <div>
            <button onClick={this.handelReloadTemplates}>Reload</button>
            <label className='config-lable'>Template: </label>
            <select value={template} onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              this.setState({ template: e.target.value })
            }}>{templates.map(template => (
              <option key={template} value={template}>{template}</option>
            ))}
            </select>
            <button onClick={this.handleLoadTemplate}>Load</button>
            <button onClick={this.handleSaveTemplate}>Save</button>
          </div>
          <textarea value={content} rows={20}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              this.setState({ content: e.target.value });
            }} />
        </div>
      </div>
    );
  }
}

export default Setting;