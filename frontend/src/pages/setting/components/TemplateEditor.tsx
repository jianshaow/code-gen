
import { useEffect, useState, type ChangeEvent } from 'react';
import { fetchTemplate, fetchTemplates, updateTemplate } from '../../../services/backend';

export default function TemplateEditor() {
  const [templates, setTemplates] = useState<string[]>([]);
  const [template, setTemplate] = useState('');
  const [content, setContent] = useState('');

  const handelReloadTemplates = async () => {
    fetchTemplates(true).then(setTemplates);
  };

  const handleLoadTemplate = async () => {
    fetchTemplate(template).then(contentData => {
      setContent(contentData);
    });
  };

  const handleSaveTemplate = async () => {
    updateTemplate(template, content).then(() => {
      alert('Saved!');
    });
  };

  useEffect(() => {
    fetchTemplates(false).then((templates) => {
      setTemplates(templates);
      setTemplate(templates[0])
    });
  }, []);

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
        <textarea value={content} rows={20}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
            setContent(e.target.value);
          }} />
      </div>
    </>
  );
}
