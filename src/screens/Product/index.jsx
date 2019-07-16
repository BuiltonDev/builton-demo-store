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

const Product = () => {
  const { match, history } = useReactRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const apiProduct = await builton.products.get(match.params.productId, {
          urlParams: {
            expand: "_sub_products"
          }
        });
        setProduct(apiProduct);
      } catch (err) {
        notify("Failed to fetch product", {
          type: "error"
        });
      }
    };

    fetchProduct();
  }, []);

  return (
    <div className="main-container">
      <Header />
      <BuiltonSplash show={loading} />
      <div className="product-wrapper">
        <div className="product-image-container">
          {product && (
            <div
              className={`product-image-inner-container ${
                loading ? "hide-product" : "show-product"
              }`}
            >
              <div>
                <img
                  onLoad={() => setLoading(false)}
                  src={`${config.endpoint}images/${product.image_url}?api_key=${config.apiKey}`}
                />
              </div>
            </div>
          )}
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
                <div className="product-description-content">{product.description}</div>
                <div className="product-sizes-container">
                  {getSneakersSizes(product)
                    .sort((a, b) => parseFloat(a.size) <= parseFloat(b.size) ? -1 : 0)
                    .map(prodSize => (
                      <Button
                        key={`prodSize-${prodSize.id}`}
                        onClick={() => setSelectedSize(prodSize.id)}
                        type="button"
                        style={{
                          fontSize: 14,
                          padding: "4px 6px",
                          marginTop: 12,
                          minWidth: 80,
                          height: 24
                        }}
                        title={prodSize.size}
                        className={`button ${selectedSize === prodSize.id ? 'selected' : ''}`}
                      />
                    ))}
                </div>
              </div>
              <div className="add-to-cart-button-container">
                <Button
                  onClick={() => console.log('add to cart')}
                  type="button"
                  style={{ minWidth: 200 }}
                  className="button round"
                  title="Add to Cart"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withRouter(Product);
