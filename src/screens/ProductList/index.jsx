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
import { TransitionGroup, CSSTransition } from "react-transition-group";
import PumaLogo from '../../assets/images/puma-logo.png';
import AdidasLogo from '../../assets/images/adidas-logo.png';
import NikeLogo from '../../assets/images/nike-logo.png';
import Footer from "../../components/Footer";
import ProductListHeader from "../../components/ProductListHeader";
import NoResults from "../../components/NoResults";

const ProductList = () => {
  const { history, match } = useReactRouter();
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [brandLogo, setBrandLogo] = useState(null);

  useEffect( () => {
    if (match.params.category) {
      getProducts();
      if (match.params.category === 'adidas') {
        setBrandLogo(AdidasLogo);
      } else if (match.params.category === 'puma') {
        setBrandLogo(PumaLogo);
      } else if (match.params.category === 'nike') {
        setBrandLogo(NikeLogo);
      }
    }
  }, [match]);

  useEffect(() => {
    if (products) {
      if (products.length > 0) {
        let loaded = true;
        for (let i = 0; i < products.length; i += 1) {
          if (!products[i].loaded) {
            loaded = false;
            break;
          }
        }

        if (loaded) {
          if (loading) {
            setLoading(false);
          }
          if (searchLoading) {
            setSearchLoading(false);
          }
        }
      } else {
        if (loading) {
          setLoading(false);
        }

        if (searchLoading) {
          setSearchLoading(false)
        }
      }
    }
  }, [products]);

  const filterCategory = (apiProducts) => {
    const filteredProducts =  apiProducts.filter((prod) => {
      if (prod.tags.includes(match.params.category) && prod.tags.includes('product')) {
        return prod;
      }
    });

    const mappedProducts = filteredProducts.map((product) => ({
      id: product._id.$oid,
      image_url: product.image_url,
      name: product.name,
      price: product.price,
      currency: product.currency,
      short_description: product.short_description,
      loaded: false,
    }));

    return mappedProducts;
  };

  const getProducts = async () => {
    setProducts(null);
    setLoading(true);
    await fetchProducts();
  };

  const searchProducts = async (searchString) => {
    setProducts(null);
    setSearchLoading(true);
    await fetchProducts(searchString)
  }

  const fetchProducts = async (searchString) => {
    try {
      let apiProducts;
      if (searchString) {
        apiProducts = await builton.products.search({
          query: searchString,
          urlParams: {
            tags: `${match.params.category}+product`
          }
        });
      } else {
        apiProducts = await builton.products.get({
          urlParams: {
            tags: `${match.params.category}+product`
          }
        });
      }

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
      <div className="product-wrapper">
        <BuiltonSplash show={loading} />
        <ProductListHeader
          show={!loading}
          onSearchChange={(val) => searchProducts(val)}
          brandLogo={brandLogo}
          searchLoading={searchLoading}
        />
        <TransitionGroup className="product-list-grid">
          {products && products.map((product, index) => (
            <CSSTransition
              key={`product_image_${product.image_url}`}
              timeout={250}
              classNames="item"
            >
              <div className={`product-container ${loading ? 'hide-product' : 'show-product'}`}>
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
            </CSSTransition>
            ))}
        </TransitionGroup>
        <NoResults show={products && products.length === 0} />
      </div>
      <Footer>
        <div className="footer-inner">
          *Note: The products and the ordering system is fictional. None of the illustrated products exists and can be ordered. Please use only for demo purposes and refer to <a href="https://builton.dev" target="_blank">Builton.dev</a>.
        </div>
      </Footer>
    </div>
  )
};

export default withRouter(ProductList);
