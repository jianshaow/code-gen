import React, { Component, ChangeEvent, FormEvent } from 'react';
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
      <div className="container">
        <div className="center">
          <div>
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
            <label>Generated Code</label>
            <div>
              <textarea value={response} readOnly rows={10} />
            </div>
            <div className="center">
              <label>Requiremenet: </label>
              <form onSubmit={this.handleSubmitRequest}>
                <textarea value={request}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                    this.setState({ request: e.target.value });
                  }}
                />
                <button type="submit">Generate</button>
              </form>
            </div>
          </div>
        </div>
      </div >
    );
  }
}

export default Home;
