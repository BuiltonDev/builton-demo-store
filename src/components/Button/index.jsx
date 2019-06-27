import React from 'react';
import PropTypes from 'prop-types';
import './button.scss';

const Button = ({
  onClick,
  adornment,
  title
    }) => {
  return(
    <div
      className='mainButton round'
      onClick={onClick}
    >
      {adornment &&
        <div className='adornment'>
          {adornment}
        </div>
      }
      <div className='buttonText'>
        {title}
      </div>
    </div>
  );
};

Button.propTypes = {
  title: PropTypes.string.isRequired,
  adornment: PropTypes.element,
  onClick: PropTypes.func.isRequired,
};

export default Button;

