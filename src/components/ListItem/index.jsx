import React from 'react';
import './index.scss';

const ListItem = ({ children }) => {
  return(
    <div className="list-item-row">
      {children}
    </div>
  )
};

export default ListItem;
