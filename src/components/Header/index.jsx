import React from "react";
import useReactRouter from 'use-react-router';
import BuiltonLogo from "../BuiltonLogo";

import "./index.scss";
import Menu from "../Menu";

const Header = React.memo(() => {
  const { history } = useReactRouter();

  return (
    <div className="header-container">
      <div className="header-logo-container" onClick={() => history.push("/")}>
        <BuiltonLogo />
      </div>
      <Menu/>
    </div>
  );
});

export default Header;
