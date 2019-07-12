import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';
import Input from "../Input";
import Spinner from "../Spinner";

const ProductListHeader = ({
  searchLoading,
  onSearchChange,
  brandLogo
                           }) => (
  <div className="page-heading">
    <div className="search-container">
      <Input
        inputProps={{
          type: 'text',
          name: 'product-search',
          onChange: (val) => {
            onSearchChange(val);
          }
        }}
        placeholder="Search"
        debounce={1000}
        colorScheme={1}
      />
    </div>
    {searchLoading &&
      <Spinner width={36} height={36} />
    }
    {brandLogo &&
      <div className="brand-logo-container">
        <img src={brandLogo} style={{ objectFit: 'contain' }} />
      </div>
    }
  </div>
);

ProductListHeader.propTypes = {
  brandLogo: PropTypes.string,
  onSearchChange: PropTypes.func.isRequired,
  searchLoading: PropTypes.bool,
};

export default ProductListHeader;
