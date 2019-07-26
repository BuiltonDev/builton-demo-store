import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

const TableRow = ({children, onClick, style, className}) => {
  return (
    <div className={`table-row ${onClick ? 'clickable-row' : ''} ${className}`} style={style} onClick={onClick}>
      {children}
    </div>
  )
};

TableRow.defaultProps = {
  onClick: undefined,
  style: {},
  className: '',
};

TableRow.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  style: PropTypes.object,
  className: PropTypes.string,
};

export default TableRow;
