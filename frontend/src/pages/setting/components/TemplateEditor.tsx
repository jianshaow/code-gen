
import { useSetting } from '../../../context/SettingContext';
import { updateTemplate, fetchTemplates, fetchTemplate } from '../../../services/backend';
import type { ChangeEvent } from 'react';

export default function TemplateEditor() {
  const { templates, template, setTemplate, content, setContent } = useSetting();

  const handelReloadTemplates = async () => {
    fetchTemplates(true).then(templatesData => {
      setTemplate(templatesData[0] || '');
    });
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
