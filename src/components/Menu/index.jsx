import React, { useState, useEffect } from "react";
import HeaderDropdown from "../HeaderDropdown";
import Cart from "../../assets/icons/cart";
import CloseIcon from "../../assets/icons/closeIcon";
import MenuIcon from "../../assets/icons/menuIcon";
import globalState from "../../globalStore/globalState";
import { useDispatch, useGlobal } from "reactn";
import useReactRouter from "use-react-router";
import Account from "../../assets/icons/person";
import DropdownMenu from "../DropdownMenu";
import DropdownMenuItem from "../DropdownMenuItem";
import MyAccount from "../../assets/icons/my_account";
import SignOut from "../../assets/icons/log_out";
import { getSneakersSize } from "../../utils/productModifiers";
import RemoveShopping from "../../assets/icons/remove_shopping";
import Button from "../Button";
import './index.scss';
import {checkIfMobile} from "../../utils/mobile";

const Menu = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);

  const [user] = useGlobal("user");
  const [bag] = useGlobal("bag");
  const removeItemFrombag = useDispatch("removeItemFromBag"); //reducer

  const { history } = useReactRouter();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'auto';
  }, [menuOpen]);

  const removeItem = (itemId, ev) => {
    ev.stopPropagation();
    removeItemFrombag(itemId);
  };

  const calculateTotalAmount = () => {
    let total = 0;
    for (let i = 0; i < bag.length; i += 1) {
      total += bag[i].product.price;
    }
    return total;
  };

  const renderLogoutContainer = () => {
    return (
      <>
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
          onClick={() => checkIfMobile() && setCartOpen(true)}
          onMouseEnter={() => !checkIfMobile() && setCartOpen(true)}
          onMouseLeave={() => !checkIfMobile() && setCartOpen(false)}
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
                history.push("/my-account/my-profile");
              }}
            >
              <span>My Account</span>
              <MyAccount color="#c5c5c5" />
            </DropdownMenuItem>
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
      </>
    );
  };

  const renderCartContainer = () => {
    return (
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
                <div className="bag-product-row">
                  <div>{prod.product.name}</div>
                  <div>{`Size ${getSneakersSize(prod.size)}`}</div>
                  <div>
                    {prod.product.price} {prod.product.currency}
                  </div>
                  <div
                    className="remove-bag-item"
                    onClick={ev => removeItem(prod.size._id.$oid, ev)}
                  >
                    <RemoveShopping color="#c5c5c5" />
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            <div className="header-checkout-container">
              <Button
                onClick={() => {
                  history.push("/checkout/bag");
                }}
                type="button"
                className="button round"
                title="Proceed to checkout"
                style={{
                  padding: "4px 12px",
                  height: 40,
                  fontSize: "0.72rem"
                }}
              />
              <div className="header-bag-amount">
                {calculateTotalAmount()} {bag[0].product.currency}
              </div>
            </div>
          </>
        ) : (
          <div className="empty-bag-container">No items in the bag.</div>
        )}
      </DropdownMenu>
    );
  };

  const renderResponsiveMenu = () => {
    return (
      <>
        <div className="responsive-actions-container">
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
          <HeaderDropdown open={cartOpen}>{renderCartContainer()}</HeaderDropdown>
          <div className="menu-button-container">
            <div className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </div>
          </div>
        </div>
        <div
          className={`responsive-menu ${
            menuOpen ? "responsive-menu-open" : "responsive-menu-closed"
          }`}
        >
          {user &&
            <div className="internal-menu-items">
              <div className="header-title">{user.email}</div>
              <a
                className="header-box-hyperlink"
                href="#"
                onClick={e => {
                  e.preventDefault();
                  setMenuOpen(false);
                  history.push("/my-account/my-profile");
                }}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>My Account</span>
              </a>
              <a
                className="header-box-hyperlink"
                href="#"
                onClick={e => {
                  e.preventDefault();
                  setMenuOpen(false);
                  globalState.logout();
                  history.push("/");
                }}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>Log out</span>
              </a>
            </div>
          }
          {!user &&
            <div className="internal-menu-items">
              <a href="#"
                 className="header-box-hyperlink"
                 onClick={(e) => {
                e.preventDefault();
                history.push('/auth')
              }}
              >
              Log in
              </a>
            </div>
          }
          <div className="external-menu-items">
            <div>
              <a
                href="https://builton.dev"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>Website</span>
              </a>
            </div>
            <div>
              <a
                href="https://docs.builton.dev"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>Docs</span>
              </a>
            </div>
            <div>
              <a
                href="https://dashboard.builton.dev/"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>Dashboard</span>
              </a>
            </div>
          </div>
        </div>
        <div
          className={`responsive-menu-backdrop ${
            menuOpen ? "backdrop-open" : "backdrop-close"
          }`}
          onClick={() => setMenuOpen(false)}
        />
      </>
    )
  };

  const renderMenu = () => {
    return (
      <div className="top-header-menu-container">
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
        <span className="dropdown-container">{renderLogoutContainer()}</span>
        <HeaderDropdown open={cartOpen}>{renderCartContainer()}</HeaderDropdown>
      </div>
    );
  };

  return (
    <div className="main-menu-container">
      {renderMenu()}
      {renderResponsiveMenu()}
    </div>
  );
};

export default Menu;
