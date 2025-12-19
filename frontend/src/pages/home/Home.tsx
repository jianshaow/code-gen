import 'highlight.js/styles/github.css';

import { Link } from 'react-router-dom';
import '../../styles/Common.css';
import Generator from './components/Generator';
import SettingInfo from './components/SettingInfo';
import './Home.css';

function Home() {
  return (
    <div className='main-frame'>
      <div className='header'>
        <Link to='/setting'>Setting</Link>
      </div>
      <h1 className='title'>Code Generator</h1>
      <SettingInfo />
      <Generator />
    </div>
  );
}

export default Home;
