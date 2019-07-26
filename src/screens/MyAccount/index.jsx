import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import useReactRouter from "use-react-router";

import "./index.scss";
import Header from "../../components/Header";
import MyOrders from "./MyOrders";
import MyProfile from "./MyProfile";

const MyAccount = () => {
  const { match, history } = useReactRouter();
  const [activeMenu, setActiveMenu] = useState("my-profile");

  useEffect(() => {
    if (match.params.menuId) {
      setActiveMenu(match.params.menuId);
    }
  }, [match.params.menuId]);

  return (
    <div className="main-container">
      <Header />
      <div className="my-account-wrapper">
        <div className="my-account-menu-container">
          <div className="my-account-menu-wrapper">
            <div
              onClick={() => history.push("/my-account/my-profile")}
              className={`${
                activeMenu === "my-profile" ? "active-menu-item" : ""
              }`}
            >
              My Profile
            </div>
            <div
              onClick={() => history.push("/my-account/my-orders")}
              className={`${
                activeMenu === "my-orders" ? "active-menu-item" : ""
              }`}
            >
              My Orders
            </div>
          </div>
        </div>
        <div className="my-account-content-container">
          <div
            className={`my-account-content my-profile-content ${
              activeMenu === "my-profile"
                ? "show-my-account"
                : "hide-my-account"
            }`}
          >
            {activeMenu === "my-profile" && <MyProfile />}
          </div>
          <div
            className={`my-account-content ${
              activeMenu === "my-orders" ? "show-my-account" : "hide-my-account"
            }`}
          >
            {activeMenu === "my-orders" && <MyOrders />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(MyAccount);
