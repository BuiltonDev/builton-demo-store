import React, { useState } from 'react';
import './header.scss';
import Blogo from '../../assets/icons/b_logo';
import Cart from "../../assets/icons/cart";
import Account from "../../assets/icons/person";
import HeaderDropdown from "../HeaderDropdown";

const Header = () => {
  const [dropDown, setDropdown] = useState('');

  return (
    <div className='header-container'>
      <div className='top-header-title-container'>
        <Blogo width={82} height={36} />
        <span className="demo-store-title">Demo store</span>
      </div>
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
          onClick={(e) => e.preventDefault()}
          onMouseEnter={() => setDropdown('auth')}
          onMouseLeave={() => setDropdown('')}
          href='#'
        >
          <span><Account width={18} height={18} color='black' /></span>
        </a>
        <a
          className='header-box-hyperlink cart'
          onClick={(e) => e.preventDefault()}
          onMouseEnter={() => setDropdown('cart')}
          onMouseLeave={() => setDropdown('')}
          href='#'
        >
          <span><Cart width={18} height={18} color='black' /> <span className="cart-count">0</span></span>
        </a>
        <HeaderDropdown open={!!dropDown}>
          {dropDown === 'cart' ? (
            <div>
              Cart
            </div>
          ) : (
            <div>
              Test
            </div>
          )}
        </HeaderDropdown>
      </div>
    </div>
  )
};

export default Header;
