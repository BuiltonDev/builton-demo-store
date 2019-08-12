import React from 'react';
import PropTypes from 'prop-types';

const FilterIcon = ({height, width, color}) => (
  <svg width={width} height={height} viewBox="0 0 24 24">
    <path fill={color} d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
  </svg>
);

FilterIcon.defaultProps = {
  width: 24,
  height: 24,
  color: 'black'
};

FilterIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};

export default FilterIcon;
