import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

const ListItem = ({ children, onClick }) => {
  return(
    <div onClick={onClick} className="list-item-row">
      {children}
    </div>
  )
};

ListItem.defaultProps = {
  onClick: () => {}
};

ListItem.propTypes = {
  onClick: PropTypes.func,
};

export default ListItem;
