import { Component, ChangeEvent, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import { fetchConfig, fetchApiConfig, fetchTemplates, generate } from '../services/backend'
import 'highlight.js/styles/github.css';
import './Common.css';
import './Home.css';

interface HomeState {
  apiSpec: string;
  model: string;
  templates: string[];
  template: string;
  requirement: string;
  generated: string;
  highlighted: string;
  copied: boolean;
}

class Home extends Component<{}, HomeState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      apiSpec: '', model: '', templates: [], template: '',
      requirement: 'make an example', generated: '',
      highlighted: '', copied: false,
    };
    this.initConfig();
    this.initTemplate();
  }

  initConfig() {
    fetchConfig().then(config => {
      this.setState({
        apiSpec: config.api_spec,
      });
      fetchApiConfig(config.api_spec).then(config => {
        this.setState({
          model: config.model,
        });
      });
    });
  }

  initTemplate() {
    fetchTemplates(false).then(templates => {
      this.setState({ templates: templates, template: templates[0] })
    });
  }

  handleGenerate = async (e: MouseEvent) => {
    const { template, requirement } = this.state;
    this.setState({ highlighted: '' })

    generate(template, requirement).then(generated => {
      this.getHighlightedMarkdown(generated).then((highlighted) => {
        this.setState({ generated: generated });
        this.setState({ highlighted: highlighted });
      });
    });
  };

  async getHighlightedMarkdown(mdContent: string) {
    const marked = new Marked(
      markedHighlight({
        langPrefix: 'hljs language-',
        highlight(code, lang, info) {
          const language = hljs.getLanguage(lang) ? lang : 'plaintext';
          return hljs.highlight(code, { language }).value;
        }
      })
    );
    return await marked.parse(mdContent);
  }

  render() {
    const { apiSpec, model, templates, template, requirement, generated, highlighted, copied } = this.state;

    return (
      <div className='main-frame'>
        <div className='header'>
          <Link to='/setting'>Setting</Link>
        </div>
        <h1 className='title'>Code Generator</h1>
        <div className='container'>
          <label className='config-lable'>API Spec: </label>
          <input value={apiSpec} readOnly style={{ width: 60, marginRight: '5px' }} />
          <label className='config-lable'>Model: </label>
          <input value={model} readOnly style={{ marginRight: '5px' }} />
          <label className='config-lable'>Template: </label>
          <select value={template} onChange={(e: ChangeEvent<HTMLSelectElement>) => {
            this.setState({ template: e.target.value })
          }}>{templates.map(data => (
            <option key={data} value={data}>{data}</option>
          ))}
          </select>
        </div>
        <div className='container'>
          <div className='requirement-block'>
            <label>Requiremenet</label>
            <textarea value={requirement} rows={30}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                this.setState({ requirement: e.target.value });
              }} />
          </div>
          <div className='container-column'>
            <button onClick={this.handleGenerate}>=&gt;</button>
          </div>
          <div className='generated-block'>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label>Generated Code</label>
              <div>
                {copied && <label className='success'>Copied</label>}
                <button onClick={async (e: MouseEvent) => {
                  navigator.clipboard.writeText(generated);
                  this.setState({ copied: true });
                  setTimeout(() => {
                    this.setState({ copied: false });
                  }, 2000);
                }} style={{ 'textAlign': 'right' }}>Copy</button>
              </div>
            </div>
            <div className='markdown-container'>
              <div className='markdown-content' dangerouslySetInnerHTML={{ __html: highlighted }} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
