import React, { useState, useEffect, useRef } from 'react';
import builton from '../../utils/builton';
import Header from "../../components/Header";
import './main.scss'
import ReactCursorPosition from 'react-cursor-position';

import adidas from '../../assets/images/Adidas_Cover.jpg';
import nike from '../../assets/images/Nike_Cover.jpg';
import puma from '../../assets/images/Puma_Cover.jpg';

const Main = () => {
  const [products, setProducts] = useState([]);

  const adidasRef = useRef(null);
  const nikeRef = useRef(null);
  const pumaRef = useRef(null);

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

  let positionX = 0;
  let positionY = 0;

  const handleImagePosition = (el, type) => {
    const ref = type === 'adidas' ? adidasRef : type === 'puma' ? pumaRef : nikeRef;
    if (el.elementDimensions) {
      const midWidth = el.elementDimensions.width / 2;
      const midHeight = el.elementDimensions.height / 2;
      positionX = ((midWidth - el.position.x) * -1) / 60;
      positionY = ((midHeight - el.position.y) * -1) / 60;
      ref.current.style.transform = `translate(${positionX}px, ${positionY}px) scale(1.02)`;
      ref.current.style.transition = 'all 150ms';
    } else {
      ref.current.style.transform = `translate(0px, 0px) scale(1)`;
      ref.current.style.transition = 'all 250ms';
    }

    if (ref.current) {

    }
  };


  return (
    <div className='main-container'>
      <Header/>
      <div className='wrapper' >
        <ReactCursorPosition onPositionChanged={(elementDimension) => handleImagePosition(elementDimension,'adidas')}>
          <div className="one">
            <div className="adidas-title" >
              Adidas
            </div>
            <img ref={adidasRef} className="img" src={adidas} alt="" />
          </div>
        </ReactCursorPosition>

        <div className='second-wrapper'>
          <ReactCursorPosition onPositionChanged={(elementDimension) => handleImagePosition(elementDimension,'nike')}>
            <div className="two">
              <div className="nike-title" >
                Nike
              </div>
              <img ref={nikeRef} className="img" src={nike} alt="" />
            </div>
          </ReactCursorPosition>

          <ReactCursorPosition onPositionChanged={(elementDimension) => handleImagePosition(elementDimension,'puma')}>
            <div className="three">
              <div className="puma-title" >
                Puma
              </div>
              <img ref={pumaRef} className="img" src={puma} alt="" />
            </div>
          </ReactCursorPosition>
        </div>
      </div>
    </div>
    )
}

export default Main;
