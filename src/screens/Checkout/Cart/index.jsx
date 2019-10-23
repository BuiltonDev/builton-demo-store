import React from "react";
import {
  getProductName,
  getSneakersSize
} from "../../../utils/productModifiers";
import RemoveShopping from "../../../assets/icons/remove_shopping";
import useReactRouter from "use-react-router";
import { useDispatch, useGlobal } from "reactn";
import SectionHeader from "../../../components/SectionHeader";
import TableRow from "../../../components/TableRow";
import TableHeader from "../../../components/TableHeader";
import Table from "../../../components/Table";

const CheckoutBag = () => {
  const [cart] = useGlobal("cart");

  const removeItemFromCart = useDispatch("removeItemFromCart");
  const { history } = useReactRouter();

  const removeItem = (e, item) => {
    e.stopPropagation();
    removeItemFromCart(item);
  };

  const calculateTotalAmount = () => {
    let total = 0;
    for (let i = 0; i < cart.length; i += 1) {
      total += cart[i].product.final_price;
    }
    return total;
  };

  const renderBagRow = (item, index) => {
    return (
      <TableRow
        key={`bag-item-${item.product.id}-${index}`}
        style={{ padding: "6px 12px" }}
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
          {item.product.final_price} {item.product.currency}
        </div>
        <div className="checkout-remove-col">
          <div
            className="remove-bag-item"
            onClick={e => removeItem(e, item)}
          >
            <RemoveShopping color="#c5c5c5" />
          </div>
        </div>
      </TableRow>
    );
  };

  if (!cart) return null;

  return (
    <>
      <SectionHeader title="Your items" />
      <Table>
        <TableHeader className="checkout-items-header">
          <div className="checkout-name-col">Brand</div>
          <div className="checkout-description-col">Model</div>
          <div className="checkout-size-col">Size</div>
          <div className="checkout-price-col">Price</div>
          <div className="checkout-remove-col" />
        </TableHeader>
        {cart && cart.map((item, index) => renderBagRow(item, index))}
        <TableRow className="checkout-bag-total-row">
          <div className="checkout-bag-total-title">Total</div>
          <div className="checkout-bag-total">
            {calculateTotalAmount()} {cart[0].product.currency}
          </div>
          <div className="checkout-bag-empty" />
        </TableRow>
      </Table>
    </>
  );
};

export default CheckoutBag;