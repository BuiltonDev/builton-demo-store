import React, { useState, useEffect } from 'react';
import builton from '../../utils/builton';
import Header from "../../components/Header";
import ImageCategory from "../../components/ImageCategory";
import { withRouter } from 'react-router-dom';
import './home.scss'

// TODO: switch to API call when implemented on backend
import adidas from '../../assets/images/Adidas_Cover.jpg';
import nike from '../../assets/images/Nike_Cover.jpg';
import puma from '../../assets/images/Puma_Cover.jpg';

const Main = () => {
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      const products = await builton.products.get();
      setProducts(products);
    } catch(err) {
      console.log(err);
    }
    return false;
  };

  useEffect(() => {
    getProducts();
  }, []);


  return (
    <div className='main-container'>
      <Header/>
      <div className='wrapper'>
        <ImageCategory imageSrc={adidas} category="adidas" />
        <div className='inner-wrapper'>
          <ImageCategory imageSrc={nike} category="nike" />
          <ImageCategory imageSrc={puma} category="puma" />
        </div>
      </div>
    </div>
    )
};

export default withRouter(Main);
