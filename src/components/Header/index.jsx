import React from 'react';
import PropTypes from 'prop-types';
import './header.scss';
import Blogo from '../../assets/b_logo';
import Button from "../Button";
import Cart from "../../assets/cart";

const Header = () => {
  const itemsCount = 0;
  return (
    <div className='header-container'>
      <div className='sub-header sub-header-top'>
        <div className='top-header-title-container'>
          <span>
            Demo store
          </span>
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
        </div>
      </div>
      <div className='sub-header sub-header-bottom'>
        <Blogo width={82} height={36} />
        <Button onClick={() => {}} adornment={<Cart width={18} height={18} color='white' />} title={`Cart ${itemsCount}`} />
      </div>
    </div>
  )
};

export default Header;
