import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import useReactRouter from "use-react-router";
import builton from "../../utils/builton";
import notify from "../../utils/toast";

import "./index.scss";
import Header from "../../components/Header";
import config from "../../config";
import { getProductName, getSneakersSizes } from "../../utils/productModifiers";
import BuiltonSplash from "../../components/BuiltonSplash";
import Button from "../../components/Button";
import { useDispatch } from "reactn";
import Carousel from "../../components/Carousel";
import SectionHeader from "../../components/SectionHeader";

const Product = React.memo(() => {
  const { history, match } = useReactRouter();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const addItemToBag = useDispatch("addItemToBag"); //reducer

  useEffect(() => {
    setSimilarProducts([]);
    const fetchProduct = async () => {
      try {
        const apiProduct = await builton.products.get(match.params.productId, {
          urlParams: {
            expand: "_sub_products"
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
    getRecommendations();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.params.productId]);

  const getSimilarProducts = async (productId, callback) => {
    try {
      const similarProduct = await builton.products.get(productId);
      callback(similarProduct);
    } catch(err) {
      console.warn('Failed to fetch similar product.')
    }
  };

  const getRecommendations = async () => {
    try {
      const recommendations = await builton.aiModels.getRecommendations('5d42a02534a12e000c2e4140', {
        body: {
          data: match.params.productId,
          options: {
            size: 7,
          }
        }
      });

      if (recommendations.result[0].similar && recommendations.result[0].similar.length > 0) {
        const simProds = [];
        const similarProds = recommendations.result[0].similar;

        const setSimilarProd = (prod) => {
          simProds.push(prod);
        };

        for (let i = 0; i < similarProds.length; i += 1) {
          await getSimilarProducts(similarProds[i].reference_label, setSimilarProd);
        }

        setSimilarProducts(simProds);
      }
    } catch(err) {
      console.warn('Failed to fetch similar products.')
    }
  };

  const addToBag = async () => {
    if (!selectedSize) {
      notify("Please select your desired size.", {
        type: "warning"
      });
    } else {
      try {
        await addItemToBag({
          product,
          size: selectedSize,
          category: match.params.category
        });
        notify(`${product.name} successfully added to your bag.`, {
          type: "info"
        });
      } catch (err) {
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
                    src={`${config.endpoint}images/${product.image_url}?api_key=${config.apiKey}`}
                    alt={`${product.name}-img`}
                  />
                </div>
              </div>
            </>
          )}
          <div className={`similar-products-container ${loading ? "hide-product" : "show-product"}`}>
            <div className={`similar-products-title-container`}>
              <SectionHeader title="You might also like" type="sub" style={{ flex: 1, marginBottom: 0 }} />
            </div>
            <Carousel
              items={similarProducts}
              onActiveItemClick={(category, productId) => history.push(`/product_list/${category}/${productId}`)}
            />
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
    </div>
  );
});

export default withRouter(React.memo(Product));
