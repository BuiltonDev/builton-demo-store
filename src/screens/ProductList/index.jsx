import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import useReactRouter from 'use-react-router';
import builton from "../../utils/builton";
import notify from '../../utils/toast';
import Header from "../../components/Header";
import BuiltonSplash from "../../components/BuiltonSplash";
import './index.scss';
import config from "../../config";

const ProductList = () => {
  const { history, match } = useReactRouter();
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect( () => {
    if (match.params.category) {
      fetchProducts();
    }
  }, [match]);

  useEffect(() => {
    if (products && products.length > 0) {
      let loaded = true;
      for (let i = 0; i < products.length; i += 1) {
        if (!products[i].loaded) {
          loaded = false;
          break;
        }
      }
      // console.log(loaded);
      if (loaded) {
        setLoading(false);
      }
    }
  }, [products])

  const filterCategory = (apiProducts) => {
    const filteredProducts =  apiProducts.filter((prod) => {
      if (prod.tags.includes(match.params.category) && prod.tags.includes('product')) {
        return prod;
      }
    });

    const mappedProducts = filteredProducts.map((product) => ({
      image_url: product.image_url,
      name: product.name,
      price: product.price,
      currency: product.currency,
      short_description: product.short_description,
      loaded: false,
    }));

    return mappedProducts;
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const apiProducts = await builton.products.get({
        urlParams: {
          tags: `${match.params.category}+product`
        }
      });
      setProducts(filterCategory(apiProducts));
    } catch(err) {
      notify('Failed to fetch products', {
        type: 'error'
      })
    }
  };

  const getProductName = (productName) => {
    if (!!~productName.indexOf('-')) {
      const index = productName.indexOf('-');
      return productName.substr(0, index).trim();
    }

    return productName;
  };

  return(
    <div className="main-container">
      <Header />
      <div className="wrapper">
        <BuiltonSplash show={loading} />
        {products &&
          <div className="product-list-grid">
            {products.map((product, index) => (
              <div className={`product-container ${loading ? 'hide-product' : 'show-product'}`} key={`product_image_${product.image_url}`}>
                <img
                  onLoad={() => {
                    products[index].loaded = true;
                    setProducts([
                      ...products
                    ])
                  }}
                  src={`${config.endpoint}images/${product.image_url}?api_key=${config.apiKey}`}
                />
                <div className='product-description'>
                  <div className="product-description-inner-container">
                    <div>{getProductName(product.name)}</div>
                    <div>{product.short_description}</div>
                  </div>
                  <div className='product-price-container'>
                    {product.price} {product.currency}
                  </div>
                </div>
              </div>
              ))}
          </div>
        }
      </div>
    </div>
  )
};

export default withRouter(ProductList);
