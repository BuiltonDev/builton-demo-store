import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

const Hyperlink = ({ onClick, title }) => (
  <a
    className="link-button"
    onClick={onClick}
  >
    {title}
  </a>
);

Hyperlink.propTypes = {
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}

export default Hyperlink;
