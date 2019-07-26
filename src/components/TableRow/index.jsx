import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

const TableRow = ({children, onClick, style}) => {
  return (
    <div className="table-row" style={style} onClick={onClick}>
      {children}
    </div>
  )
};

TableRow.defaultProps = {
  onClick: undefined,
  style: {}
};

TableRow.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  style: PropTypes.object,
};

export default TableRow;
