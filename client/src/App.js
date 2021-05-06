import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// ApolloProvider is a special type of React component that we'll use to provide
// data to all of the other components
import { ApolloProvider } from '@apollo/react-hooks';

// Use ApolloClient to get that data when we're ready to use it.
import ApolloClient from 'apollo-boost';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import NoMatch from './pages/NoMatch';
import SingleThought from './pages/SingleThought';
import Profile from './pages/Profile';
import Signup from './pages/Signup';


/* Retrieve the token from localStorage before each request
With this request configuration, we use the .setContext() method to set the HTTP
request headers of every request to include the token, whether the request needs
it or not. This is fine, because if the request doesn't need the token, our
server-side resolver function won't check for it.
*/
const client = new ApolloClient({
  request: operation => {
    const token = localStorage.getItem('id_token');

    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : ''
      }
    });
  },
  uri: '/graphql'
});


function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="flex-column justify-flex-start min-100-vh">
          <Header />
          <div className="container">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
              {/* The ? means the paramete is optional*/}
              <Route exact path="/profile/:username?" component={Profile} />
              <Route exact path="/thought/:id" component={SingleThought} />
              <Route component={NoMatch} />
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
};


export default App;