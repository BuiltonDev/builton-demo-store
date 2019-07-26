import React from "react";
import PropTypes from "prop-types";

import "./index.scss";

const TableHeader = ({ children, className, style }) => {
  return (
    <div className={`table-header ${className}`} style={style}>
      {children}
    </div>
  );
};

TableHeader.defaultProps = {
  className: "",
  style: {}
};

TableHeader.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]).isRequired,
  style: PropTypes.object
};

export default TableHeader;
