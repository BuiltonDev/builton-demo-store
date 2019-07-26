import React from "react";
import PropTypes from "prop-types";

import "./index.scss";

const DropdownMenu = ({ children }) => (
  <div className="dropdown-menu-container">{children}</div>
);

DropdownMenu.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]).isRequired
};

export default DropdownMenu;
