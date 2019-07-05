import React, { useState, useEffect } from "react";
import builton from "../../utils/builton";
import Header from "../../components/Header";
import ImageCategory from "../../components/ImageCategory";
import { withRouter } from "react-router-dom";
import notify from "../../utils/toast";
import config from "../../config";
import "./index.scss";
import BuiltonSplash from "../../components/BuiltonSplash";

const Main = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [pageLoaded, setPageLoaded] = useState(false);

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

  useEffect(() => {
    getProducts();
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
                imageSrc={`${config.endpoint}images/${categories.puma.image}?api_key=${config.apiKey}`}
                category={categories.puma.title}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default withRouter(Main);
