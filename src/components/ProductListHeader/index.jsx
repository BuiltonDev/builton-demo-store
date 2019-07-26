import React from "react";
import PropTypes from "prop-types";
import "./index.scss";
import Input from "../Input";
import Search from "../../assets/icons/search";

const ProductListHeader = ({
  searchLoading,
  onSearchChange,
  brandLogo,
  show
}) => (
  <div className={`page-heading ${show ? "show-heading" : ""}`}>
    <div className="search-container">
      <Input
        loading={searchLoading}
        leftAdornment={
          <Search width={22} height={22} color="rgb(141, 141, 141)" />
        }
        inputProps={{
          type: "text",
          name: "product-search",
          onChange: val => {
            onSearchChange(val);
          }
        }}
        placeholder="Search"
        debounce={1000}
        colorScheme={1}
      />
    </div>
    {brandLogo && (
      <div className="brand-logo-container">
        <img
          src={brandLogo}
          style={{ objectFit: "contain" }}
          alt="brand-logo"
        />
      </div>
    )}
  </div>
);

ProductListHeader.propTypes = {
  brandLogo: PropTypes.string,
  onSearchChange: PropTypes.func.isRequired,
  searchLoading: PropTypes.bool,
  show: PropTypes.bool
};

export default ProductListHeader;
