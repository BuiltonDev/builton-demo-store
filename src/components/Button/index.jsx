import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

const Button = ({ loading, type, style, className, title}) => (
  <button
    disabled={loading}
    type={type}
    style={style}
    className={className}
  >
    {loading ? <div className="loader"/> : <span>{title}</span>}
  </button>
);

Button.defaultProps = {
  type: "submit",
  className: "button"
};

Button.propTypes = {
  loading: PropTypes.bool,
  type: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  title: PropTypes.string,
};

export default Button;
