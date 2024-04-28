import { Component, ChangeEvent, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchConfig,
  updateConfig,
  fetchTemplates,
  fetchTemplate,
  updateTemplate
} from '../services/backend'
import './Common.css';
import './Setting.css';

interface SettingState {
  model: string;
  baseUrl: string;
  apiKey: string;
  tmplDir: string;
  templates: string[];
  template: string;
  content: string;
}

class Setting extends Component<{}, SettingState> {
  constructor(props: {}) {
    super(props);
    this.state = { model: '', baseUrl: '', apiKey: '', tmplDir: '', templates: [], template: '', content: '', };
    this.initConfig();
    this.initTemplates();
  }

  initConfig() {
    fetchConfig().then(config => {
      console.info(config)
      this.setState({
        model: config.model,
        baseUrl: config.base_url,
        apiKey: config.api_key,
        tmplDir: config.tmpl_dir,
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
    const { model, baseUrl, apiKey, tmplDir } = this.state
    const config = { 'model': model, 'base_url': baseUrl, 'api_key': apiKey, 'tmpl_dir': tmplDir };
    updateConfig(JSON.stringify(config)).then(() => {
      alert('Setting Saved!')
    })
  }

  render() {
    const { model: model_names, baseUrl, apiKey, tmplDir, templates, template, content } = this.state;

    return (
      <div className='column-container'>
        <Link className='header' to='/'>Return Home</Link>
        <h1 className='title'>Settings</h1>
        <label className='title'>General</label>
        <div className='setting-container'>
          <div className='setting'>
            <div>
              <label>OpenAI API Base URL: </label>
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
              <label>OpenAI API Key: </label>
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
              <input
                type='text'
                value={model_names}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  this.setState({ model: e.target.value });
                }}
              />
            </div>
          </div>
          <div className='setting'>
            <div>
              <label>Template Dir: </label>
              <input
                type='text'
                value={tmplDir}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  this.setState({ tmplDir: e.target.value });
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