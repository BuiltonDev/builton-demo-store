import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FilterIcon from "../../assets/icons/filterIcon";

import './index.scss';

const Filter = ({
  filterOptions,
  renderOption,
                }) => {
  const contentRef = useRef(null);

  const [filterOpen, setFilterOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if(!contentRef.current.contains(e.target) && filterOpen) {
        setFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick, false);
    return () => document.removeEventListener('mousedown', handleOutsideClick, false)
  }, [filterOpen]);

  const setFilter = (option) => {
    const items = [ ...filteredItems ];
    if (items.length > 0) {
      for (let i = 0; i < items.length; i += 1) {
        if (typeof option === "object") {
          console.log(items[i].id === option.id);
          if (items[i] && items[i].id !== option.id) {
            items.splice(i, 1);
            break;
          } else {
            items.push(option);
            break;
          }
        } else {
          if (items.includes(option)) {
            items.splice(i, 1);
            break;
          } else {
            items.push(option);
            break;
          }
        }
      }
    } else {
      items.push(option);
    }

    setFilteredItems(items);
  };

  console.log(filteredItems);

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
                <div className="filter-category-item" key={`option-${indx}`} onClick={() => setFilter(option)}>
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
  renderOption: PropTypes.string,
  filterOptions: PropTypes.array.isRequired,
};

export default Filter;
