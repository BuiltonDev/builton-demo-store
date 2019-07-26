import React, { useEffect } from "react";
import PropTypes from "prop-types";

import "./index.scss";

const Input = ({
  inputProps,
  submitting,
  placeholder,
  id,
  colorScheme,
  debounce,
  leftAdornment,
  loading
}) => {
  let debouncedValue;
  let timeout;
  const handleInputChange = (ev, input) => {
    if (input.onChange) {
      if (debounce) {
        ev.persist();
        if (debouncedValue !== ev.target.value) {
          if (timeout) {
            clearTimeout(timeout);
          }
          timeout = setTimeout(() => {
            input.onChange(ev.target.value);
          }, debounce);
        }
      } else {
        input.onChange(ev.target.value, ev);
      }
    }
    if (ev.target.value) {
      ev.target.parentNode.classList.add("input--filled");
    } else {
      ev.target.parentNode.classList.remove("input--filled");
    }
  };

  useEffect(() => {
    if (typeof inputProps.value !== "undefined" && inputProps.value !== "") {
      document.getElementById(id).parentNode.classList.add("input--filled");
    }
  });

  return (
    <>
      {leftAdornment && <div className="left-adornment">{leftAdornment}</div>}
      <input
        {...inputProps}
        disabled={submitting}
        onChange={ev => handleInputChange(ev, inputProps)}
        className="input__field"
        id={id}
        style={{ ...(leftAdornment && { paddingLeft: 28 }) }}
      />
      <label
        className={`input__label input__label-color-${colorScheme}`}
        htmlFor={id}
        style={{ ...(leftAdornment && { paddingLeft: 28, top: 10 }) }}
      >
        <div
          className={`input-loading-container ${
            loading ? "input-loading" : ""
          }`}
        >
          <div className="input-loading-1" />
          <div className="input-loading-2" />
          <div className="input-loading-3" />
          <div className="input-loading-4" />
        </div>
        <span className="input__label-content">{placeholder}</span>
      </label>
    </>
  );
};

Input.defaultProps = {
  loading: false
};

Input.propTypes = {
  inputProps: PropTypes.object.isRequired,
  colorScheme: PropTypes.number,
  submitting: PropTypes.bool,
  placeholder: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  debounce: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  leftAdornment: PropTypes.node,
  loading: PropTypes.bool
};

export default Input;
