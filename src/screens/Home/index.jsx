import React, { useState, useEffect } from 'react';
import builton from '../../utils/builton';
import Header from "../../components/Header";
import ImageCategory from "../../components/ImageCategory";
import { withRouter } from 'react-router-dom';
import notify from "../../utils/toast";
import config from '../../config';
import './index.scss'

// TODO: switch to API call when implemented on backend
import adidas from '../../assets/images/Adidas_Cover.jpg';
import nike from '../../assets/images/Nike_Cover.jpg';
import puma from '../../assets/images/Puma_Cover.jpg';

const Main = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});

  const getProducts = async () => {
    try {
      const products = await builton.products.get({
        urlParams: {
          tags: 'category'
        }
      });
      setProducts(products);
    } catch(err) {
      notify('Failed to load products', {
        type: 'error'
      })
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
        };
      }
      setCategories(cat);
    }
  }, [products]);

  return (
    <div className='main-container'>
      <Header/>
      <div className='wrapper'>
        {Object.keys(categories).length > 0 &&
        <>
          <ImageCategory imageSrc={`${config.endpoint}images/${categories.adidas.image}?api_key=${config.apiKey}`} category={categories.adidas.title} />
          <div className='inner-wrapper'>
            <ImageCategory imageSrc={`${config.endpoint}images/${categories.nike.image}?api_key=${config.apiKey}`} category={categories.nike.title} />
            <ImageCategory imageSrc={`${config.endpoint}images/${categories.puma.image}?api_key=${config.apiKey}`} category={categories.puma.title} />
          </div>
        </>
        }
      </div>
    </div>
    )
};

export default withRouter(Main);
