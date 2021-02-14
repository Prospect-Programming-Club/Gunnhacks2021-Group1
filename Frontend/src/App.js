import logo from './logo.svg';
import './App.css';
import React from 'react';
import { serverURL } from './index'
import { checkForUUID } from './retrieveUUID'
import AsyncStorage from '@react-native-async-storage/async-storage';

var test = {"text": "hello"};

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }

  callAPI() {
    
    fetch(serverURL + "/testAPI")
        .then(res => res.text())
        .then(res => this.setState({ apiResponse: res }))
        .catch(err => err);
    
      
    fetch(serverURL + "/messageAPI", {
      method: 'POST',
      headers: {
        'Content-type': 'application/json' // The type of data you're sending
      },
      body: JSON.stringify(test)
    }).then((result) => result.text())
    .then((info) => { console.log(info); });
  }

  componentDidMount() {
    checkForUUID().then((response) => console.log(response));
    this.callAPI();
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <h1>Messege <code>{this.state.apiResponse}</code> !!</h1>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
