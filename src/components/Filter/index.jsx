import React, { useRef, useEffect, useState } from 'react';
import useEventListener from "../../hooks/useEventListener";
import PropTypes from 'prop-types';
import FilterIcon from "../../assets/icons/filterIcon";

import './index.scss';

const Filter = ({ filterOptions, renderOption, onFilter }) => {
  const contentRef = useRef(null);

  const [filterOpen, setFilterOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);

  const handleOutsideClick = (e) => {
    if(!contentRef.current.contains(e.target) && filterOpen) {
      setFilterOpen(false);
      onFilter(filteredItems);
    }
  };

  useEventListener('mousedown', handleOutsideClick);

  const setFilter = (option) => {
    const items = [ ...filteredItems ];
    if (items.length > 0) {
      if (items.includes(option)) {
        items.splice(items.indexOf(option), 1);
      } else {
        items.push(option);
      }
    } else {
      items.push(option);
    }

    setFilteredItems(items);
  };

  return (
    <div className="filter-container">
      <div
        className={`filter-button ${filterOpen ? 'active-button' : ''}`}
        onClick={() => setFilterOpen(true)}
      >
        <FilterIcon />
      </div>
      <div className={`filter-main-container ${filterOpen ? 'show-filter' : 'hide-filter'}`}>
        <div ref={contentRef} className="filter-inner-container">
          {filterOptions && filterOptions.map((category, index) => (
            <div key={`filter-category-${index}`} className="filter-category-container">
              {!!category.title && <div className="filter-category-title">{category.title}</div>}
              {category.options.map((option, indx) => (
                <div className={`filter-category-item ${filteredItems.includes(option) ? 'selected-item' : ''}`} key={`option-${indx}`} onClick={() => setFilter(option)}>
                  {typeof option === "object" ? option[renderOption] : option}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
};

Filter.defaultProps = {
  renderOption: '',
};

Filter.propTypes = {
  onFilter: PropTypes.func.isRequired,
  renderOption: PropTypes.string,
  filterOptions: PropTypes.array.isRequired,
};

export default React.memo(Filter);
