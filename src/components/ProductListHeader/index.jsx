import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./index.scss";
import Input from "../Input";
import Search from "../../assets/icons/search";
import Filter from '../../components/Filter';
import builton from "../../utils/builton";
import notify from "../../utils/toast";
import {getSneakersSizes} from "../../utils/productModifiers";

const FILTER_OPTIONS =[
  {
    title: '',
    options: [
      'Women',
      'Men',
    ]
  },
  {
    title: 'Sizes',
    options: [],
  }
];

const ProductListHeader = ({
  searchLoading,
  onSearchChange,
  brandLogo,
  show,
  onFilter,
}) => {

  const [ filterOptions, setFilterOptions ] = useState(FILTER_OPTIONS);

  useEffect(() => {
    const getSubproducts = async () => {
      try {
        const subProds = await builton.products.get({
          urlParams: {
            tags: 'size',
            type: 'sub'
          }
        });
        if (subProds.current.length > 0) {
          const sizes = [ ...filterOptions ];
          sizes[1].options = getSneakersSizes(subProds.current);
          setFilterOptions(sizes);
        }
      } catch(err) {
        notify('Failed to fetch sub products', {
          type: 'error'
        })
      }
    };
    getSubproducts();
  }, [])

  return (
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
      <Filter filterOptions={filterOptions} onFilter={(sort) => onFilter(sort)} renderOption="size" />
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
};

ProductListHeader.propTypes = {
  brandLogo: PropTypes.string,
  onSearchChange: PropTypes.func.isRequired,
  searchLoading: PropTypes.bool,
  show: PropTypes.bool,
  onFilter: PropTypes.func.isRequired,
};

export default ProductListHeader;
