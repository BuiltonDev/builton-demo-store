import React from "react";
import PropTypes from "prop-types";
import "./index.scss";

const Table = ({ children }) => {
  return <div className="table">{children}</div>;
};

Table.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

export default Table;
