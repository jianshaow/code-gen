import { useState } from 'react';
import { Link } from 'react-router-dom';
import ApiConfigSetting from './components/ApiConfigSetting';
import BackendBaseUrlSetting from './components/BackendBaseUrlSetting';
import BackendConfigSetting from './components/BackendConfigSetting';
import TemplateEditor from './components/TemplateEditor';
import '../../styles/Common.css';
import './Setting.css';


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