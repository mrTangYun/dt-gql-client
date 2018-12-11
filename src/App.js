import React, { Component } from 'react';
import './App.css';
import gql from 'graphql-tag';
import { ApolloProvider, Query } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { Spin } from 'antd';
import LoginForm from './components/login';
import Layout from './components/layout';
import { BatchHttpLink } from "apollo-link-batch-http";


const httpLink = new BatchHttpLink({ uri: "/api" });
// const httpLink = createHttpLink({
//   uri: '/api',
// });

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const CheckLogin = () => (
  <Query
    query={
                gql`
                  query queryLogin {
                      viewer{
                        id
                        userName
                      }
                    }
                `
            }
  >
    {({ loading, error, data }) => {
      if (loading) return <div className="App"><Spin size="large" /></div>;
      if (error) return <div className="App"><p>Error :(</p></div>;
      if (data.viewer) {
        return <Layout />;
      }
      return <div className="App"><LoginForm /></div>;
    }}
  </Query>
);


export default () => (
  <ApolloProvider client={client}>
    <CheckLogin />
  </ApolloProvider>
);
