import { Component, ChangeEvent, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import { fetchConfig, fetchTemplates, generate } from '../services/backend'
import 'highlight.js/styles/github.css';
import './Common.css';
import './Home.css';

interface HomeState {
  model: string;
  templates: string[];
  template: string;
  requirement: string;
  generated: string;
}

class Home extends Component<{}, HomeState> {
  constructor(props: {}) {
    super(props);
    this.state = { model: '', templates: [], template: '', requirement: 'make an example', generated: '' };
    this.initConfig();
    this.initTemplate();
  }

  initConfig() {
    fetchConfig().then(config => {
      this.setState({
        model: config.model,
      });
    });
  }

  initTemplate() {
    fetchTemplates(false).then(templates => {
      this.setState({ templates: templates, template: templates[0] })
    });
  }

  handleGenerateRequest = async (e: MouseEvent) => {
    const { template, requirement } = this.state;
    this.setState({ generated: '' })

    generate(template, requirement).then(response => {
      this.getMarkdown(response).then((markdown) => {
        this.setState({ generated: markdown });
      });
    });
  };

  async getMarkdown(mdContent: string) {
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
    const { model, templates, template, requirement, generated } = this.state;

    return (
      <div className='column-container'>
        <div className='header'>
          <Link to='/setting'>Setting</Link>
        </div>
        <h1 className='title'>Code Generator</h1>
        <div className='container'>
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
          <div className='column-container'>
            <button onClick={this.handleGenerateRequest}>=&gt;</button>
          </div>
          <div className='generated-block'>
            <label>Generated Code</label>
            <div className='markdown-container'>
              <div className='markdown-content' dangerouslySetInnerHTML={{ __html: generated }} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
