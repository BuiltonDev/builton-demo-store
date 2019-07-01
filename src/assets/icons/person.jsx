import React from 'react';
import PropTypes from 'prop-types';

const Account = ({height, width, color}) => (
  <svg width={width} height={height} viewBox="0 0 24 24">
    <path fill={color} d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
  </svg>
);

Account.defaultProps = {
  width: 24,
  height: 24,
  color: 'black'
};

Account.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};

export default Account;


