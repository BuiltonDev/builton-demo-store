import React, { useRef, useEffect } from "react";
import ReactCursorPosition, {
  INTERACTIONS
} from "react-cursor-position";
import PropTypes from "prop-types";
import "./index.scss";
import {checkIfMobile} from "../../utils/mobile";

const HeaderDropdown = ({ children, open, style }) => {
  const containerRef = useRef(null);
  const cursorPosRef = useRef(null);
  useEffect(() => {
    setTimeout(() => {
      if (open) {
        containerRef.current.classList.add("show-action");
      } else {
        if (cursorPosRef.current) {
          if (!cursorPosRef.current.state.isActive) {
            containerRef.current.classList.remove("show-action");
          }
        }
      }
    }, 50);
  });

  return (
    <ReactCursorPosition
      ref={cursorPosRef}
      hoverOffDelayInMs={50}
      activationInteractionMouse={INTERACTIONS.HOVER}
      activationInteractionTouch={INTERACTIONS.TAP}
      onActivationChanged={({ isActive }) => {
        if (containerRef && containerRef.current) {
          if (!isActive) {
            containerRef.current.classList.remove("show-action");
          } else {
            containerRef.current.classList.add("show-action");
          }
        }
      }}
    >
      <div
        ref={containerRef}
        className={`header-action-container`}
        style={style}
      >
        {children}
      </div>
    </ReactCursorPosition>
  );
};

HeaderDropdown.defaultProps = {
  open: false
};

HeaderDropdown.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]),
  style: PropTypes.object,
  open: PropTypes.bool
};

export default HeaderDropdown;
