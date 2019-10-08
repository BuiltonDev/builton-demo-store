import React, { useState, useEffect, useRef, createElement } from "react";
import PropTypes from "prop-types";
import Spinner from '../../components/Spinner';

import "./index.scss";
import ArrowLeft from "../../assets/icons/arrowLeft";
import ArrowRight from "../../assets/icons/arrowRight";

const calcActiveItems = countActiveItems => new Array(countActiveItems).fill(0).map((i, index) => index);

const Carousel = ({ activeItems, breakpoint, emptyMessage, children, loaded, onActiveItemClick }) => {
  const [activeItem, setActiveItem] = useState(calcActiveItems(activeItems));

  const carouselRef = useRef(null);

  const setCarouselItems = () => {
    const carousel = carouselRef.current;
    if (!carousel || !carousel.children.length) return false;
    const marginFactor = 12;
    const items = carousel.children;
    let maxWidth = (carousel.clientWidth / (activeItem.length + 2)) - marginFactor;

    // So it renders properly on small displays
    if (window.innerWidth < 720) {
      maxWidth = 240;
    }

    for (let i = 0; i < carousel.children.length; i += 1) {
      // Set each item size
      carousel.children[i].style.maxWidth = `${maxWidth}px`;
      for (let x = 0; x < activeItem.length; x += 1) {
        if (activeItem.includes(i)) {
          // Active items
          let left = (100 / (activeItem.length + (window.innerWidth < breakpoint ? 1 : 2 ))) * (x + 1);
          // In case we get items than we have set to display in activeItems
          if (items.length <= activeItem.length) {
            left = left / activeItems;
          }
          const leftStyle = window.innerWidth < breakpoint ? `${left}%` : `calc(${left}% + ${marginFactor / 2}px)`;
          carousel.children[activeItem[x]].style.left = leftStyle;
          carousel.children[activeItem[x]].style.transform = `translate3d(${window.innerWidth < breakpoint ? '-50%' : '0'}, 0, 0)`;
        } else {
          if (i === activeItem[activeItem.length - 1] + 1) {
            // Next item
            carousel.children[i].style.left = `calc(100% - ${maxWidth}px)`;
            carousel.children[i].style.transform = `translate3d(${window.innerWidth < breakpoint ? '50%' : '0'}, 0, 0)`;
          } else if (i === activeItem[0] - 1) {
            // Previous item
            carousel.children[i].style.left = `0`;
            carousel.children[i].style.transform = `translate3d(${window.innerWidth < breakpoint ? '-50%' : '0'}, 0, 0)`;
          } else if (i > activeItem[activeItem.length - 1] + 1) {
            // Next items
            carousel.children[i].style.right = `-${maxWidth}px`;
            carousel.children[i].style.transform = `translate3d(300%, 0, 0)`;
          } else {
            // Previous items
            carousel.children[i].style.left = `0`;
            carousel.children[i].style.transform = `translate3d(-300%, 0, 0)`;
          }
        }
      }
    }
  };

  useEffect(() => {
    setCarouselItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeItem]);

  const getModifiedChildren = (child, index) => {
    let className = '';

    if (index - 1 === Math.max(...activeItem) && children.length > activeItems) {
      className = 'next-active-carousel-item';
    } else if (index + 1 === Math.min(...activeItem)) {
      className = 'previous-active-carousel-item';
    }

    const props = {
      className,
      onClick: () => activeItem.includes(index) ? onActiveItemClick(index) : pushActiveItem(index),
      children: [
        ...child.props.children,
        className.length > 0 && createElement("div", {
          className: 'carousel-item-overlay',
          key: `carousel-left-overlay-${index}`,
        }),
        index < activeItem[0] && createElement("div", {
          className: 'carousel-left-arrow',
          key: `carousel-left-arrow-${index}`,
        }, createElement(ArrowLeft, { width: 36, height: 36, color: "#d5d5d5"})),
        index > activeItem[activeItem.length - 1] && createElement("div", {
          className: 'carousel-right-arrow',
          key: `carousel-right-arrow-${index}`,
        }, createElement(ArrowRight, { width: 36, height: 36, color: "#d5d5d5"})),
      ]
    };

    return React.cloneElement(child, props)
  };

  const pushActiveItem = (activeItemIndex) => {
    const copyActiveItem = [...activeItem];
    for (let i = 0; i < copyActiveItem.length; i += 1) {
      if (activeItemIndex <= copyActiveItem[0]) {
        copyActiveItem[i] -= 1;
      } else {
        copyActiveItem[i] += 1;
      }
    }
    setActiveItem(copyActiveItem);
  };


  useEffect(() => {
    const handleResize = (initialItems) => {
      if (activeItems >= 2 && window.innerWidth <= 780) {
        setActiveItem(calcActiveItems(1));
      } else if (activeItems >= 4 && window.innerWidth <= 1280) {
        if (initialItems.length > 2) {
          setActiveItem(calcActiveItems(2));
        } else {
          setActiveItem(calcActiveItems(1));
        }
      } else {
        if (initialItems.length >= activeItems) {
          setActiveItem(calcActiveItems(activeItems));
        } else {
          setActiveItem(calcActiveItems(initialItems.length));
        }
      }
    };

    if (children && children.length > 0) {
      handleResize(children);
    }

    window.addEventListener("resize",  () => handleResize(children));
    return () => {
      window.removeEventListener("resize", () => handleResize(children));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);


  return (
    <>
      <div className={`carousel-container ${loaded ? 'show-carousel' : 'hide-carousel'}`} ref={carouselRef} id="carousel">
        {children && children.map((child, index) => getModifiedChildren(child, index))}
      </div>
      {!loaded &&
        <div className="carousel-spinner-container">
          <Spinner />
        </div>
      }
    </>
  );
};

Carousel.defaultProps = {
  onActiveItemClick: () => {},
  activeItems: 1,
  breakpoint: 1280,
  emptyMessage: '',
  selectOnScroll: false,
  showSneakerSizes: false,
};

Carousel.propTypes = {
  loaded: PropTypes.bool,
  breakpoint: PropTypes.number,
  activeItems: PropTypes.number,
  emptyMessage: PropTypes.string,
  selectOnScroll: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ])
};

export default React.memo(Carousel);
