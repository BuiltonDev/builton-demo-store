import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import useReactRouter from "use-react-router";
import builton from "../../utils/builton";
import notify from "../../utils/toast";
import Header from "../../components/Header";
import BuiltonSplash from "../../components/BuiltonSplash";
import "./index.scss";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import PumaLogo from "../../assets/images/puma-logo.png";
import AdidasLogo from "../../assets/images/adidas-logo.png";
import NikeLogo from "../../assets/images/nike-logo.png";
import Footer from "../../components/Footer";
import ProductListHeader from "../../components/ProductListHeader";
import NoResults from "../../components/NoResults";
import { getProductName } from "../../utils/productModifiers";
import Button from "../../components/Button";

const ProductList = () => {
  const { match, history } = useReactRouter();
  const [products, setProducts] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [rawProducts, setRawProducts] = useState(null);
  const [brandLogo, setBrandLogo] = useState(null);
  const [tagsString, setTagsString] = useState(`${match.params.category}+product`);

  const searchProducts = async searchString => {
    setProducts(null);
    setSearchLoading(true);
    await fetchProducts(searchString);
  };

  // TODO: Fix the dependency issue with linter
  useEffect(() => {
    if (match.params.category) {
      if (match.params.category === "adidas") {
        setBrandLogo(AdidasLogo);
      } else if (match.params.category === "puma") {
        setBrandLogo(PumaLogo);
      } else if (match.params.category === "nike") {
        setBrandLogo(NikeLogo);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match]);

  useEffect(() => {
    setProducts(null);
    fetchProducts();
  }, [tagsString]);

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
          setSearchLoading(false);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  const filterCategory = apiProducts => {
    return apiProducts.map(product => ({
      id: product._id.$oid,
      image: product.image,
      name: product.name,
      price: product.price,
      final_price: product.final_price,
      currency: product.currency,
      short_description: product.short_description,
      description: product.description,
      discount: product.discount,
      loaded: false
    }));
  };

  const fetchProducts = async searchString => {
    try {
      let apiProducts;
      if (searchString) {
        apiProducts = await builton.products.search(searchString, {
          urlParams: {
            expand: "image",
            tags: tagsString
          }
        });
      } else {
        apiProducts = await builton.products.get({
          size: 6,
          urlParams: {
            expand: "image",
            tags: tagsString
          }
        });
      }

      setProducts(filterCategory(apiProducts.current));
      setRawProducts(apiProducts);
    } catch (err) {
      notify("Failed to fetch products", {
        type: "error"
      });
    } finally {
      if (loading) {
        setLoading(false);
      }

      if (searchLoading) {
        setSearchLoading(false);
      }
    }
  };

  const getNextProductsPage = async () => {
    setLoadingMore(true);
    try {
      const nextPage = await rawProducts.next();
      setProducts([...products, ...filterCategory(nextPage)]);
    } catch(err) {
      notify("Failed to fetch products", {
        type: "error"
      });
    } finally {
      setLoadingMore(false);
    }
  };

  const sortProducts = (sort) => {
    let tagsString = `${match.params.category}+product`;
    for (let i = 0; i < sort.length; i += 1) {
      if (typeof sort[i] === "object") {
        tagsString += `+size${sort[i].size}`;
      } else {
        tagsString += `+${sort[i]}`;
      }
    }
    setTagsString(tagsString);
  };

  const shouldShowLoadMore = () => {
    if (products && rawProducts && products.length > 0) {
      return rawProducts.paginationTotal > products.length;
    }
    return false;
  };

  const renderProductItem = (product, index) => {
    return (
      <CSSTransition
        key={`product_image_${product.image.public_url}`}
        timeout={250}
        classNames="item"
      >
        <div
          className={`product-container ${
            loading ? "hide-product" : "show-product"
          }`}
          onClick={() =>
            history.push(`/product_list/${match.params.category}/${product.id}`)
          }
        >
          {product.discount > 0 &&
            <div className="product-discount-container">
              - {product.discount * 100} %
            </div>
          }
          <img
            onLoad={() => {
              products[index].loaded = true;
              setProducts([...products]);
            }}
            alt={`${product.name}-product`}
            src={product.image.public_url}
          />
          <div className="product-description">
            <div className="product-description-inner-container">
              <div>{getProductName(product.name)}</div>
              <div className={product.discount > 0 && "discounted-product"}>{product.short_description}</div>
            </div>
            <div className="product-price-container">
              {product.discount > 0 &&
                <span className="discounted-product">{product.final_price} {product.currency}</span>
              }
              {product.final_price} {product.currency}
            </div>
          </div>
        </div>
      </CSSTransition>
    );
  };

  return (
    <div className="main-container">
      <Header />
      <div className="product-list-wrapper">
        <BuiltonSplash show={loading} />
        <ProductListHeader
          show={!loading}
          onSearchChange={val => searchProducts(val)}
          brandLogo={brandLogo}
          onFilter={(sort) => sortProducts(sort)}
          searchLoading={searchLoading}
        />
        <TransitionGroup className="product-list-grid">
          {products &&
            products.map((product, index) => renderProductItem(product, index))}
        </TransitionGroup>
        <NoResults show={products && products.length === 0} />
      </div>
      <div className={`product-list-load-more-container ${shouldShowLoadMore() ? 'show-load-more' : 'hide-load-more'}`}>
        <Button type="button" onClick={() => getNextProductsPage()} title="Load More" loading={loadingMore} />
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
};

export default withRouter(ProductList);
