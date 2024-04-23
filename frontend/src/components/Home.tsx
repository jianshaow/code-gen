import React, { Component, ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import './Common.css';
import './Home.css';

interface HomeState {
  dataList: string[];
  data: string;
  request: string;
  response: string;
}

class Home extends Component<{}, HomeState> {
  constructor(props: {}) {
    super(props);
    this.state = { dataList: [], data: "__root", request: "", response: "" }
    this.initTemplate()
  }

  async fetchTemplate() {
    return fetch('http://localhost:5000/template').then(response => response.json());
  }

  async generate(data: string, text: string) {
    return fetch(`http://localhost:5000/generate?template=${data}&text=${text}`).then(response => response.text());
  }

  initTemplate() {
    this.fetchTemplate().then(templates => {
      this.setState({ dataList: templates })
    });
  }

  handleSubmitRequest = async (e: FormEvent) => {
    e.preventDefault();
    const { data, request } = this.state;

    this.generate(data, request).then(response => {
      this.setState({ response: response });
    });
  }

  render() {
    const { dataList, data, request, response } = this.state;
    return (
      <div className="column-container">
        <div className='header'>
          <Link to="/template">Template Setting</Link>
        </div>
        <div className="center">
          <h1>Code Generator</h1>
          <div>
            <label>Template: </label>
            <select value={data} onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              this.setState({ data: e.target.value })
            }}>{dataList.map(data => (
              <option key={data} value={data}>{data}</option>
            ))}
            </select>
          </div>
          <div className="container">
            <div className="left">
              <div className='column-container'>
                <label>Requiremenet: </label>
                <textarea value={request} rows={20}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                    this.setState({ request: e.target.value });
                  }} />
              </div>
            </div>
            <div className='column-container'>
              <button className='center' type="submit" onClick={this.handleSubmitRequest}>Generate</button>
            </div>
            <div className='right'>
              <div className='column-container'>
                <label>Generated Code</label>
                <textarea value={response} readOnly rows={20} />
              </div>
            </div>
          </div>

        </div>
      </div >
    );
  }
}

export default Home;
