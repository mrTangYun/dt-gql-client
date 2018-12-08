import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";

const client = new ApolloClient({
    uri: "https://w5xlvm3vzz.lp.gql.zone/graphql"
});


class App extends Component {
    componentDidMount() {
        client.query({
                query: gql`
                  {
                    rates(currency: "USD") {
                      currency
                    }
                  }
                `
            }).then(result => console.log(result));
    }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
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
