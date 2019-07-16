import React, { useState } from "react";
import Cart from "../../assets/icons/cart";
import Account from "../../assets/icons/person";
import HeaderDropdown from "../HeaderDropdown";
import BuiltonLogo from "../BuiltonLogo";
import { useGlobal, useDispatch } from "reactn";
import globalState from "../../globalStore/globalState";
import SignOut from "../../assets/icons/log_out";
import useReactRouter from "use-react-router";
import DropdownMenu from "../DropdownMenu";

import "./index.scss";
import DropdownMenuItem from "../DropdownMenuItem";
import { getSneakersSize } from "../../utils/productModifiers";
import RemoveShopping from "../../assets/icons/remove_shopping";
import Button from "../Button";

const Header = React.memo(() => {
  const [cartOpen, setCartOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [user] = useGlobal("user");
  const [bag] = useGlobal("bag");
  const removeItemFrombag = useDispatch("removeItemFromBag"); //reducer

  const { history } = useReactRouter();

  const removeItem = itemId => {
    removeItemFrombag(itemId);
  };

  const calculateTotalAmount = () => {
    let total = 0;
    for (let i = 0; i < bag.length; i += 1) {
      total += bag[i].size.price
    }
    return total;
  };

  return (
    <div className="header-container">
      <BuiltonLogo />
      <div className="top-header-hyperlink-container">
        <a
          className="header-box-hyperlink"
          href="https://builton.dev"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span>Website</span>
        </a>
        <a
          className="header-box-hyperlink"
          href="https://docs.builton.dev"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span>Docs</span>
        </a>
        <a
          className="header-box-hyperlink"
          href="https://dashboard.builton.dev/"
          rel="noopener noreferrer"
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
          <button
            type="button"
            className="header-box-hyperlink cart"
            onMouseEnter={() => setCartOpen(true)}
            onMouseLeave={() => setCartOpen(false)}
          >
            <span>
              <Cart width={18} height={18} color="black" />{" "}
              <span className="cart-count">{(bag && bag.length) || 0}</span>
            </span>
          </button>
          <HeaderDropdown open={userMenuOpen}>
            <DropdownMenu>
              <DropdownMenuItem
                onClick={() => {
                  globalState.logout();
                  // Force refresh of the header
                  history.push("/");
                }}
              >
                <span>Logout</span>
                <SignOut color="#c5c5c5" />
              </DropdownMenuItem>
            </DropdownMenu>
          </HeaderDropdown>
        </span>
        <HeaderDropdown open={cartOpen}>
          <DropdownMenu>
            {bag && bag.length > 0 ? (
              <>
                {bag.map((prod, index) => (
                  <DropdownMenuItem
                    key={`bag-product-${prod.size._id.$oid}${index}`}
                    onClick={() =>
                      history.push(
                        `/product_list/${prod.category}/${prod.product._id.$oid}`
                      )
                    }
                  >
                    <div>{prod.product.name}</div>
                    <div>{`Size ${getSneakersSize(prod.size)}`}</div>
                    <div>
                      {prod.product.price} {prod.product.currency}
                    </div>
                    <div
                      className="remove-bag-item"
                      onClick={() => removeItem(prod.size._id.$oid)}
                    >
                      <RemoveShopping color="#c5c5c5" />
                    </div>
                  </DropdownMenuItem>
                ))}
                <div className="header-checkout-container">
                  <Button
                    onClick={() => {}}
                    type="button"
                    className="button round"
                    title="Proceed to checkout"
                    style={{
                      padding: '4px 6px',
                      height: 40,
                      fontSize: '0.72rem'
                    }}
                  />
                  <div className="header-bag-amount">
                    {calculateTotalAmount()} {bag[0].size.currency}
                  </div>
                </div>
              </>
            ) : (
              <div>No items in the bag.</div>
            )}
          </DropdownMenu>
        </HeaderDropdown>
      </div>
    </div>
  );
});

export default Header;
