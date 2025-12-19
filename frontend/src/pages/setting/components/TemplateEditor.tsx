
import { useEffect, useState, type ChangeEvent } from 'react';
import { useSetting } from '../../../context/SettingContext';
import { fetchTemplate, fetchTemplates, updateTemplate } from '../../../services/backend';
import MarkdownViewer from '../../../components/Markdown';

export default function TemplateEditor() {
  const { templates, setTemplates } = useSetting();
  const [template, setTemplate] = useState('');
  const [content, setContent] = useState('');

  const handelReloadTemplates = async () => {
    fetchTemplates(true).then(setTemplates);
  };

  const handleLoadTemplate = async () => {
    fetchTemplate(template).then(content => {
      setContent(content);
    });
  };

  const handleSaveTemplate = async () => {
    updateTemplate(template, content).then(() => {
      alert('Saved!');
    });
  };

  useEffect(() => {
    async function reload() {
      setTemplate(templates[0])
    }
    reload()
  }, [templates]);

  return (
    <>
      <label className='title'>Template</label>
      <div className='setting-container'>
        <div>
          <button onClick={handelReloadTemplates}>Reload</button>
          <label className='config-lable'>Template: </label>
          <select value={template} onChange={(e: ChangeEvent<HTMLSelectElement>) => {
            setTemplate(e.target.value);
          }}>{templates.map(template => (
            <option key={template} value={template}>{template}</option>
          ))}
          </select>
          <button onClick={handleLoadTemplate}>Load</button>
          <button onClick={handleSaveTemplate}>Save</button>
        </div>
        <div className='container' style={{ display: 'flex', justifyContent: 'space-between' }}>
          <textarea
            value={content}
            rows={20}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              setContent(e.target.value);
            }}
            style={{ width: '40%' }}
          />
          <div style={{ width: '60%' }}>
            <MarkdownViewer content={content} style={{ height: 340 }} />
          </div>
        </div>
      </div>
    </>
  );
}
