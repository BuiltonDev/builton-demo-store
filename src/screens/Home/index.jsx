import React, { useState, useEffect } from "react";
import builton from "../../utils/builton";
import Header from "../../components/Header";
import ImageCategory from "../../components/ImageCategory";
import { withRouter } from "react-router-dom";
import notify from "../../utils/toast";
import { useGlobal } from "reactn";
import "./index.scss";
import BuiltonSplash from "../../components/BuiltonSplash";
import useReactRouter from "use-react-router";
import SectionHeader from "../../components/SectionHeader";
import Footer from "../../components/Footer";
import globalState from "../../globalStore/globalState";
import {convertRecommendationsToProducts, exportMLItems, generateProductCarouselItems} from "../../utils/carouselItems";
import {getProductName} from "../../utils/productModifiers";
import MLCarousel from "../../components/MLCarousel";

const Main = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [pageLoaded, setPageLoaded] = useState(false);
  const [popularProducts, setPopularProducts] = useState([]);

  const { history } = useReactRouter();
  const [user] = useGlobal("user");

  useEffect(() => {

    const fetchRecommendations = async () => {
      try {
        const recommendations = await builton.aiModels.getRecommendations(
          "5d53b0f91a7e86000fd0d84e",
          {
            data: "",
            options: {
              size: 7
            },
          },
          {
            urlParams: {
              expand: 'result.predictions.output.image,result.predictions.output._sub_products'
            }
          }
        );

        if (
          recommendations.result[0].predictions &&
          recommendations.result[0].predictions.length > 0
        ) {
          const generatedItems = exportMLItems(recommendations.result[0].predictions);
          // console.log(generatedItems);
          setPopularProducts(generatedItems.length > 0 ? generatedItems : undefined);
        } else {
          setPopularProducts(undefined);
        }
      } catch (err) {
        setPopularProducts(undefined);
        console.error("Failed to fetch similar products.");
      }
    };

    const getProducts = async () => {
      try {
        const products = await builton.products.get({
          urlParams: {
            expand: "image",
            tags: "category"
          }
        });
        setProducts(products.current);
      } catch (err) {
        notify("Failed to load products", {
          type: "error"
        });
      }
      return false;
    };

    getProducts();
    fetchRecommendations();
  }, []);


  useEffect(() => {
    if (products) {
      const cat = {};
      for (let i = 0; i < products.length; i += 1) {
        cat[products[i].name.toLowerCase()] = {
          title: products[i].name.toLowerCase(),
          image: products[i].image.public_url,
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
                  imageSrc={categories.adidas.image}
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
                  imageSrc={categories.nike.image}
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
                  imageSrc={categories.puma.image}
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
          <MLCarousel
            items={popularProducts}
            activeItems={4}
            showSneakerSizes
            onActiveItemClick={(item) => history.push(`/product_list/${getProductName(item.name).toLowerCase()}/${item.id}`)}
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
