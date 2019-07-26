import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

const SectionHeader = ({title, style}) => {
  return (
    <div className="section-header-container" style={style}>{title}</div>
  )
};

SectionHeader.defaultProps = {
  style: {}
};

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  style: PropTypes.object,
};

export default SectionHeader;
