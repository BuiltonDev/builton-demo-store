import React from 'react';
import PropTypes from 'prop-types';

const ArrowRight = ({height, width, color}) => (
  <svg width={width} height={height} viewBox="0 0 24 24">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path fill={color} d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
  </svg>
);

ArrowRight.defaultProps = {
  width: 24,
  height: 24,
  color: 'black'
};

ArrowRight.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};

export default ArrowRight;


