import React from 'react';
import {CardElement, Elements, injectStripe} from "react-stripe-elements";
import Button from "../../../components/Button";
import notify from "../../../utils/toast";

const StripeCardForm = ({
  stripe
                        }) => {
  const handlePaymentMethodCreate = async () => {
    try {
      const token = await stripe.createToken({ type: 'card' });
      // TODO create
      // onSubmit(currentPlanId, token.token.id);
    } catch (err) {
      // onCancel();
      notify.error('Failed to add card');
    }
  };
  return (
    <>
      <CardElement />
      <Button onClick={() => handlePaymentMethodCreate()} title="Create" type="button"/>
    </>
  )
};

export default injectStripe(StripeCardForm);
