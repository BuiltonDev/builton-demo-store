import React, { useState, useEffect } from "react";
import builton from "../../utils/builton";
import Header from "../../components/Header";
import ImageCategory from "../../components/ImageCategory";
import { withRouter } from "react-router-dom";
import notify from "../../utils/toast";
import config from "../../config";
import "./index.scss";
import BuiltonSplash from "../../components/BuiltonSplash";
import useReactRouter from "use-react-router";
import Carousel from "../../components/Carousel";
import SectionHeader from "../../components/SectionHeader";

const Main = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [pageLoaded, setPageLoaded] = useState(false);
  const [popularProducts, setPopularProducts] = useState([]);

  const { history } = useReactRouter();

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

  const getPopularProducts = async (productId, callback) => {
    try {
      const similarProduct = await builton.products.get(productId);
      callback(similarProduct);
    } catch(err) {
      console.warn('Failed to fetch similar product.')
    }
  };

  const getRecommendations = async () => {
    try {
      const recommendations = await builton.aiModels.getRecommendations('5d42948134a12e000f8376d8', {
        body: {
          data: "",
          options: {
            size: 7,
          }
        }
      });

      if (recommendations.result[0].recommendations && recommendations.result[0].recommendations.length > 0) {
        const simProds = [];
        const similarProds = recommendations.result[0].recommendations;

        const setSimilarProd = (prod) => {
          simProds.push(prod);
        };

        for (let i = 0; i < similarProds.length; i += 1) {
          await getPopularProducts(similarProds[i].product, setSimilarProd);
        }

        setPopularProducts(simProds);
      }
    } catch(err) {
      console.warn('Failed to fetch similar products.')
    }
  };

  useEffect(() => {
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
        <BuiltonSplash show={!pageLoaded} />
        <div className="home-wrapper">
          {Object.keys(categories).length > 0 && (
            <>
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
          <SectionHeader title="Most pupular sneakers" type="sub" />
          {popularProducts.length > 0 &&
            <Carousel activeItems={4} items={popularProducts} onActiveItemClick={(category, productId) => history.push(`/product_list/${category}/${productId}`)}/>
          }
        </div>
      </div>
    </div>
  );
};

export default withRouter(Main);
