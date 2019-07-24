import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { useGlobal, useDispatch } from "reactn";

import "./index.scss";
import useReactRouter from "use-react-router";
import builton from '../../utils/builton';
import notify from '../../utils/toast';
import Header from "../../components/Header";
import CheckoutNavigation from "../../components/CheckoutNavigation";
import Bag from "./Bag";
import Authentication from "./Authentication";
import PaymentMethod from "./PaymentMethod";
import DeliveryAddress from "./DeliveryAddress";
import Overview from "./Overview";
import Disclaimer from "./Disclaimer";
import BLogo from "../../assets/icons/b_logo";

const Checkout = () => {
  const [step, setStep] = useState(null);
  const [confirmOrder, setConfirmOrder] = useState(false);
  const [bag] = useGlobal("bag");
  const [order] = useGlobal("order");
  const updateOrder = useDispatch("updateOrder");
  const clearCheckout = useDispatch("clearCheckout");
  const { history } = useReactRouter();

  useEffect(() => {
    if (step === 1 && bag && bag.length > 0) {
      order.items = [];
      for (let i = 0; i < bag.length; i += 1) {
        order.items.push({
          product: bag[i].product._id.$oid,
          quantity: 1,
          sub_product: [bag[i].size._id.$oid]
        });
      }
      updateOrder(order);
    }

    if (step === 5) {
      setConfirmOrder(false);
    }
  }, [step]);

  useEffect(() => {
    if (confirmOrder) {
      placeOrder();
    }
  }, [confirmOrder]);

  const placeOrder = async () => {
    try {
      await builton.orders.create({
        body: {
          ...order
        }
      });
      await clearCheckout();
      history.push('/');
    } catch(err) {
      notify('Failed to create order', {
        type: 'error'
      })
    }
  };

  return (
    <div className="main-container">
      <Header />
      <div className="wrapper">
        <div className="checkout-container">
          <div
            className={`checkout-items-container checkout-no-items-container ${
              !bag || bag.length < 1 ? "show-container" : "hide-container"
              }`}
          >
            {(!bag || bag.length < 1) &&
              <div className="checkout-no-items">
                <BLogo width={160} height={80} />
                No items in the bag
              </div>
            }
          </div>
          {(bag && bag.length > 0) &&
            <>
              <div className="checkout-inner-container">
              {bag && bag.length > 0 &&
              <>
              </>}
              <div
                className={`checkout-items-container ${
                  step === 0 ? "show-container" : "hide-container"
                  }`}
              >
                {step === 0 && <Bag />}
              </div>
              <div
                className={`checkout-items-container ${
                  step === 1 ? "show-container" : "hide-container"
                  }`}
              >
                <div className="step-auth-container">
                  {step === 1 && <Authentication />}
                </div>
              </div>
              <div
                className={`checkout-items-container ${
                  step === 2 ? "show-container" : "hide-container"
                  }`}
              >
                {// We render it on order confirmation as well
                  // because we don't say payment information data in the local storage
                  // and we need to fetch and set it again in case the confirmation is reloaded
                  (step === 2 || step === 4) && <PaymentMethod />}
              </div>
              <div
                className={`checkout-items-container ${
                  step === 3 ? "show-container" : "hide-container"
                  }`}
              >
                {step === 3 && <DeliveryAddress />}
              </div>
              <div
                className={`checkout-items-container ${
                  step === 4 ? "show-container" : "hide-container"
                  }`}
              >
                {step === 4 && <Overview />}
              </div>
              <div
                className={`checkout-items-container ${
                  step === 5 ? "show-container" : "hide-container"
                  }`}
              >
                {step === 5 && <Disclaimer/>}
              </div>
            </div>
            <div className="checkout-nav-container">
              <CheckoutNavigation
                onPlaceOrder={() => step === 5 ? setConfirmOrder(true) : setStep(5)}
                onStep={currentStep => setStep(currentStep)}
              />
            </div>
          </>
          }
        </div>
      </div>
    </div>
  );
};

export default withRouter(Checkout);
