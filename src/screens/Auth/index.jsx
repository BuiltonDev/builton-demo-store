import React from "react";
import { withRouter } from "react-router-dom";
import "./index.scss";
import BuiltonLogo from "../../components/BuiltonLogo";
import AuthForm from "./authForm";

const Auth = () => {
  return (
    <div className="wrapper">
      <BuiltonLogo style={{ position: "absolute", top: 12, left: 48 }} />
      <div className="paper-container">
        <AuthForm onAuth={() => {
          window.location.replace('/');
        }} />
      </div>
    </div>
  );
};

export default withRouter(Auth);
