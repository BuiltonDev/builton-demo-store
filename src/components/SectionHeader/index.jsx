import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

const SectionHeader = ({title, style, type}) => {
  return (
    <div className={`section-header-container ${type}`} style={style}>{title}</div>
  )
};

SectionHeader.defaultProps = {
  style: {},
  type: "main"
};

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  style: PropTypes.object,
  type: PropTypes.oneOf([
    "main",
    "sub"
  ])
};

export default SectionHeader;
