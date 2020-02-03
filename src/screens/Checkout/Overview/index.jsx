import React from "react";
import { useGlobal } from "reactn";
import {
  getProductName,
  getSneakersSize
} from "../../../utils/productModifiers";
import useReactRouter from "use-react-router";
import ListItem from "../../../components/ListItem";
import SectionHeader from "../../../components/SectionHeader";
import {calculateTotalAmount} from "../../../utils/cart";

const CheckoutConfirmation = () => {
  const [order] = useGlobal("order");
  const [cart] = useGlobal("cart");
  const [paymentMethod] = useGlobal("paymentMethod");

  const { history } = useReactRouter();

  const renderPaymentMethod = () => {
    return (
      <div className="checkout-overview-sub-container">
        <SectionHeader title="Selected payment method" type="sub" />
        <ListItem onClick={() => history.push("/checkout/payment_method")}>
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
    );
  };

  const renderDeliveryAddress = () => {
    return (
      <div className="checkout-overview-sub-container">
        <SectionHeader title="Selected delivery address" type="sub" />
        <ListItem onClick={() => history.push("/checkout/delivery_address")}>
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
    );
  };

  const renderCart = () => {
    return (
      <div className="checkout-overview-sub-container">
        <div className="checkout-items-header">
          <div className="checkout-name-col">Brand</div>
          <div className="checkout-description-col">Model</div>
          <div className="checkout-size-col">Size</div>
          <div className="checkout-price-col">Price</div>
        </div>
        {cart && cart.map((item, index) => renderCartRow(item, index))}
      </div>
    );
  };

  const renderCartRow = (item, index) => {
    return (
      <div
        className="checkout-cart-item-row"
        key={`cart-item-${item.product.id}-${index}`}
        onClick={() => history.push(`/checkout/cart`)}
      >
        <div className="checkout-name-col">
          {getProductName(item.product.name)}
        </div>
        <div className="checkout-description-col">
          {item.product.short_description}
        </div>
        <div className="checkout-size-col">{getSneakersSize(item.size)}</div>
        <div className="checkout-price-col">
          {item.product.final_price} {item.product.currency}
        </div>
      </div>
    );
  };

  return (
    <div className="checkout-overview-container">
      <SectionHeader title="Order Overview" />
      {cart && renderCart()}
      {paymentMethod && renderPaymentMethod()}
      {order.delivery_address && renderDeliveryAddress()}
      <div className="checkout-cart-total-row">
        <div className="checkout-cart-total-title">Total</div>
        <div className="checkout-cart-total">
          {calculateTotalAmount(cart)} {cart[0].product.currency}
        </div>
      </div>
    </div>
  );
};

export default CheckoutConfirmation;
