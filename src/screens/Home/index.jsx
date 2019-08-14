import React, { useState, useEffect } from "react";
import builton from "../../utils/builton";
import Header from "../../components/Header";
import ImageCategory from "../../components/ImageCategory";
import { withRouter } from "react-router-dom";
import notify from "../../utils/toast";
import config from "../../config";
import { useGlobal } from "reactn";
import "./index.scss";
import BuiltonSplash from "../../components/BuiltonSplash";
import useReactRouter from "use-react-router";
import Carousel from "../../components/Carousel";
import SectionHeader from "../../components/SectionHeader";
import Footer from "../../components/Footer";
import globalState from "../../globalStore/globalState";

const Main = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [pageLoaded, setPageLoaded] = useState(false);
  const [popularProducts, setPopularProducts] = useState([]);

  const { history } = useReactRouter();
  const [user] = useGlobal("user");

  const getPopularProducts = async (productId, callback) => {
    try {
      const similarProduct = await builton.products.get(productId);
      callback(similarProduct);
    } catch (err) {
      console.warn("Failed to fetch similar product.");
    }
  };

  useEffect(() => {
    const getRecommendations = async () => {
      try {
        const recommendations = await builton.aiModels.getRecommendations(
          user ? '5d52c70e0c8f4c000c47a140' : "5d53b0f91a7e86000fd0d84e",
          {
            body: {
              data: user ? user._id.$oid : "",
              options: {
                size: 7
              }
            }
          }
        );

        if (
          recommendations.result[0].recommendations &&
          recommendations.result[0].recommendations.length > 0
        ) {
          const simProds = [];
          const similarProds = recommendations.result[0].recommendations;

          const setSimilarProd = prod => {
            simProds.push(prod);
          };

          for (let i = 0; i < similarProds.length; i += 1) {
            await getPopularProducts(similarProds[i].product, setSimilarProd);
          }

          setPopularProducts(simProds);
        }
      } catch (err) {
        console.warn("Failed to fetch similar products.");
      }
    };

    const getProducts = async () => {
      try {
        const products = await builton.products.get({
          urlParams: {
            tags: "category"
          }
        });
        setProducts(products);
      } catch (err) {
        notify("Failed to load products", {
          type: "error"
        });
      }
      return false;
    };

    getProducts();
    getRecommendations();
  }, []);

  useEffect(() => {
    if (products) {
      const cat = {};
      for (let i = 0; i < products.length; i += 1) {
        cat[products[i].name.toLowerCase()] = {
          title: products[i].name.toLowerCase(),
          image: products[i].image_url,
          loaded: false
        };
      }
      setCategories(cat);
    }
  }, [products]);

  useEffect(() => {
    if (Object.keys(categories).length > 0) {
      let catLoaded = true;
      const catValues = Object.values(categories);
      for (let i = 0; i < catValues.length; i += 1) {
        if (!catValues[i].loaded) {
          catLoaded = false;
          break;
        }
      }
      if (catLoaded) {
        setPageLoaded(true);
      }
    }
  }, [categories]);

  return (
    <div className="main-container">
      <Header />
      <div className="wrapper">
        <div className="home-wrapper">
          <BuiltonSplash show={!pageLoaded} />
          <div className="background-left-fragment" />
          {Object.keys(categories).length > 0 && (
            <>
              <div className="left-category-wrapper">
                <ImageCategory
                  pageLoaded={pageLoaded}
                  onLoad={() =>
                    setCategories({
                      ...categories,
                      adidas: { ...categories.adidas, loaded: true }
                    })
                  }
                  onClick={() =>
                    history.push(`product_list/${categories.adidas.title}`)
                  }
                  imageSrc={`${config.endpoint}images/${categories.adidas.image}?api_key=${config.apiKey}`}
                  category={categories.adidas.title}
                />
              </div>
              <div className="inner-wrapper">
                <ImageCategory
                  pageLoaded={pageLoaded}
                  onLoad={() =>
                    setCategories({
                      ...categories,
                      nike: { ...categories.nike, loaded: true }
                    })
                  }
                  onClick={() =>
                    history.push(`product_list/${categories.nike.title}`)
                  }
                  imageSrc={`${config.endpoint}images/${categories.nike.image}?api_key=${config.apiKey}`}
                  category={categories.nike.title}
                />
                <ImageCategory
                  pageLoaded={pageLoaded}
                  onLoad={() =>
                    setCategories({
                      ...categories,
                      puma: { ...categories.puma, loaded: true }
                    })
                  }
                  onClick={() =>
                    history.push(`product_list/${categories.puma.title}`)
                  }
                  imageSrc={`${config.endpoint}images/${categories.puma.image}?api_key=${config.apiKey}`}
                  category={categories.puma.title}
                />
              </div>
            </>
          )}
        </div>
        <div className="home-popular-products-container">
          <div className="home-popular-products-title-container">
            <SectionHeader title="Most popular products" type="sub" />
          </div>
          <Carousel
            activeItems={4}
            items={popularProducts}
            onActiveItemClick={(category, productId) =>
              history.push(`/product_list/${category}/${productId}`)
            }
          />
        </div>
        <div className="home-footer-container">
          <Footer>
            <div className="home-footer-content">
              <div className="home-footer-col">
                <div className="home-footer-col-title">Quick links</div>
                <div className="home-footer-col-content">
                  <div>
                    <a
                      href="https://builton.dev"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span>Website</span>
                    </a>
                  </div>
                  <div>
                    <a
                      href="https://docs.builton.dev"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span>Docs</span>
                    </a>
                  </div>
                  <div>
                    <a
                      href="https://dashboard.builton.dev/"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span>Dashboard</span>
                    </a>
                  </div>
                  <div>
                    <a
                      href="https://github.com/BuiltonDev/builton-demo-store"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span>Github</span>
                    </a>
                  </div>
                </div>
              </div>
              <div className="home-footer-col">
                <div className="home-footer-col-title">Menu</div>
                <div className="home-footer-col-content">
                  <button
                    onClick={e => {
                      if (!user) {
                        history.push("/auth");
                      } else {
                        globalState.logout();
                      }
                    }}
                  >
                    <span>
                      <div>{user ? "Sign out" : "Sign up/in"}</div>
                    </span>
                  </button>
                </div>
              </div>
              <div className="home-footer-col">
                <div className="home-footer-col-title">About</div>
                <div className="home-footer-col-content">
                  <div>
                    This is a DEMO to showcase Builton.dev API functionality.
                    The products, prices, payment method, checkout process and
                    its affiliates are fictional. No charges and deliveries will
                    be made. For more information please check{" "}
                    <a
                      href="https://builton.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Builton.dev
                    </a>{" "}
                    website.
                  </div>
                </div>
              </div>
            </div>
          </Footer>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Main);
