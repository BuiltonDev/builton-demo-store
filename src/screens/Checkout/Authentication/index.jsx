import React from "react";
import AuthForm from "../../Auth/authForm";
import useReactRouter from "use-react-router";
import { useGlobal, useDispatch } from "reactn";

const CheckoutAuthentication = () => {
  const { history } = useReactRouter();
  const [checkout] = useGlobal("checkout");
  const updateCheckout = useDispatch("updateCheckoutStep");
  return (
    <AuthForm
      onAuth={() => {
        const checkoutCopy = { ...checkout };
        checkoutCopy[1].complete = true;
        updateCheckout(checkoutCopy);
        history.push("/checkout/payment_method");
      }}
    />
  );
};

export default CheckoutAuthentication;
