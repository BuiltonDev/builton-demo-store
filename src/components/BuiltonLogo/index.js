import React from 'react';
import Blogo from '../../assets/icons/b_logo';
import PropTypes from 'prop-types';
import './index.scss';

const BuiltonLogo = ({ style }) => (
  <div className='top-header-title-container' style={style}>
    <Blogo width={82} height={36} />
    <span className="demo-store-title">Demo store</span>
  </div>
);

BuiltonLogo.defaultProps = {
  style: PropTypes.obj
};

export default BuiltonLogo;
