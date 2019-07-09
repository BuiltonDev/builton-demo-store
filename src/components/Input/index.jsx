import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

const Input = ({inputProps, submitting, placeholder, id, colorScheme, debounce}) => {
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
          }, debounce)
        }
      } else {
        input.onChange(ev.target.value);
      }
    }
    if (ev.target.value) {
      ev.target.parentNode.classList.add("input--filled");
    } else {
      ev.target.parentNode.classList.remove(
        "input--filled"
      );
    }
  };

  return(
    <>
      <input
        {...inputProps}
        disabled={submitting}
        onChange={(ev) => handleInputChange(ev, inputProps)}
        className="input__field"
        id={id}
      />
      <label
        className={`input__label input__label-color-${colorScheme}`}
        htmlFor={id}
      >
        <span className="input__label-content">
          {placeholder}
        </span>
      </label>
    </>
  )
};

Input.propTypes = {
  inputProps: PropTypes.object.isRequired,
  colorScheme: PropTypes.number,
  submitting: PropTypes.bool,
  placeholder: PropTypes.string,
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  debounce: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ])
};

export default Input;
