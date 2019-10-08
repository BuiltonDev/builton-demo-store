import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Carousel from '../../components/Carousel';
import useReactRouter from 'use-react-router';

import "../Carousel/index.scss";
import Image from "../Image";
import Button from "../Button";
import {getProductName, getSneakersSize, getSneakersSizes} from "../../utils/productModifiers";
import useEventListener from "../../hooks/useEventListener";
import notify from "../../utils/toast";
import {useDispatch} from "reactn";

const MLCarousel = ({ items, onActiveItemClick, activeItems, breakpoint, emptyMessage, selectOnScroll, showSneakerSizes }) => {
  const [loadedItems, setLoadedItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [openSizes, setOpenSizes] = useState(undefined);
  const [selectedSneakerSize, setSelectedSneakerSize] = useState({});
  const addItemToBag = useDispatch("addItemToBag"); //reducer
  const dropdownRefs = useRef(null);

  const { match } = useReactRouter();

  const createRefs = (items) => {
    if (dropdownRefs.current === null) {
      dropdownRefs.current = items.map(() => React.createRef());
    }
  };

  if (items && items.length > 0) {
    createRefs(items);
  }

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

  const addToBag = async (item, size) => {
    if (!size) {
      notify("Please select your desired size.", {
        type: "warning"
      });
    } else {
      try {
        await addItemToBag({
          product: item,
          size: size,
          category: match.params.category
        });
        notify(`${item.name} successfully added to your bag.`, {
          type: "info"
        });
      } catch (err) {
        notify(`Failed to add ${item.name} to your bag.`, {
          type: "error"
        });
      }
    }
  };

  const handleOutsideClick = (e) => {
    if (dropdownRefs.current) {
      dropdownRefs.current.forEach((ref, index) => {
        if (ref.current && !ref.current.contains(e.target) && openSizes === index) {
          setOpenSizes(undefined);
        }
      })
    }
  };

  const getSelectedSneakerSize = (index) => {
    const sizeKeys = Object.keys(selectedSneakerSize);
    if (sizeKeys.includes(index.toString())) {
      return getSneakersSize(selectedSneakerSize[index]);
    }
    return false;
  };

  const isRowSelected = (productIndex, size) => {
    const copySneakers = { ...selectedSneakerSize };
    if (Object.keys(copySneakers).includes(productIndex.toString())) {
      return copySneakers[productIndex]._id.$oid === size.product._id.$oid;
    }

    return false;
  };

  useEventListener('mousedown', handleOutsideClick);

  return (
    <Carousel activeItems={4} loaded={loaded} onActiveItemClick={(index) => onActiveItemClick(items[index])}>
        {(items && items.length > 0) && items.map((item, index) =>(
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
                <div className={`similar-product-title-container`}>
                  <span>{item.name && getProductName(item.name)}</span>
                </div>
              </div>
              <div className={`item-description-carousel-container`}>
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
              {showSneakerSizes &&
              <>
                <div className={`sneaker-sizes-button-container`}>
                  <Button
                    className="light"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenSizes(index);
                    }}
                    type="button"
                    style={{ height: 32 }}
                    title={`${getSelectedSneakerSize(index) ? 'Size ' + getSelectedSneakerSize(index) : 'Sizes'}`}
                  />
                  <div
                    ref={dropdownRefs.current[index]}
                    className={`sneaker-sizes-dropdown ${openSizes === index ? 'open-sizes-dropdown' : 'close-sizes-dropdown'}`}
                  >
                    {item && getSneakersSizes(item)
                      .sort((a, b) =>
                        parseFloat(a.size) <= parseFloat(b.size) ? -1 : 0
                      ).map((size, sIndex) =>{
                        return (<div
                          className={`sneaker-size-row ${isRowSelected(index, size) ? 'selected' : ''}`}
                          key={`sneaker-size-${sIndex}-${size.product._id.$oid}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            const copySneakers = { ...selectedSneakerSize };
                            if (!Object.keys(copySneakers).includes(index.toString())) {
                              copySneakers[index] = size.product;
                            } else {
                              if (copySneakers[index]) {
                                if (copySneakers[index]._id.$oid === size.product._id.$oid) {
                                  delete copySneakers[index];
                                } else {
                                  copySneakers[index] = size.product;
                                }
                              }
                            }

                            setSelectedSneakerSize(copySneakers);
                          }}
                        >
                          {getSneakersSize(size.product)}
                        </div>)}
                      )}
                  </div>
                </div>
                <div className={` action-button-container`}>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToBag(item, selectedSneakerSize[index]);
                    }}
                    type="button"
                    style={{ height: 32 }}
                    title="Add to Cart"
                  />
                </div>
              </>
              }
            </div> : <div key={`${index}-empty-carousel-item`} />
        ))}
      </Carousel>
  );
};

const shouldUpdate = (oldProp, newProp) => {
  if (typeof newProp.items !== 'undefined') {
    return newProp.items.length === oldProp.items.length
  } else {
    return typeof newProp.items === typeof oldProp.items;
  }
};

MLCarousel.defaultProps = {
  onActiveItemClick: () => {},
  activeItems: 1,
  breakpoint: 1280,
  emptyMessage: '',
  selectOnScroll: false,
  showSneakerSizes: false,
};

MLCarousel.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  onActiveItemClick: PropTypes.func,
  breakpoint: PropTypes.number,
  activeItems: PropTypes.number,
  comparisonProdId: PropTypes.string,
  emptyMessage: PropTypes.string,
  selectOnScroll: PropTypes.bool,
  showSneakerSizes: PropTypes.bool,
};

export default React.memo(MLCarousel);
