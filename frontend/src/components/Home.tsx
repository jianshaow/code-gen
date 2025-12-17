import 'highlight.js/styles/github.css';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Common.css';
import Generator from './Generator';
import './Home.css';
import SettingInfo from './SettingInfo';

function Home() {
  const [template, setTemplate] = useState('');

  return (
    <div className='main-frame'>
      <div className='header'>
        <Link to='/setting'>Setting</Link>
      </div>
      <h1 className='title'>Code Generator</h1>
      <SettingInfo onSettingChange={({ template }) => setTemplate(template)} />
      <Generator template={template} />
    </div>
  );
}

export default Home;
