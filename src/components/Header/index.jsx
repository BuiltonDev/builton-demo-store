import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import './header.scss';
import Blogo from '../../assets/b_logo';
import Button from "../Button";
import Cart from "../../assets/cart";
import Account from "../../assets/person";

const Header = () => {
  const cartRef = useRef(null);
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
        <a className='header-box-hyperlink cart' ref={cartRef} onClick={() => {}} href='#'>
          <span><Cart width={18} height={18} color='black' /> <span className="cart-count">0</span></span>
        </a>
      </div>
    </div>
  )
};

export default Header;
