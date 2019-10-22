import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import useReactRouter from "use-react-router";
import builton from "../../utils/builton";
import notify from "../../utils/toast";

import "./index.scss";
import Header from "../../components/Header";
import MLCarousel from '../../components/MLCarousel';
import { getProductName, getSneakersSizes } from "../../utils/productModifiers";
import BuiltonSplash from "../../components/BuiltonSplash";
import Button from "../../components/Button";
import { useDispatch } from "reactn";
import SectionHeader from "../../components/SectionHeader";
import {convertRecommendationsToProducts, generateProductCarouselItems, getMediaItems} from "../../utils/carouselItems";
import Footer from "../../components/Footer";
import ImagesCarousel from "../../components/ImagesCarousel";

const Product = React.memo(() => {
  const { history, match } = useReactRouter();
  const [product, setProduct] = useState(null);
  const [productImage, setProductImage] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const addItemToCart = useDispatch("addItemToCart"); //reducer

  useEffect(() => {
    setSimilarProducts([]);
    const fetchProduct = async () => {
      try {
        const apiProduct = await builton.products.get(match.params.productId, {
          urlParams: {
            expand: "_sub_products, image"
          }
        });
        setProduct(apiProduct);
      } catch (err) {
        setLoading(false);
        notify("Failed to fetch product", {
          type: "error"
        });
      }
    };


    if (!loading) {
      setLoading(true);
    }
    fetchProduct();
    fetchRecommendations();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.params.productId]);

  const fetchRecommendations = async () => {
    try {
      const recommendations = await builton.aiModels.getRecommendations('5d7b67d8de7cb5000a1006aa',
      {
          data: match.params.productId,
          options: {
            size: 7,
          },
        },
        {
          urlParams: {
            expand: 'result.similar.reference_label._sub_products,result.similar.reference_label.image'
          }
        }
      );

      if (recommendations.result[0].similar && recommendations.result[0].similar.length > 0) {
        const generatedItems = generateProductCarouselItems(convertRecommendationsToProducts(recommendations.result[0].similar, 'reference_label'));
        setSimilarProducts(generatedItems.length > 0 ? generatedItems : undefined);
      } else {
        setSimilarProducts(undefined);
      }
    } catch(err) {
      setSimilarProducts(undefined);
      console.error('Failed to fetch similar products.')
    }
  };

  const addToBag = async () => {
    if (!selectedSize) {
      notify("Please select your desired size.", {
        type: "warning"
      });
    } else {
      try {
        addItemToCart({
          product,
          size: selectedSize,
          category: match.params.category
        });
        notify(`${product.name} successfully added to your bag.`, {
          type: "info"
        });
      } catch (err) {
        console.log(err);
        notify(`Failed to add ${product.name} to your bag.`, {
          type: "error"
        });
      }
    }
  };

  return (
    <div className="main-container">
      <Header />
      <div className="product-wrapper">
        <BuiltonSplash show={loading} />
        <div className="product-item-inner-wrapper">
          <div className="product-image-container">
            {product && (
              <>
                <div
                  className={`product-image-inner-container ${
                    loading ? "hide-product" : "show-product"
                  }`}
                >
                  <div>
                    <img
                      onLoad={() => setLoading(false)}
                      onError={() => setLoading(false)}
                      src={productImage || product.image.public_url}
                      alt={`${product.name}-img`}
                    />
                  </div>
                </div>
              </>
            )}
            <div className={`media-images-container ${loading ? "hide-image" : "show-image"}`}>
              {(product && !loading) &&
                <ImagesCarousel
                  items={getMediaItems(product.media)}
                  selectOnScroll
                  onActiveItemClick={(item) => setProductImage(item.image_url)}
                />
              }
            </div>
          </div>
          <div className="product-description-container">
            {product && (
              <div
                className={`product-description  ${
                  loading ? "hide-product" : "show-product"
                }`}
              >
                <div className="product-description-top">
                  <div className="product-title-container">
                    <span className="product-title">
                      {getProductName(product.name)}
                    </span>
                    <span className="product-subtitle">
                      {product.short_description}
                    </span>
                    {product.discount > 0 &&
                      <span className="product-discounted-price">
                        {product.price} {product.currency}
                      </span>
                    }
                    <span className="product-price">
                      {product.discount > 0 &&
                        <span className="product-new-price-title">new price</span>
                      }
                      {product.final_price} {product.currency}
                    </span>
                  </div>
                  <div className="product-description-content">
                    {product.description}
                  </div>
                  <div className="product-id">
                    Article id: <span>{product.human_id}</span>
                  </div>
                  <div className="product-sizes-container">
                    {getSneakersSizes(product)
                      .sort((a, b) =>
                        parseFloat(a.size) <= parseFloat(b.size) ? -1 : 0
                      )
                      .map(prodSize => (
                        <Button
                          key={`prodSize-${prodSize.id}`}
                          onClick={() =>
                            setSelectedSize(
                              selectedSize &&
                                selectedSize._id.$oid === prodSize.id
                                ? null
                                : prodSize.product
                            )
                          }
                          type="button"
                          style={{
                            fontSize: 14,
                            padding: "4px 6px",
                            marginTop: 12,
                            minWidth: 80,
                            height: 24
                          }}
                          title={prodSize.size}
                          className={`button ${
                            selectedSize && selectedSize._id.$oid === prodSize.id
                              ? "selected"
                              : ""
                          }`}
                        />
                      ))}
                  </div>
                </div>
                <div className="add-to-cart-button-container">
                  <Button
                    onClick={() => addToBag()}
                    type="button"
                    style={{ minWidth: 200 }}
                    className="button round"
                    title="Add to Bag"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="similar-products-wrapper">
          <div className="similar-products-carousel-container">
            <div className={`similar-products-title-container`}>
              <SectionHeader title="You might also like" type="sub" style={{ flex: 1, marginBottom: 0 }} />
            </div>
            {product &&
              <MLCarousel
                items={similarProducts}
                activeItems={4}
                showSneakerSizes
                onActiveItemClick={(item) => history.push(`/product_list/${getProductName(item.name).toLowerCase()}/${item.id}`)}
              />
            }
          </div>
        </div>
      </div>
      <Footer>
        <div className="footer-inner">
          *Note: The products and the ordering system is fictional. None of the
          illustrated products exists and can be ordered. Please use only for
          demo purposes and refer to{" "}
          <a
            href="https://builton.dev"
            rel="noopener noreferrer"
            target="_blank"
          >
            Builton.dev
          </a>
          .
        </div>
      </Footer>
    </div>
  );
});

export default withRouter(React.memo(Product));
