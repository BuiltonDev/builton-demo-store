import React, {useState, useEffect} from 'react';
import { withRouter } from 'react-router-dom';
import { useGlobal, useDispatch } from 'reactn';
import { TransitionGroup, CSSTransition } from "react-transition-group";

import './index.scss';
import useReactRouter from "use-react-router";
import Header from "../../components/Header";
import Button from "../../components/Button";
import CheckoutNavigation from "../../components/CheckoutNavigation";



const Checkout = () => {
  const [bag] = useGlobal('bag');
  const [step, setStep] = useState(null)

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

  console.log(step);

  return (
    <div className="main-container">
      <Header />
      <div className="wrapper">
        <div className="checkout-container">
          <div className="checkout-inner-container">
            <div className={`checkout-items-container ${step === 0 ? 'show-container' : 'hide-container'}`} >
              {renderStep1()}
            </div>
            <div className={`checkout-items-container ${step === 1 ? 'show-container' : 'hide-container'}`} >
              test2
            </div>
            <div className={`checkout-items-container ${step === 2 ? 'show-container' : 'hide-container'}`} >
              test3
            </div>
            <div className={`checkout-items-container ${step === 3 ? 'show-container' : 'hide-container'}`} >
              test4
            </div>
            <div className={`checkout-items-container ${step === 4 ? 'show-container' : 'hide-container'}`} >
              test5
            </div>

          </div>
          <div className="checkout-nav-container">
            <CheckoutNavigation onStep={(currentStep) => setStep(currentStep)} />
          </div>
        </div>
      </div>
    </div>
  )
};

export default withRouter(Checkout);
