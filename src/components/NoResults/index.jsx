import React from "react";
import PropTypes from "prop-types";
import BLogo from "../../assets/icons/b_logo";
import "./index.scss";

const NoResults = ({ show, backgroundColor }) => {
  return (
    <div
      className={`no-results-container ${show ? "show-no-results" : ""}`}
      style={{ backgroundColor }}
    >
      <div className="no-results-content-container">
        <BLogo width={180} height={68} />
        <div className="no-results-subtitle">No results found</div>
      </div>
    </div>
  );
};

NoResults.defaultProps = {
  show: false,
  backgroundColor: "transparent"
};

NoResults.propTypes = {
  show: PropTypes.bool,
  backgroundColor: PropTypes.string
};

export default NoResults;
