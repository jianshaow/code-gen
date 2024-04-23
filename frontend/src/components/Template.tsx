import { Component } from 'react';
import { Link } from 'react-router-dom';
import './Common.css';
import './Template.css';

interface TemplateState {
}

class Template extends Component<{}, TemplateState> {
  constructor(props: {}) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { } = this.state;

    return (
      <div className='container'>
        <div className='header'>
          <Link to='/'>Return Home</Link>
        </div>
        <div className='center'>
          <h1>Device Information</h1>
          <ul className='block'>
          </ul>
        </div>
      </div>
    );
  }
}

export default Template;