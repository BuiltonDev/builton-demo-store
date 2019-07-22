import React, {useState, useEffect} from 'react';
import { withRouter } from 'react-router-dom';
import { useGlobal, useDispatch } from 'reactn';

import './index.scss';
import useReactRouter from "use-react-router";
import Header from "../../components/Header";
import CheckoutNavigation from "../../components/CheckoutNavigation";
import StepOne from "./stepOne";



const Checkout = () => {
  const [step, setStep] = useState(null);
  return (
    <div className="main-container">
      <Header />
      <div className="wrapper">
        <div className="checkout-container">
          <div className="checkout-inner-container">
            <div className={`checkout-items-container ${step === 0 ? 'show-container' : 'hide-container'}`} >
              <StepOne/>
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
