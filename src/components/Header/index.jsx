import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import './header.scss';
import Cart from "../../assets/icons/cart";
import Account from "../../assets/icons/person";
import HeaderDropdown from "../HeaderDropdown";
import BuiltonLogo from "../BuiltonLogo";

const Header = () => {
  const [cartOpen, setCartOpen] = useState(false);

  const validate = (el) => {
    console.log(el)
  }

  const onSubmit = (el) => {
    console.log(el);
  }

  return (
    <div className='header-container'>
      <BuiltonLogo/>
      <div className='top-header-hyperlink-container'>
        <a className='header-box-hyperlink' href='https://builton.dev' target="_blank">
          <span>Website</span>
        </a>
        <a className='header-box-hyperlink' href='https://docs.builton.dev' target="_blank">
          <span>Docs</span>
        </a>
        <a className='header-box-hyperlink' href='https://dashboard.builton.dev/' target="_blank">
          <span>Dashboard</span>
        </a>
        <a
          className='header-box-hyperlink'
          href='/auth'
        >
          <span><Account width={18} height={18} color='black' /></span>
        </a>
        <a
          className='header-box-hyperlink cart'
          onClick={(e) => e.preventDefault()}
          onMouseEnter={() => setCartOpen(true)}
          onMouseLeave={() => setCartOpen(false)}
          href='#'
        >
          <span><Cart width={18} height={18} color='black' /> <span className="cart-count">0</span></span>
        </a>
        <HeaderDropdown open={cartOpen}>
          <div>
            Cart
          </div>
        </HeaderDropdown>
      </div>
    </div>
  )
};

export default Header;
