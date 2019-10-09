import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Carousel from '../../components/Carousel';
import useReactRouter from 'use-react-router';
import Image from "../Image";

import "../Carousel/index.scss";

const ImagesCarousel = ({ items, onActiveItemClick, breakpoint, emptyMessage, selectOnScroll, activeItems }) => {
  const [loadedItems, setLoadedItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const { match } = useReactRouter();

  useEffect(() => {
    if (match.params && match.params.productId) {
      setLoaded(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.params.productId]);

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

  return (
    <>
      {items.length > 0 &&
      <Carousel
        activeItems={activeItems}
        loaded={loaded}
        breakpoint={breakpoint}
        onActiveItemClick={(index) => onActiveItemClick(items[index])}
        selectOnScroll={selectOnScroll}
      >
        {(items && items.length > 0) && items.map((item, index) => (
          item.image_url ?
            <div key={`${item.id}-product-${index}`}>
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
                      setLoadedItems([...loadedItems])
                    } else if (isCached && !loaded) {
                      setLoaded(true);
                    }
                  }}
                  onError={() => {
                    if (loadedItems[index]) {
                      loadedItems[index].imageLoaded = true;
                      setLoadedItems([...loadedItems])
                    }
                  }}
                  alt={`${item.name}-img`}
                />
              </div>
            </div> : <div/>
        ))}
      </Carousel>
      }
      {!items.length &&
        <div className="carousel-empty">
          {emptyMessage}
        </div>
      }
    </>
  );
};

ImagesCarousel.defaultProps = {
  onActiveItemClick: () => {},
  activeItems: 1,
  breakpoint: 1280,
  emptyMessage: '',
  selectOnScroll: false,
};

ImagesCarousel.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  onActiveItemClick: PropTypes.func,
  breakpoint: PropTypes.number,
  activeItems: PropTypes.number,
  emptyMessage: PropTypes.string,
  selectOnScroll: PropTypes.bool,
};

export default React.memo(ImagesCarousel);
