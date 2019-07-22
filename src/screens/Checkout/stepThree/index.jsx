import React, {useState, useEffect} from 'react';
import config from '../../../config';
import {Elements, StripeProvider} from 'react-stripe-elements';
import StripeCardForm from "./stripeCardForm";

const StepThree = () => {
  let [StripeContext, setStripeContext] = useState(null);

  useEffect(() => {
    if (window.Stripe) {
      setStripeContext(window.Stripe(config.stripeKey));
    } else {
      document.querySelector('#stripe-js').addEventListener('load', () => {
        // Create Stripe instance once Stripe.js loads
        setStripeContext(window.Stripe(config.stripeKey));
      });
    }
  }, []);

  return (
    <StripeProvider stripe={StripeContext}>
      <Elements>
        <StripeCardForm/>
      </Elements>
    </StripeProvider>
  )
};

export default StepThree;
