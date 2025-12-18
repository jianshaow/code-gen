import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Common.css';
import AppConfigSetting from './components/AppConfig';
import GeneralConfigSetting from './components/GeneralConfig';
import ModelConfigSetting from './components/ModelConfig';
import TemplateEditor from './components/TemplateEditor';
import './Setting.css';


function Setting() {
  const [apiSpec, setApiSpec] = useState('');

  return (
    <div className='main-frame'>
      <div className='header'>
        <Link to='/'>Return Home</Link>
      </div>
      <h1 className='title'>Settings</h1>
      <GeneralConfigSetting onChange={() => { }} />
      <AppConfigSetting onChange={setApiSpec} />
      <ModelConfigSetting apiSpec={apiSpec} />
      <TemplateEditor />
    </div>
  );
}

export default Setting;