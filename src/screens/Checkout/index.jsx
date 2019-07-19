import React, {useState, useEffect} from 'react';
import { withRouter } from 'react-router-dom';
import { useGlobal, useDispatch } from 'reactn';

import './index.scss';
import useReactRouter from "use-react-router";
import Header from "../../components/Header";
import Button from "../../components/Button";
import CheckoutNavigation from "../../components/CheckoutNavigation";
import {getProductName, getSneakersSize} from "../../utils/productModifiers";
import RemoveShopping from "../../assets/icons/remove_shopping";



const Checkout = () => {
  const [bag] = useGlobal('bag');
  const [step, setStep] = useState(null);
  const removeItemFrombag = useDispatch("removeItemFromBag");
  const { history } = useReactRouter();

  const removeItem = itemId => {
    removeItemFrombag(itemId);
  };

  console.log(bag);

  const calculateTotalAmount = () => {
    let total = 0;
    for (let i = 0; i < bag.length; i += 1) {
      total += bag[i].product.price
    }
    return total;
  };

  const renderStep1 = () => {
    if (!bag || !bag.length) return null;
    return (
      <>
        <div className="checkout-items-container-title">
          Your items
        </div>
        <div className="checkout-items-header">
          <div className="checkout-name-col">Brand</div>
          <div className="checkout-description-col">Model</div>
          <div className="checkout-size-col">Size</div>
          <div className="checkout-price-col">Price</div>
          <div className="checkout-remove-col"/>
        </div>
        {bag && bag.map((item, index) => (
          <div className="checkout-bag-item-row" key={`bag-item-${item.product.id}-${index}`} onClick={() => history.push(`/product_list/${item.category}/${item.product._id.$oid}`)}>
            <div className="checkout-name-col">
              {getProductName(item.product.name)}
            </div>
            <div className="checkout-description-col">
              {item.product.short_description}
            </div>
            <div className="checkout-size-col">
              {getSneakersSize(item.size)}
            </div>
            <div className="checkout-price-col">
              {item.product.price} {item.product.currency}
            </div>
            <div className="checkout-remove-col">
              <div
                className="remove-bag-item"
                onClick={() => removeItem(item.size._id.$oid)}
              >
                <RemoveShopping color="#c5c5c5" />
              </div>
            </div>
          </div>
          ))}
          <div className="checkout-bag-total-row">
            <div className="checkout-bag-total-title">Total</div>
            <div className="checkout-bag-total">{calculateTotalAmount()} {bag[0].product.currency}</div>
            <div className="checkout-bag-empty" />
          </div>
      </>
    )
  };

  return (
    <div className="main-container">
      <Header />
      <div className="wrapper">
        <div className="checkout-container">
          <div className="checkout-inner-container">
            <div className={`checkout-items-container ${step === 0 ? 'show-container' : 'hide-container'}`} >
              {renderStep1()}
            </div>
            <div className={`checkout-items-container ${step === 1 ? 'show-container' : 'hide-container'}`} >
              test2
            </div>
            <div className={`checkout-items-container ${step === 2 ? 'show-container' : 'hide-container'}`} >
              test3
            </div>
            <div className={`checkout-items-container ${step === 3 ? 'show-container' : 'hide-container'}`} >
              test4
            </div>
            <div className={`checkout-items-container ${step === 4 ? 'show-container' : 'hide-container'}`} >
              test5
            </div>

          </div>
          <div className="checkout-nav-container">
            <CheckoutNavigation onStep={(currentStep) => setStep(currentStep)} />
          </div>
        </div>
      </div>
    </div>
  )
};

export default withRouter(Checkout);
