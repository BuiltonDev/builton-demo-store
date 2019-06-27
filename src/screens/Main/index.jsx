import React, { useState, useEffect } from 'react';
import builton from '../../utils/builton';
import Header from "../../components/Header";
import './main.scss'

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
      <div style={{ flex: 1, display: 'flex'}}>
      </div>
    </div>
    )
}

export default Main;
