import 'highlight.js/styles/github.css';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Common.css';
import Generator from './components/Generator';
import SettingInfo from './components/SettingInfo';
import './Home.css';

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
