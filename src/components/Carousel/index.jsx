import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./index.scss";
import config from "../../config";

const Carousel = ({ items }) => {
  const [activeItem, setActiveItem] = useState(0);
  const carouselRef = useRef(null);
  useEffect(() => {
    const setCarouselItems = () => {
      for (let i = 0; i < carouselRef.current.children.length; i += 1) {
        const maxWidth = carouselRef.current.clientWidth / 3;
        carouselRef.current.children[i].style.maxWidth = `${maxWidth}px`;
      }
    };
    const listener = window.addEventListener("resize", () => {
      setCarouselItems();
    });

    setCarouselItems();
    return () => {
      listener.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    for (let i = 0; i < carouselRef.current.children.length; i += 1) {
      const maxWidth = carouselRef.current.clientWidth / 3;
      carouselRef.current.children[i].style.maxWidth = `${maxWidth}px`;
      if (activeItem === i) {
        const currentActiveItem = carouselRef.current.children[i];
        const previousActiveItem = carouselRef.current.children[i - 1];
        const nextActiveItem = carouselRef.current.children[i + 1];
        if (i + 1 < carouselRef.current.children.length) {
          nextActiveItem.style.opacity = `1`;
        }
        currentActiveItem.style.opacity = `1`;
        if (i > 0) {
          previousActiveItem.style.opacity = `1`;
        }
        if (activeItem === 0) {
          currentActiveItem.style.transform = `translate3d(${carouselRef.current
            .clientWidth / 2 - maxWidth / 2}px, 0px, 0px)`;
          nextActiveItem.style.transform = `translate3d(${carouselRef.current
            .clientWidth / 2 - maxWidth / 8}px, 0px, 0px)`;
        } else if (activeItem + 1 === carouselRef.current.children.length) {
          previousActiveItem.style.transform = `translate3d(-${carouselRef
            .current.clientWidth / 2 - maxWidth / 8}px, 0px, 0px)`;
          currentActiveItem.style.transform = `translate3d(-${carouselRef.current
            .clientWidth / 2 - maxWidth / 2}px, 0px, 0px)`;
        } else {
          currentActiveItem.style.transform = `translate3d(0px, 0px, 0px)`;
          previousActiveItem.style.transform = `translate3d(-${carouselRef
            .current.clientWidth / 2 - maxWidth}px, 0px, 0px)`;
          nextActiveItem.style.transform = `translate3d(${carouselRef.current
            .clientWidth / 2 - maxWidth}px, 0px, 0px)`;
        }
      } else {
        if (i !== activeItem - 1 && i !== activeItem + 1) {
          carouselRef.current.children[i].style.opacity = `0`;
          carouselRef.current.children[i].style.transform = `translateX(${
            activeItem < i ? "" : "-"
          }100vw)`;
        }
      }
    }
  }, [activeItem]);

  return (
    <div className="carousel-container" ref={carouselRef} id="carousel">
      {items.map((prod, index) => (
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
          key={`${prod._id.$oid}-product`}
          onClick={() => setActiveItem(index)}
        >
          <img
            src={`${config.endpoint}images/${prod.image_url}?api_key=${config.apiKey}`}
          />
        </div>
      ))}
    </div>
  );
};

Carousel.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default Carousel;
