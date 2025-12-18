import { Link } from 'react-router-dom';
import '../../styles/Common.css';
import AppConfigSetting from './components/AppConfig';
import GeneralConfigSetting from './components/GeneralConfig';
import ModelConfigSetting from './components/ModelConfig';
import TemplateEditor from './components/TemplateEditor';
import './Setting.css';

import { SettingProvider } from '../../context/SettingProvider';

function Setting() {
  return (
    <SettingProvider>
      <div className='main-frame'>
        <div className='header'>
          <Link to='/'>Return Home</Link>
        </div>
        <h1 className='title'>Settings</h1>
        <GeneralConfigSetting />
        <AppConfigSetting />
        <ModelConfigSetting />
        <TemplateEditor />
      </div>
    </SettingProvider>
  );
}

export default Setting;