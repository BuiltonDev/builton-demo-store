import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

const Hyperlink = ({ onClick, title }) => (
  <button
    type="button"
    className="link-button"
    onClick={onClick}
  >
    {title}
  </button>
);

Hyperlink.propTypes = {
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}

export default Hyperlink;
