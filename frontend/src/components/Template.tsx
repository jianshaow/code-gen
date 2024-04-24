import { Component, ChangeEvent, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import './Common.css';
import './Template.css';

interface TemplateState {
  templates: string[];
  template: string;
  content: string;
}

class Template extends Component<{}, TemplateState> {
  constructor(props: {}) {
    super(props);
    this.state = { templates: [], template: "", content: "" };
    this.initTemplate();
  }

  async fetchTemplates() {
    return fetch('http://localhost:5000/template').then(response => response.json());
  }

  async fetchTemplate(template: string) {
    const url = `http://localhost:5000/template/${template}`;
    return fetch(url).then(response => response.text());
  }

  async putTemplate(template: string, content: string) {
    const url = `http://localhost:5000/template/${template}`;
    fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "plain/text" },
      body: content,
    })
  }

  initTemplate() {
    this.fetchTemplates().then(templates => {
      this.setState({ templates: templates, template: templates[0] });
    });
  }

  loadTemplate = async (e: MouseEvent) => {
    const { template } = this.state;
    this.fetchTemplate(template).then(content => {
      this.setState({ content: content });
    });
  }

  saveTemplate = async (e: MouseEvent) => {
    const { template, content } = this.state;
    this.putTemplate(template, content).then(() => {
      alert("Saved!");
    })
  }

  render() {
    const { templates, template, content } = this.state;

    return (
      <div className='column-container'>
        <div className='header'>
          <Link to='/'>Return Home</Link>
        </div>
        <div className='center'>
          <h1>Template Setting</h1>
          <div>
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
        </div>
        <div className='setting'>
          <label>Template Content: </label>
          <textarea value={content} rows={20}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              this.setState({ content: e.target.value });
            }} />
        </div>
      </div>
    );
  }
}

export default Template;