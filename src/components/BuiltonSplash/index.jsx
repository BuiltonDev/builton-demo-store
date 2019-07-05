import React from 'react';
import PropTypes from 'prop-types';
import BLogo from "../../assets/icons/b_logo";
import './index.scss';
import Spinner from "../Spinner";

const BuiltonSplash = ({ show, backgroundColor }) => {
  return(
    <div
      className={`splash-container ${show ? 'show-splash' : 'hide-splash'}`}
      style={{ backgroundColor }}
    >
      <div className='splash-content-container'>
        <BLogo width={240} height={92} />
        <div className='splash-subtitle'>
          Sneakers Demo Store
        </div>
        <div className='spinner-container'>
          <Spinner width={36} height={36} />
        </div>
      </div>
    </div>
  )
};

BuiltonSplash.defaultProps = {
  show: true,
  backgroundColor: 'transparent'
};

BuiltonSplash.propTypes = {
  show: PropTypes.bool,
  backgroundColor: PropTypes.string,
}

export default BuiltonSplash;

