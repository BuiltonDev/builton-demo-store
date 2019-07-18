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
import ProductList from './screens/ProductList';
import Product from './screens/Product';
import Checkout from './screens/Checkout';

import {getFieldCurry} from "./globalStore/localStorage";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const loggedIn = !!getFieldCurry('builtonSession')();
  return(
    <div style={{ display: 'flex', flex: 1}}>
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
          <Route exact path="/product_list/:category" component={ProductList} />
          <Route exact path="/product_list/:category/:productId" component={Product} />
          <Route exact path="/checkout/:step?" component={Checkout} />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </Router>
      <ToastContainer style={{ top: '4rem' }} />
    </div>
  )
};

export default App;
