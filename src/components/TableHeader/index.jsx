import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

const TableHeader = ({children}) => {
  return (
    <div className="table-header">
      {children}
    </div>
  )
};

export default TableHeader;

