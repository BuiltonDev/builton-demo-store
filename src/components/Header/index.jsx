import React, { useState } from "react";
import Cart from "../../assets/icons/cart";
import Account from "../../assets/icons/person";
import HeaderDropdown from "../HeaderDropdown";
import BuiltonLogo from "../BuiltonLogo";
import { useGlobal } from "reactn";
import globalState from "../../globalStore/globalState";
import SignOut from "../../assets/icons/log_out";
import useReactRouter from "use-react-router";
import DropdownMenu from "../DropdownMenu";

import "./index.scss";
import DropdownMenuItem from "../DropdownMenuItem";

const Header = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [user] = useGlobal("user");
  const { history } = useReactRouter();

  return (
    <div className="header-container">
      <BuiltonLogo />
      <div className="top-header-hyperlink-container">
        <a
          className="header-box-hyperlink"
          href="https://builton.dev"
          target="_blank"
        >
          <span>Website</span>
        </a>
        <a
          className="header-box-hyperlink"
          href="https://docs.builton.dev"
          target="_blank"
        >
          <span>Docs</span>
        </a>
        <a
          className="header-box-hyperlink"
          href="https://dashboard.builton.dev/"
          target="_blank"
        >
          <span>Dashboard</span>
        </a>
        <span className="dropdown-container">
          <a
            className="header-box-hyperlink"
            href={`${!user ? "/auth" : "#"}`}
            onClick={e => {
              user && e.preventDefault();
            }}
            onMouseEnter={() => {
              user && setUserMenuOpen(true);
            }}
            onMouseLeave={() => {
              user && setUserMenuOpen(false);
            }}
          >
            <span>
              {user ? (
                <div>{user.email}</div>
              ) : (
                <Account width={18} height={18} color="black" />
              )}
            </span>
          </a>
          <a
            className="header-box-hyperlink cart"
            onClick={e => e.preventDefault()}
            onMouseEnter={() => setCartOpen(true)}
            onMouseLeave={() => setCartOpen(false)}
            href="#"
          >
            <span>
              <Cart width={18} height={18} color="black" />{" "}
              <span className="cart-count">0</span>
            </span>
          </a>
          <HeaderDropdown open={userMenuOpen}>
            <DropdownMenu>
              <DropdownMenuItem
                onClick={() => {
                  globalState.logout();
                  // Force refresh of the header
                  history.push('/');
                }}
              >
                <span>
                  Logout
                </span>
                <SignOut color="#c5c5c5" />
              </DropdownMenuItem>
            </DropdownMenu>
          </HeaderDropdown>
        </span>
        <HeaderDropdown open={cartOpen}>
          <div>Cart</div>
        </HeaderDropdown>
      </div>
    </div>
  );
};

export default Header;
