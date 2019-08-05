import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./index.scss";
import config from "../../config";
import {getProductName} from "../../utils/productModifiers";

const Carousel = React.memo(({ items, onActiveItemClick }) => {
  const [activeItem, setActiveItem] = useState(0);
  const carouselRef = useRef(null);

  const setCarouselItems = () => {
    const carousel = carouselRef.current;
    for (let i = 0; i < carousel.children.length; i += 1) {
      const maxWidth = (carousel.clientWidth / 3) - 48;
      carousel.children[i].style.maxWidth = `${maxWidth}px`;
      if (activeItem === i) {
        const currentActiveItem = carousel.children[i];
        const previousActiveItem = carousel.children[i - 1];
        const nextActiveItem = carousel.children[i + 1];
        const transform = (carousel.clientWidth / 2 - maxWidth / 2) - 32;
        if (activeItem === 0) {
          currentActiveItem.style.transform = `translate3d(${transform}px, 0px, 0px)`;
          nextActiveItem.style.transform = `translate3d(${transform}px, 0px, 0px)`;
        } else if (activeItem + 1 === carousel.children.length) {
          previousActiveItem.style.transform = `translate3d(-${transform}px, 0px, 0px)`;
          currentActiveItem.style.transform = `translate3d(-${transform}px, 0px, 0px)`;
        } else {
          currentActiveItem.style.transform = `translate3d(0px, 0px, 0px)`;
          previousActiveItem.style.transform = `translate3d(0px, 0px, 0px)`;
          nextActiveItem.style.transform = `translate3d(0px, 0px, 0px)`;
        }
      } else {
        if (i !== activeItem - 1 && i !== activeItem + 1) {
          carousel.children[i].style.transform = `translateX(${
            activeItem < i ? "" : "-"
          }100vw)`;
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
    setCarouselItems();
  }, [activeItem]);

  useEffect(() => {
    setActiveItem(0);
    setCarouselItems();
  }, [items]);

  const handleClick = (prod) => {
    onActiveItemClick(getProductName(prod.name).toLowerCase(), prod._id.$oid)
  };

  return (
    <div className="carousel-container" ref={carouselRef} id="carousel">
      {items.map((prod, index) => (
        prod.image_url ?
          <div
            className={`${activeItem === index ? "active-carousel-item" : ""} ${
              index === activeItem - 1 && activeItem > 0
                ? "previous-active-carousel-item"
                : ""
            } ${
              index === activeItem + 1 && activeItem < items.length
                ? "next-active-carousel-item"
                : ""
            }`}
            key={`${prod._id.$oid}-product-${index}`}
            onClick={() => activeItem === index ? handleClick(prod) : setActiveItem(index)}
          >
            <div className="carousel-image-container">
              <img
                src={`${config.endpoint}images/${prod.image_url}?api_key=${config.apiKey}`}
              />
              <div className="carousel-item-overlay"/>
            </div>
            <div className={`similar-product-name-container ${activeItem === index ? 'show-title' : 'hide-title'}`}>
              <span>{getProductName(prod.name)}</span>
              <span>{prod.short_description}</span>
            </div>
          </div> : <div />
      ))}
    </div>
  );
});

Carousel.defaultProps = {
  onActiveItemClick: () => {},
};

Carousel.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onActiveItemClick: PropTypes.func,
};

export default Carousel;