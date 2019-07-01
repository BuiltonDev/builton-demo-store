import React, { useRef, useEffect } from 'react';
import ReactCursorPosition from 'react-cursor-position';
import PropTypes from 'prop-types';
import './headerDropdown.scss';

const HeaderDropdown = ({children, open}) => {
  const containerRef = useRef(null);
  const cursorPosRef = useRef(null);
  useEffect(() => {
    setTimeout(() => {
      if (open) {
        containerRef.current.classList.add('show-action')
      } else {
        if (cursorPosRef.current) {
          if (!cursorPosRef.current.state.isActive) {
            containerRef.current.classList.remove('show-action')
          }
        }
      }
    }, 50)
  });

  return(
    <ReactCursorPosition
      ref={cursorPosRef}
      hoverOffDelayInMs={50}
      onActivationChanged={({isActive}) => {
        if (!isActive) {
          containerRef.current.classList.remove('show-action');
        } else {
          containerRef.current.classList.add('show-action');
        }
      }}
    >
      <div
        ref={containerRef}
        className={`header-action-container`}
      >
        {children}
      </div>
    </ReactCursorPosition>
  )
};

export default HeaderDropdown;
