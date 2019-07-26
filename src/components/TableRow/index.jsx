import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

const TableRow = ({children, onClick}) => {
  return (
    <div className="table-row" onClick={onClick}>
      {children}
    </div>
  )
};

TableRow.defaultProps = {
  onClick: undefined,
};

TableRow.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired
};

export default TableRow;
