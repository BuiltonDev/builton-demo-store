import React from 'react';
import {
  HashRouter as Router,
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
import MyAccount from './screens/MyAccount';
import MyOrder from './screens/MyOrder';

import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useGlobal } from 'reactn';

const ProtectedRoute = ({component: Component, ...props}) => {
  const [user] = useGlobal('user');
  const renderView = (props) => {
    if (props.match.path === '/auth') {
      // This is to make sure you can not open the auth view after you have logged in
      if (!!user) {
        return <Redirect to="/" />;
      } else {
        return <Auth />;
      }
    } else {
      if (!!user) {
        return <Component {...props} />;
      } else {
        return <Redirect to="/auth" />;
      }
    }
  };

  return (
    <Route
      {...props}
      render={props => renderView(props)}
    />
  )
};

const App = () => {
  return(
    <div style={{ display: 'flex', flex: 1}}>
      <Router>
        <Switch>
          <Route exact path="/" component={Home}/>
          <ProtectedRoute exact component={Home} path="/auth" />
          <Route exact path="/product_list/:category" component={ProductList} />
          <Route exact path="/product_list/:category/:productId" component={Product} />
          <Route exact path="/checkout/:step" component={Checkout} />
          <ProtectedRoute exact path="/my-account/:menuId" component={MyAccount} />
          <ProtectedRoute exact path="/my-account/my-orders/:orderId" component={MyOrder} />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </Router>
      <ToastContainer style={{ top: '4rem' }} />
    </div>
  )
};

export default App;
