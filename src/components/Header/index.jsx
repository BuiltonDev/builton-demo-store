import React from 'react';
import './header.scss';
import Blogo from '../../assets/icons/b_logo';
import Cart from "../../assets/icons/cart";
import Account from "../../assets/icons/person";

const Header = () => {
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
        <a className='header-box-hyperlink' href='https://dashboard.builton.dev/' target="_blank">
          <span><Account width={18} height={18} color='black' /></span>
        </a>
        <a className='header-box-hyperlink cart' onClick={() => {}} href='#'>
          <span><Cart width={18} height={18} color='black' /> <span className="cart-count">0</span></span>
        </a>
      </div>
    </div>
  )
};

export default Header;
