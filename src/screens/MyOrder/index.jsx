import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import useReactRouter from 'use-react-router';
import builton from '../../utils/builton';
import notify from '../../utils/toast';
import Header from "../../components/Header";
import './index.scss';
import BuiltonSplash from "../../components/BuiltonSplash";
import SectionHeader from "../../components/SectionHeader";
import {getStatusColor} from "../../utils/orderModifiers";
import {timestampToDateString} from "../../utils/dateModifiers";
import {parseAddress} from "../../utils/address";
import ListItem from "../../components/ListItem";
import Table from "../../components/Table";
import TableHeader from "../../components/TableHeader";
import TableRow from "../../components/TableRow";
import {getSneakersSize} from "../../utils/productModifiers";

const MyOrder = () => {
  const [order, setOrder] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const { match } = useReactRouter();

  useEffect(() => {
    if (match.params.orderId) {
      const fetchOrder = async () => {
        try {
          const order = await builton.orders.get(match.params.orderId, {
            urlParams: {
              expand: 'payments,items.product.image,payments.payment_method,items.sub_products'
            }
          });
          setOrder(order);
        } catch(err) {
          notify('Failed to fetch order. Please try again', {
            type: 'error'
          })
        }
        setLoading(false)
      };

      fetchOrder();
    }
  }, [match.params.orderId]);

  return (
    <div className="main-container">
      <Header />
      <div className="my-order-wrapper">
        <BuiltonSplash show={loading} />
        <div className="my-order-container">
        {(!loading && order) &&
          <>
            <SectionHeader title={`Order #${order.human_id}`} />
            <div className="my-order-inner-container">
              <div className="my-order-general">
                <SectionHeader title="General information" type="sub" />
                <div className="my-order-general-row">
                  <div className="my-order-left">
                    Order Created
                  </div>
                  <div className={`my-order-right`}>
                    {timestampToDateString(order.created.$date)}
                  </div>
                </div>
                <div className="my-order-general-row">
                  <div className="my-order-left">
                    Order Status
                  </div>
                  <div className={`my-order-right ${getStatusColor(order.delivery_status)}`}>
                    {order.delivery_status}
                  </div>
                </div>
                <div className="my-order-general-row">
                  <div className="my-order-left">
                    Delivery address
                  </div>
                  <div className={`my-order-right`}>
                    {parseAddress(order.delivery_address)}
                  </div>
                </div>
              </div>
              <div className="my-order-payment-method">
                <SectionHeader title="Payment method" type="sub" />
                {order.payments.map(payment =>
                  (payment.current_state === 'created' || payment.current_state === 'success') && <ListItem key={`order-payment-${payment._id.$oid}`}>
                    <div className="payment-method-left ">
                      <div className="payment-card-number">
                        **** **** **** {order.payments[0].payment_method.card.last4}
                      </div>
                      <div className="payment-method-card-name">John Doe</div>
                    </div>
                    <div className="payment-method-right">
                      <div className="payment-card-exp-date">
                        {order.payments[0].payment_method.card.exp_month} / {order.payments[0].payment_method.card.exp_year}
                      </div>
                      <div className="payment-method-checkmark">&#10003;</div>
                    </div>
                  </ListItem>
                )}
              </div>
              <div className="my-order-products">
                <SectionHeader title="Products" type="sub" />
                <Table>
                  <TableHeader>
                    <div className="my-order-product-img">
                      #
                    </div>
                    <div className="my-order-product-name">
                      Name
                    </div>
                    <div className="my-order-product-name">
                      Size
                    </div>
                    <div className="my-order-product-price">
                      Price
                    </div>
                  </TableHeader>
                  {order.items.map((item, iIndex) =>
                    item.sub_products.map((product, index) =>
                      <TableRow key={`product-item-${product._id.$oid}-${index}`}>
                        <div className="my-order-product-img row">
                          <img
                            src={item.product.image.public_url}
                            alt={`${item.name}-img`}
                          />
                        </div>
                        <div className="my-order-product-name">
                          {item.product.name}
                        </div>
                        <div className="my-order-product-name">
                          Size {getSneakersSize(product)}
                        </div>
                        <div className="my-order-product-price row">
                          {item.product.final_price} {item.product.currency}
                        </div>
                      </TableRow>
                  ))}
                  <TableRow className="product-total-row">
                    <div className="product-total-title">Total</div>
                    <div className="product-total">
                      {order.total_amount} {order.currency}
                    </div>
                  </TableRow>
                </Table>
              </div>
            </div>
          </>
        }
        </div>
      </div>
    </div>
  )
};

export default withRouter(MyOrder)
