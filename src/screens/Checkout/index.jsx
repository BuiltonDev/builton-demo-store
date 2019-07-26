import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { useGlobal, useDispatch } from "reactn";

import "./index.scss";
import useReactRouter from "use-react-router";
import builton from "../../utils/builton";
import notify from "../../utils/toast";
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
  const [loading, setLoading] = useState(false);
  const [bag] = useGlobal("bag");
  const [order] = useGlobal("order");
  const updateOrder = useDispatch("updateOrder");
  const clearCheckout = useDispatch("clearCheckout");
  const clearBag = useDispatch("clearBag");
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
    setLoading(true);

    try {
      await builton.orders.create({
        body: {
          ...order
        }
      });
      history.push("/");
    } catch (err) {
      notify("Failed to create order", {
        type: "error"
      });
    }

    setLoading(false);

    // Clear the checkout and the bag after the order has been create
    await clearCheckout();
    await clearBag();
  };

  const checkShouldNavigate = stepNumb => {
    // Check if delivery address has been set to navigate further
    if (step === 3 && typeof stepNumb === "undefined") {
      if (!order.delivery_address) {
        notify("Please select delivery address to proceed", {
          type: "warning"
        });
        return false;
      }
    }
    return true;
  };

  return (
    <div className="main-container">
      <Header />
      <div className="wrapper">
        <div className="checkout-container">
          <div
            className={`checkout-items-container checkout-no-items-container ${
              !bag || bag.length === 0 ? "show-container" : "hide-container"
            }`}
          >
            {(!bag || bag.length === 0) && (
              <div className="checkout-no-items">
                <BLogo width={160} height={80} />
                No items in the bag
              </div>
            )}
          </div>
          {bag && bag.length > 0 && (
            <>
              <div className="checkout-inner-container">
                {bag && bag.length > 0 && <></>}
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
                  // because we don't save payment information data in the local storage
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
                  {step === 5 && <Disclaimer />}
                </div>
              </div>
              <div className="checkout-nav-container">
                <CheckoutNavigation
                  loading={loading}
                  shouldNavigate={stepNumb => checkShouldNavigate(stepNumb)}
                  onPlaceOrder={() =>
                    step === 5 ? setConfirmOrder(true) : setStep(5)
                  }
                  onStep={currentStep => setStep(currentStep)}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default withRouter(Checkout);
