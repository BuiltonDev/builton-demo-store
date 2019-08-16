import React from 'react';
import PropTypes from 'prop-types';

const ArrowLeft = ({height, width, color}) => (
  <svg width={width} height={height} viewBox="0 0 24 24">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path fill={color} d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
  </svg>
);

ArrowLeft.defaultProps = {
  width: 24,
  height: 24,
  color: 'black'
};

ArrowLeft.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};

export default ArrowLeft;


