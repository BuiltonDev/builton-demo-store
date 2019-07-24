import React, {useState, useEffect} from 'react';
import { withRouter } from 'react-router-dom';
import { useGlobal, useDispatch } from 'reactn';

import './index.scss';
import useReactRouter from "use-react-router";
import Header from "../../components/Header";
import CheckoutNavigation from "../../components/CheckoutNavigation";
import StepOne from "./stepOne";
import StepTwo from "./stepTwo";
import StepThree from "./stepThree";
import StepFour from "./stepFour";
import StepFive from "./stepFive";


const Checkout = () => {
  const [step, setStep] = useState(null);
  const [bag] = useGlobal('bag');
  const [order] = useGlobal('order');
  const updateOrder = useDispatch('updateOrder');

  useEffect(() => {
    if (step === 1 && bag.length > 0) {
      if (bag.length > 0) {
        for (let i = 0; i < bag.length; i += 1) {
          order.items.push({
            product: bag[i].product._id.$oid,
            quantity: 1,
            sub_product: [bag[i].size._id.$oid],
          });
        }
      }
      updateOrder(order);
    }
  }, [step]);

  return (
    <div className="main-container">
      <Header />
      <div className="wrapper">
        <div className="checkout-container">
          <div className="checkout-inner-container">
            <div className={`checkout-items-container ${step === 0 ? 'show-container' : 'hide-container'}`} >
              {step === 0 &&  <StepOne />}
            </div>
            <div className={`checkout-items-container ${step === 1 ? 'show-container' : 'hide-container'}`} >
              <div className="step-auth-container">
                {step === 1 && <StepTwo />}
              </div>
            </div>
            <div className={`checkout-items-container ${step === 2 ? 'show-container' : 'hide-container'}`} >

              {
                // We render it on order confirmation as well
                // because we don't say payment information data in the local storage
                // and we need to fetch and set it again in case the confirmation is reloaded
                step === 2 || step === 4 && <StepThree/>}
            </div>
            <div className={`checkout-items-container ${step === 3 ? 'show-container' : 'hide-container'}`} >
              {step === 3 && <StepFour/>}
            </div>
            <div className={`checkout-items-container ${step === 4 ? 'show-container' : 'hide-container'}`} >
              {step === 4 && <StepFive/>}
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
