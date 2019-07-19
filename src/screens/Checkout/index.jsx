import React, {useState, useEffect} from 'react';
import { withRouter } from 'react-router-dom';
import { useGlobal, useDispatch } from 'reactn';

import './index.scss';
import useReactRouter from "use-react-router";
import Header from "../../components/Header";
import Button from "../../components/Button";
import CheckoutNavigation from "../../components/CheckoutNavigation";



const Checkout = () => {
  const [bag] = useGlobal('bag');


  const renderStep1 = () => {
    if (!bag || !bag.length) return null;
    return (
      <div className="checkout-bag-items-container">
        {bag.map((item, index) => (
          <div className="checkout-bag-item-row" key={`bag-item-${item.product.id}-${index}`}>
            {item.product.name}
          </div>
          ))}
      </div>
    )
  };



  return (
    <div className="main-container">
      <Header />
      <div className="wrapper">
        <div className="checkout-container">
          <div className="checkout-inner-container">
            {renderStep1()}
          </div>
          <div className="checkout-nav-container">
            <CheckoutNavigation onStep={(step) => {}} />
          </div>
        </div>
      </div>
    </div>
  )
};

export default withRouter(Checkout);
