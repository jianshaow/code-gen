import 'highlight.js/styles/github.css';
import { useEffect, useRef, useState, type ChangeEvent, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { fetchApiConfig, fetchConfig, fetchTemplates, gen_stream } from '../services/backend';
import './Common.css';
import './Home.css';
import MarkdownViewer from './Markdown';

function Home() {
  const [apiSpec, setApiSpec] = useState('');
  const [model, setModel] = useState('');
  const [templates, setTemplates] = useState<string[]>([]);
  const [template, setTemplate] = useState('');
  const [requirement, setRequirement] = useState('make an example');
  const [generated, setGenerated] = useState('');
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLDivElement>(null);

  function initConfig() {
    fetchConfig().then(config => {
      setApiSpec(config.api_spec);
      fetchApiConfig(config.api_spec).then(config2 => {
        setModel(config2.model);
      });
    });
  }

  function initTemplate() {
    fetchTemplates(false).then(templatesData => {
      setTemplates(templatesData);
      setTemplate(templatesData[0]);
    });
  }

  const handleGenerateStream = async (_e: MouseEvent) => {
    gen_stream(template, requirement, (generatedData: string) => {
      setGenerated(generatedData);
      if (codeRef.current) {
        codeRef.current.scrollTop = codeRef.current.scrollHeight;
      }
    });
  };

  useEffect(() => {
    initConfig();
    initTemplate();
  }, []);

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
              setTemplate(e.target.value);
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
              setRequirement(e.target.value);
            }} />
        </div>
        <div className='container-column'>
          <button onClick={handleGenerateStream}>=&gt;</button>
        </div>
        <div className='generated-block'>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <label>Generated Code</label>
            <div>
              {copied && <label className='success'>Copied</label>}
              <button onClick={async (_e: MouseEvent) => {
                navigator.clipboard.writeText(generated);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
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

export default Home;
