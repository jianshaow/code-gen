import { Component, ChangeEvent, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
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
      this.setState({ generated: response });
    });
  }

  render() {
    const { templates, template, requirement, generated } = this.state;
    return (
      <div className="column-container">
        <div className='header'>
          <Link to="/template">Template Setting</Link>
        </div>
        <div className="center">
          <h1>Code Generator</h1>
          <div>
            <label>Template: </label>
            <select value={template} onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              this.setState({ template: e.target.value })
            }}>{templates.map(data => (
              <option key={data} value={data}>{data}</option>
            ))}
            </select>
          </div>
          <div className="container">
            <div className="left">
              <div className='column-container'>
                <label>Requiremenet</label>
                <textarea value={requirement} rows={20}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                    this.setState({ requirement: e.target.value });
                  }} />
              </div>
            </div>
            <div className='column-container'>
              <button className='center' onClick={this.handleGenerateRequest}>Generate</button>
            </div>
            <div className='right'>
              <div className='column-container'>
                <label>Generated Code</label>
                <textarea value={generated} readOnly rows={20} />
              </div>
            </div>
          </div>
        </div>
      </div >
    );
  }
}

export default Home;
