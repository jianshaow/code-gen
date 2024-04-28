import { Component, ChangeEvent, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchConfig,
  updateConfig,
  fetchModels,
  fetchTemplates,
  fetchTemplate,
  updateTemplate
} from '../services/backend'
import './Common.css';
import './Setting.css';

interface SettingState {
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
    this.initModels();
    this.initConfig();
    this.initTemplates();
  }

  initModels() {
    fetchModels(false).then((models) => {
      this.setState({ models: models });
    });
  }

  reloadModels = async (e: MouseEvent) => {
    fetchModels(true).then((models) => {
      this.setState({ models: models });
    });
  }

  initConfig() {
    fetchConfig().then(config => {
      this.setState({
        apiSpec: config.api_spec,
        baseUrl: config.base_url,
        apiKey: config.api_key,
        model: config.model,
        tplDir: config.tpl_dir,
      });
    });
  }

  initTemplates() {
    fetchTemplates(false).then(templates => {
      this.setState({ templates: templates, template: templates[0] });
    });
  }

  reloadTemplates = async (e: MouseEvent) => {
    fetchTemplates(true).then(templates => {
      this.setState({ templates: templates, template: templates[0] });
    });
  }

  loadTemplate = async (e: MouseEvent) => {
    const { template } = this.state;
    fetchTemplate(template).then(content => {
      this.setState({ content: content });
    });
  }

  saveTemplate = async (e: MouseEvent) => {
    const { template, content } = this.state;
    updateTemplate(template, content).then(() => {
      alert('Saved!');
    })
  }

  saveConfig = async (e: MouseEvent) => {
    const { apiSpec, baseUrl, apiKey, model, tplDir } = this.state
    const config = {
      'api_spec': apiSpec,
      'base_url': baseUrl,
      'api_key': apiKey,
      'model': model,
      'tpl_dir': tplDir
    };
    updateConfig(JSON.stringify(config)).then(() => {
      alert('Setting Saved!')
    })
  }

  render() {
    const { apiSpec, baseUrl, apiKey, models, model, tplDir, templates, template, content } = this.state;

    return (
      <div className='column-container'>
        <Link className='header' to='/'>Return Home</Link>
        <h1 className='title'>Settings</h1>
        <label className='title'>General</label>
        <div className='setting-container'>
          <div className='setting'>
            <div>
              <label>API Spec: </label>
              <input
                type='text'
                value={apiSpec}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  this.setState({ apiSpec: e.target.value });
                }}
              />
              <button onClick={this.reloadModels}>Reload Models</button>
            </div>
          </div>
          <div className='setting'>
            <div>
              <label>API Base URL: </label>
              <input
                type='text'
                value={baseUrl}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  this.setState({ baseUrl: e.target.value });
                }}
              />
            </div>
          </div>
          <div className='setting'>
            <div>
              <label>API Key: </label>
              <input
                type='text'
                value={apiKey}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  this.setState({ apiKey: e.target.value });
                }}
              />
            </div>
          </div>
          <div className='setting'>
            <div>
              <label>Model: </label>
              <select value={model} onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                this.setState({ model: e.target.value })
              }}>{models.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
              </select>
            </div>
          </div>
          <div className='setting'>
            <div>
              <label>Template Dir: </label>
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
              <button onClick={this.saveConfig}>Save Setting</button>
            </div>
          </div>
        </div>
        <label className='title'>Template</label>
        <div className='setting'>
          <div>
            <button onClick={this.reloadTemplates}>Reload</button>
            <label>Template: </label>
            <select value={template} onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              this.setState({ template: e.target.value })
            }}>{templates.map(template => (
              <option key={template} value={template}>{template}</option>
            ))}
            </select>
            <button onClick={this.loadTemplate}>Load</button>
            <button onClick={this.saveTemplate}>Save</button>
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