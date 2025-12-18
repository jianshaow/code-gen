import { useState } from 'react';
import { Link } from 'react-router-dom';
import ApiConfigSetting from './ApiConfigSetting';
import BackendBaseUrlSetting from './BackendBaseUrlSetting';
import BackendConfigSetting from './BackendConfigSetting';
import './Common.css';
import './Setting.css';
import TemplateEditor from './TemplateEditor';


function Setting() {
  const [apiSpec, setApiSpec] = useState('');

  return (
    <div className='main-frame'>
      <div className='header'>
        <Link to='/'>Return Home</Link>
      </div>
      <h1 className='title'>Settings</h1>
      <BackendBaseUrlSetting onChange={() => { }} />
      <BackendConfigSetting onChange={setApiSpec} />
      <ApiConfigSetting apiSpec={apiSpec} />
      <TemplateEditor />
    </div>
  );
}

export default Setting;