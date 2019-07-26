import React from "react";
import PropTypes from "prop-types";
import "./index.scss";

const Spinner = ({ width, height }) => (
  <div className="loader" style={{ width, height }} />
);

Spinner.defaultProps = {
  width: 24,
  height: 24
};

Spinner.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number
};

export default Spinner;
