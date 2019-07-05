import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';
import globalState from "../../globalStore/globalState";

const DropdownMenuItem = ({
  onClick,
  children,
}) => (
  <div
    className="dropdown-menu-item"
    onClick={onClick}
  >
    {children}
  </div>
);

DropdownMenuItem.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]).isRequired,
  onClick: PropTypes.func,
};

export default DropdownMenuItem;
