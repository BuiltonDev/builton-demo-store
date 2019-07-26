import React from "react";
import {
  getProductName,
  getSneakersSize
} from "../../../utils/productModifiers";
import RemoveShopping from "../../../assets/icons/remove_shopping";
import useReactRouter from "use-react-router";
import { useDispatch, useGlobal } from "reactn";
import SectionHeader from "../../../components/SectionHeader";

const CheckoutBag = () => {
  const [bag] = useGlobal("bag");

  const removeItemFrombag = useDispatch("removeItemFromBag");
  const { history } = useReactRouter();

  const removeItem = (e, itemId) => {
    e.stopPropagation();
    removeItemFrombag(itemId);
  };

  const calculateTotalAmount = () => {
    let total = 0;
    for (let i = 0; i < bag.length; i += 1) {
      total += bag[i].product.price;
    }
    return total;
  };

  const renderBagRow = (item, index) => {
    return (
      <div
        className="checkout-bag-item-row"
        key={`bag-item-${item.product.id}-${index}`}
        onClick={() =>
          history.push(
            `/product_list/${item.category}/${item.product._id.$oid}`
          )
        }
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
        <div className="checkout-remove-col">
          <div
            className="remove-bag-item"
            onClick={e => removeItem(e, item.size._id.$oid)}
          >
            <RemoveShopping color="#c5c5c5" />
          </div>
        </div>
      </div>
    );
  };

  if (!bag) return null;

  return (
    <>
      <SectionHeader title="Your items" />
      <div className="checkout-items-header">
        <div className="checkout-name-col">Brand</div>
        <div className="checkout-description-col">Model</div>
        <div className="checkout-size-col">Size</div>
        <div className="checkout-price-col">Price</div>
        <div className="checkout-remove-col" />
      </div>
      {bag && bag.map((item, index) => renderBagRow(item, index))}
      <div className="checkout-bag-total-row">
        <div className="checkout-bag-total-title">Total</div>
        <div className="checkout-bag-total">
          {calculateTotalAmount()} {bag[0].product.currency}
        </div>
        <div className="checkout-bag-empty" />
      </div>
    </>
  );
};

export default CheckoutBag;
