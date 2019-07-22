import React from "react";
import AuthForm from "../../Auth/authForm";
import useReactRouter from "use-react-router";

const StepTwo = () => {
  const { history } = useReactRouter();
  return <AuthForm onAuth={() => history.push("/checkout/payment_method")} />;
};

export default StepTwo;
