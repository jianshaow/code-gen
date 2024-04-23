import { Component } from 'react';
import { Link } from 'react-router-dom';
import './Common.css';
import './Template.css';

interface TemplateState {
  templates: string[];
}

class Template extends Component<{}, TemplateState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      templates: [""]
    };
  }

  render() {
    const { templates } = this.state;

    return (
      <div className='column-container'>
        <div className='header'>
          <Link to='/'>Return Home</Link>
        </div>
        <div className='center'>
          <h1>Template Setting</h1>
        </div>
      </div>
    );
  }
}

export default Template;