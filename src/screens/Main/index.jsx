import React, { useState, useEffect } from 'react';
import builton from '../../utils/builton';
import Header from "../../components/Header";
import './main.scss'

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
      <div className='wrapper' >
        <div className="one">
          <div className="adidas-title" >
            Adidas
          </div>
          <img className="img" src={adidas} alt="" />
        </div>

        <div className='second-wrapper'>
          <div className="two">
            <div className="nike-title" >
              Nike
            </div>
            <img className="img" src={nike} alt="" />
          </div>

          <div className="three">
            <div className="puma-title" >
              Puma
            </div>
            <img className="img" src={puma} alt="" />
          </div>
        </div>
      </div>
    </div>
    )
}

export default Main;
