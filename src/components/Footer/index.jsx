import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

const Footer = ({children}) => (
  <div className="footer">
    {children}
  </div>
);

Footer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]).isRequired
};

export default Footer;
