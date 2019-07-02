import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import './App.scss';
import Home from "./screens/Home";
import Auth from './screens/Auth';
import {getFieldCurry} from "./globalStore/localStorage";

const App = () => {
  const loggedIn = !!getFieldCurry('builtonSession')();
  return(
    <Router>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/auth" render={() => (
          loggedIn ? (
            <Redirect to="/"/>
          ) : (
            <Auth/>
          )
        )} />
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </Router>
  )
};

export default App;
