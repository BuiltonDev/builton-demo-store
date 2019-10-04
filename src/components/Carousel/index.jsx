import React, { useState, useEffect, useRef, createRef } from "react";
import PropTypes from "prop-types";
import Spinner from '../../components/Spinner';
import useReactRouter from 'use-react-router';

import "./index.scss";
import ArrowLeft from "../../assets/icons/arrowLeft";
import ArrowRight from "../../assets/icons/arrowRight";
import Image from "../Image";
import Button from "../Button";
import {getSneakersSize} from "../../utils/productModifiers";
import useEventListener from "../../hooks/useEventListener";

const calcActiveItems = countActiveItems => new Array(countActiveItems).fill(0).map((i, index) => index);

const Carousel = ({ items, onActiveItemClick, activeItems, breakpoint, emptyMessage, selectOnScroll, actionButton, actionButtonTitle, sneakerSizesAction, sneakerSizes, sneakerSizesButtonTitle,  }) => {
  const [activeItem, setActiveItem] = useState(calcActiveItems(activeItems));
  const [loadedItems, setLoadedItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [openSizes, setOpenSizes] = useState([]);
  const dropdownRefs = useRef(null);

  const carouselRef = useRef(null);

  const { match } = useReactRouter();

  const createRefs = (items) => {
    if (dropdownRefs.current === null) {
      dropdownRefs.current = items.map(() => React.createRef());
    }
  };
  if (items.length > 0) {
    createRefs(items);
  }

  const setCarouselItems = () => {
    const carousel = carouselRef.current;
    if (!carousel || !carousel.children.length) return false;
    const marginFactor = 12;
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
    if (match.params && match.params.productId) {
      setLoaded(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.params.productId]);

  useEffect(() => {
    setCarouselItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeItem]);

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

  useEffect(() => {
    if (items && items.length > 0) {
      handleResize(items);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  useEffect(() => {
    if (items && items.length > 0) {
      setLoadedItems(items.map(item => item.image_url && item.image_url && ({id: item.id, imageLoaded: false})));
    } else {
      if (typeof items === 'undefined') {
        setLoaded(true);
      }
    }

    window.addEventListener("resize",  () => handleResize(items));
    return () => {
      window.removeEventListener("resize", () => handleResize(items));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  useEffect(() => {
    // handle LazyLoad on images
    if (!loadedItems.length) return;
    let hasLoaded = true;
    for (let i = 0; i < loadedItems.length; i += 1) {
      if (loadedItems[i] && !loadedItems[i].imageLoaded) {
        hasLoaded = false;
        break;
      }
    }

    if (hasLoaded) {
      setLoaded(true);
    }
  }, [loadedItems]);

  const handleClick = (item) => {
    onActiveItemClick(item)
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
    if (selectOnScroll) {
      onActiveItemClick(items[activeItemIndex])
    }
    setActiveItem(copyActiveItem);
  };

  const handleOutsideClick = (e) => {
    dropdownRefs.current.forEach((ref, index) => {
      if (!ref.current.contains(e.target) && openSizes.includes(index)) {
        setOpenSizes([])
      }
    })
  };

  useEventListener('mousedown', handleOutsideClick);

  return (
    <>
      <div className={`carousel-container ${loaded ? 'show-carousel' : 'hide-carousel'}`} ref={carouselRef} id="carousel">
        {(items && items.length > 0) && items.map((item, index) => (
          item.image_url ?
            <div
              key={`${item.id}-product-${index}`}
              onClick={() => {
                if (openSizes.includes(index)) return false;
                activeItem.includes(index) ? handleClick(item) : pushActiveItem(index)
              }}
              className={`${index < activeItem[0] ? 'previous-active-carousel-item' : ''} ${index > activeItem[activeItem.length - 1] ? 'next-active-carousel-item' : ''}`}
            >
              <div className="carousel-image-container">
                {item.discount > 0 &&
                  <div className="carousel-product-discount-container">
                    - {item.discount * 100} %
                  </div>
                }
                <Image
                  src={`${item.image_url}`}
                  onLoad={(isCached) => {
                    if (loadedItems[index]) {
                      loadedItems[index].imageLoaded = true;
                      setLoadedItems([ ...loadedItems ])
                    } else if (isCached && !loaded) {
                      setLoaded(true);
                    }
                  }}
                  onError={() => {
                    if (loadedItems[index]) {
                      loadedItems[index].imageLoaded = true;
                      setLoadedItems([ ...loadedItems ])
                    }
                  }}
                  alt={`${item.name}-img`}
                />
                <div className={`similar-product-title-container ${activeItem.includes(index) ? 'show-title' : 'hide-title'}`}>
                  <span>{item.name}</span>
                </div>
                <div className="carousel-item-overlay"/>
                {index < activeItem[0] &&
                  <div className="carousel-left-arrow">
                    <ArrowLeft width={36} height={36} color="#d5d5d5" />
                  </div>
                }
                {index > activeItem[activeItem.length - 1] &&
                <div className="carousel-right-arrow">
                  <ArrowRight width={36} height={36} color="#d5d5d5" />
                </div>
                }
              </div>
              <div className={`item-description-carousel-container ${activeItem.includes(index) ? 'show-title' : 'hide-title'}`}>
                {item.short_description &&
                  <div className="item-carousel-name">
                    <span>{item.short_description}</span>
                  </div>
                }
                {item.price &&
                  <div className="product-carousel-price">
                    {item.price} {item.currency}
                  </div>
                }
              </div>
                <div className={`sneaker-sizes-button-container ${activeItem.includes(index) ? 'show-title' : 'hide-title'}`}>
                  <Button
                    className="light"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenSizes([...openSizes, index]);
                    }}
                    type="button"
                    style={{ height: 32 }}
                    title={sneakerSizesButtonTitle}
                  />
                  <div
                    ref={dropdownRefs.current[index]}
                    className={`sneaker-sizes-dropdown ${openSizes.includes(index) ? 'open-sizes-dropdown' : 'close-sizes-dropdown'}`}
                  >
                    {sneakerSizes && sneakerSizes.map((size, index) =>
                      <div className="sneaker-size-row" key={`sneaker-size-${index}-${size.product._id.$oid}`}>
                        {getSneakersSize(size.product)}
                      </div>
                    )}
                  </div>
                </div>
              {sneakerSizes &&
                <div className={` action-button-container  ${activeItem.includes(index) ? 'show-title' : 'hide-title'}`}>
                  <Button onClick={() => actionButton(item)} type="button" style={{ height: 32 }} title={actionButtonTitle} />
                </div>
              }
            </div> : <div />
        ))}
      </div>
      {!loaded &&
        <div className="carousel-spinner-container">
          <Spinner />
        </div>
      }
      {typeof items === 'undefined' &&
        <div className="carousel-empty">
          {emptyMessage}
        </div>
      }
    </>
  );
};

const shouldUpdate = (oldProp, newProp) => {
  if (typeof newProp.items !== 'undefined') {
    return newProp.items.length === oldProp.items.length
  } else {
    return typeof newProp.items === typeof oldProp.items;
  }
};

Carousel.defaultProps = {
  onActiveItemClick: () => {},
  activeItems: 1,
  breakpoint: 1280,
  emptyMessage: '',
  selectOnScroll: false,
  actionButton: undefined,
  actionButtonTitle: 'View',
  sneakerSizes: undefined,
  sneakerSizesButtonTitle: 'Size',
  sneakerSizesAction: undefined,
};

Carousel.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  onActiveItemClick: PropTypes.func,
  breakpoint: PropTypes.number,
  activeItems: PropTypes.number,
  comparisonProdId: PropTypes.string,
  emptyMessage: PropTypes.string,
  selectOnScroll: PropTypes.bool,
  actionButton: PropTypes.func,
  actionButtonTitle: PropTypes.string,
  sneakerSizes: PropTypes.arrayOf(PropTypes.object),
  sneakerSizesButtonTitle: PropTypes.string,
  sneakerSizesAction: PropTypes.func,
};

export default React.memo(Carousel, shouldUpdate);
