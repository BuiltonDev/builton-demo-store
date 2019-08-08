import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./index.scss";
import config from "../../config";
import Spinner from '../../components/Spinner';
import { getProductName } from "../../utils/productModifiers";
import useReactRouter from 'use-react-router';

const Carousel = ({ items, onActiveItemClick, activeItems, breakpoint }) => {
  const [activeItem, setActiveItem] = useState(new Array(activeItems).fill(0).map((i, index) => index));
  const [loadedItems, setLoadedItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const carouselRef = useRef(null);

  const { match } = useReactRouter();

  const setCarouselItems = () => {
    const carousel = carouselRef.current;
    const marginFactor = 12;
    const maxWidth = (carousel.clientWidth / (activeItems + 2)) - marginFactor;
    for (let i = 0; i < carousel.children.length; i += 1) {
      carousel.children[i].style.maxWidth = `${maxWidth}px`;
      for (let x = 0; x < activeItem.length; x += 1) {
        if (activeItem.includes(i)) {
          // Active items
          const left = (100 / (activeItems + (window.innerWidth < breakpoint ? 1 : 2 ))) * (x + 1);
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
            carousel.children[i].style.left = `0px`;
            carousel.children[i].style.transform = `translate3d(-300%, 0, 0)`;
          }
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("resize", setCarouselItems);
    setCarouselItems();
    return () => {
      window.removeEventListener("resize", setCarouselItems);
    }
  }, []);

  useEffect(() => {
    if (match.params && match.params.productId) {
      setLoaded(false);
    }
  }, [match.params.productId]);

  useEffect(() => {
    setCarouselItems();
  }, [activeItem]);

  useEffect(() => {
    setActiveItem(new Array(activeItems).fill(0).map((i, index) => index));
  }, [loaded]);

  useEffect(() => {
    if (items.length > 0) {
      setLoadedItems(items.map(item => item.image_url && ({id: item._id.$oid, imageLoaded: false})));
    }
  }, [items]);

  useEffect(() => {
    if (!loadedItems.length) return;
    let hasLoaded = true;
    for (let i = 0; i < loadedItems.length; i += 1) {
      if (!loadedItems[i].imageLoaded) {
        hasLoaded = false;
        break;
      }
    }

    if (hasLoaded) {
      setLoaded(true);
    }
  }, [loadedItems]);

  const handleClick = (prod) => {
    onActiveItemClick(getProductName(prod.name).toLowerCase(), prod._id.$oid)
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

  return (
    <>
      <div className={`carousel-container ${loaded ? 'show-carousel' : 'hide-carousel'}`} ref={carouselRef} id="carousel">
        {items.length > 0 && items.map((prod, index) => (
          prod.image_url ?
            <div
              key={`${prod._id.$oid}-product-${index}`}
              onClick={() => activeItem.includes(index) ? handleClick(prod) : pushActiveItem(index)}
              className={`${index < activeItem[0] ? 'previous-active-carousel-item' : ''} ${index > activeItem[activeItem.length - 1] ? 'next-active-carousel-item' : ''}`}
            >
              <div className="carousel-image-container">
                <img
                  src={`${config.endpoint}images/${prod.image_url}?api_key=${config.apiKey}`}
                  onLoad={() => {
                    loadedItems[index].imageLoaded = true;
                    setLoadedItems([ ...loadedItems ])
                  }}
                  onError={() => {
                    loadedItems[index].imageLoaded = true;
                    setLoadedItems([ ...loadedItems ])
                  }}
                />
                <div className={`similar-product-title-container ${activeItem.includes(index) ? 'show-title' : 'hide-title'}`}>
                  <span>{getProductName(prod.name)}</span>
                </div>
                <div className="carousel-item-overlay"/>
              </div>
              <div className={`similar-product-name-container ${activeItem.includes(index) ? 'show-title' : 'hide-title'}`}>
                <span>{prod.short_description}</span>
              </div>
            </div> : <div />
        ))}
      </div>
      {!loaded &&
        <div className="carousel-spinner-container">
          <Spinner />
        </div>
      }
    </>
  );
};

const shouldUpdate = (newProp, oldProp) => {
  return newProp.items.length === oldProp.items.length;
};

Carousel.defaultProps = {
  onActiveItemClick: () => {},
  activeItems: 1,
  breakpoint: 1280
};

Carousel.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onActiveItemClick: PropTypes.func,
  breakpoint: PropTypes.number,
  activeItems: PropTypes.number,
  comparisonProdId: PropTypes.string,
};

export default React.memo(Carousel, shouldUpdate);
