import { Component, ChangeEvent, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { Marked } from 'marked';
import { markedHighlight } from "marked-highlight";
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import './Common.css';
import './Home.css';

interface HomeState {
  templates: string[];
  template: string;
  requirement: string;
  generated: string;
}

class Home extends Component<{}, HomeState> {
  constructor(props: {}) {
    super(props);
    this.state = { templates: [], template: "", requirement: "code an example", generated: "" }
    this.initTemplate();
  }

  async fetchTemplates() {
    return fetch('http://localhost:5000/template').then(response => response.json());
  }

  async generate(template: string, requirement: string) {
    const url = `http://localhost:5000/${template}/generate`
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "plain/text" },
      body: requirement,
    }).then(response => response.text());
  }

  initTemplate() {
    this.fetchTemplates().then(templates => {
      this.setState({ templates: templates, template: templates[0] })
    });
  }

  handleGenerateRequest = async (e: MouseEvent) => {
    const { template, requirement } = this.state;

    this.generate(template, requirement).then(response => {
      this.getMarkdown(response).then((markdown) => {
        this.setState({ generated: markdown });
      });
    });
  }

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
    const { templates, template, requirement, generated } = this.state;

    return (
      <div className="column-container">
        <Link className='header' to="/setting">Setting</Link>
        <h1 className='title'>Code Generator</h1>
        <div className='container'>
          <label>Template: </label>
          <select value={template} onChange={(e: ChangeEvent<HTMLSelectElement>) => {
            this.setState({ template: e.target.value })
          }}>{templates.map(data => (
            <option key={data} value={data}>{data}</option>
          ))}
          </select>
        </div>
        <div className="container">
          <div className='column-container'>
            <label>Requiremenet</label>
            <textarea className='tpl-area' value={requirement} rows={30}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                this.setState({ requirement: e.target.value });
              }} />
          </div>
          <div className='column-container'>
            <button className='center' onClick={this.handleGenerateRequest}>=&gt;</button>
          </div>
          <div className='column-container'>
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
