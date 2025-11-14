import 'highlight.js/styles/github.css';
import React, { type ChangeEvent, Component, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { fetchApiConfig, fetchConfig, fetchTemplates, gen_stream, generate } from '../services/backend';
import './Common.css';
import './Home.css';
import MarkdownViewer from './Markdown';

interface HomeState {
  apiSpec: string;
  model: string;
  templates: string[];
  template: string;
  requirement: string;
  generated: string;
  copied: boolean;
}

class Home extends Component<{}, HomeState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      apiSpec: '', model: '', templates: [], template: '',
      requirement: 'make an example', generated: '',
      copied: false,
    };
  }

  codeRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
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

  handleGenerate = async (_e: MouseEvent) => {
    const { template, requirement } = this.state;

    generate(template, requirement).then(generated => {
      this.setState({ generated: generated });
    });
  };

  handleGenerateStream = async (_e: MouseEvent) => {
    const { template, requirement } = this.state;

    gen_stream(template, requirement, (generated: string) => {
      this.setState({ generated: generated });
      if (this.codeRef.current) {
        this.codeRef.current.scrollTop = this.codeRef.current.scrollHeight;
      }
    });
  };

  render() {
    const { apiSpec, model, templates, template, requirement, generated, copied } = this.state;

    return (
      <div className='main-frame'>
        <div className='header'>
          <Link to='/setting'>Setting</Link>
        </div>
        <h1 className='title'>Code Generator</h1>
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
                this.setState({ template: e.target.value })
              }}>{templates.map(data => (
                <option key={data} value={data}>{data}</option>
              ))}
              </select>
            </div>
          </div>
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
            <button onClick={this.handleGenerateStream}>=&gt;</button>
          </div>
          <div className='generated-block'>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label>Generated Code</label>
              <div>
                {copied && <label className='success'>Copied</label>}
                <button onClick={async (_e: MouseEvent) => {
                  navigator.clipboard.writeText(generated);
                  this.setState({ copied: true });
                  setTimeout(() => {
                    this.setState({ copied: false });
                  }, 2000);
                }} style={{ 'textAlign': 'right' }}>Copy</button>
              </div>
            </div>
            <MarkdownViewer content={generated} height={426} />
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
