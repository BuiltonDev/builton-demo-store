import React from "react";
import { useGlobal } from "reactn";
import {
  getProductName,
  getSneakersSize
} from "../../../utils/productModifiers";
import useReactRouter from "use-react-router";
import ListItem from "../../../components/ListItem";
import SectionHeader from "../../../components/SectionHeader";

const CheckoutConfirmation = () => {
  const [order] = useGlobal("order");
  const [bag] = useGlobal("bag");
  const [paymentMethod] = useGlobal("paymentMethod");

  const { history } = useReactRouter();

  const calculateTotalAmount = () => {
    let total = 0;
    for (let i = 0; i < bag.length; i += 1) {
      total += bag[i].product.price;
    }
    return total;
  };

  const renderPaymentMethod = () => {
    return (
      <div className="checkout-overview-sub-container">
        <div className="checkout-sub-header-title">
          Selected payment method
        </div>
        <ListItem onClick={() => history.push('/checkout/payment_method')}>
          <div className="checkout-list-item-left">
            <div className="checkout-payment-card-number">
              **** **** **** {paymentMethod.card.last4}
            </div>
            <div className="checkout-payment-method-card-name">John Doe</div>
          </div>
          <div className="checkout-list-item-right">
            <div className="checkout-payment-card-exp-date">
              {paymentMethod.card.exp_month} / {paymentMethod.card.exp_year}
            </div>
            <div className="checkout-list-item-checkmark">&#10003;</div>
          </div>
        </ListItem>
      </div>
    )
  };

  const renderDeliveryAddress = () => {
    return (
      <div className="checkout-overview-sub-container">
        <div className="checkout-sub-header-title">
          Selected delivery address
        </div>
        <ListItem onClick={() => history.push('/checkout/delivery_address')}>
          <div className="checkout-list-item-left">
            <div>{order.delivery_address.street_name}</div>
            <div className="checkout-address-city">
              <div>{order.delivery_address.zip_code}</div>
              <div>{order.delivery_address.city}</div>
            </div>
          </div>
          <div className="checkout-list-item-right">
            <div>{order.delivery_address.country}</div>
            <div className="checkout-list-item-checkmark">&#10003;</div>
          </div>
        </ListItem>
      </div>
    )
  };

  const renderBag = () => {
    return (
      <div className="checkout-overview-sub-container">
        <div className="checkout-items-header">
          <div className="checkout-name-col">Brand</div>
          <div className="checkout-description-col">Model</div>
          <div className="checkout-size-col">Size</div>
          <div className="checkout-price-col">Price</div>
        </div>
        {bag && bag.map((item, index) => renderBagRow(item, index))}
      </div>
    )
  }

  const renderBagRow = (item, index) => {
    return (
      <div
        className="checkout-bag-item-row"
        key={`bag-item-${item.product.id}-${index}`}
        onClick={() => history.push(`/checkout/bag`)}
      >
        <div className="checkout-name-col">
          {getProductName(item.product.name)}
        </div>
        <div className="checkout-description-col">
          {item.product.short_description}
        </div>
        <div className="checkout-size-col">{getSneakersSize(item.size)}</div>
        <div className="checkout-price-col">
          {item.product.price} {item.product.currency}
        </div>
      </div>
    );
  };

  return (
    <div className="checkout-overview-container">
      <SectionHeader title="Order Overview" />
      {bag && renderBag()}
      {paymentMethod && renderPaymentMethod()}
      {order.delivery_address && renderDeliveryAddress()}
      <div className="checkout-bag-total-row">
        <div className="checkout-bag-total-title">Total</div>
        <div className="checkout-bag-total">
          {calculateTotalAmount()} {bag[0].product.currency}
        </div>
      </div>
    </div>
  );
};

export default CheckoutConfirmation;
