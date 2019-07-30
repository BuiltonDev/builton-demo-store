
import React from 'react';
import PropTypes from 'prop-types';

const MenuIcon = ({height, width, color}) => (
  <svg width={width} height={height} viewBox="0 0 24 24">
    <path fill="none" d="M0 0h24v24H0V0z"/>
    <path fill={color} d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </svg>
);

MenuIcon.defaultProps = {
  width: 24,
  height: 24,
  color: 'black'
};

MenuIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};

export default MenuIcon;
