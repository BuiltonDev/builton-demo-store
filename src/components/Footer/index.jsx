import React from "react";
import PropTypes from "prop-types";
import "./index.scss";

const Footer = ({ children, style }) => <div style={style} className="footer">{children}</div>;

Footer.defaultProps = {
  style: {},
};

Footer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]).isRequired,
  style: PropTypes.object,
};

export default Footer;
