import React, { useState, useEffect } from "react";
import SectionHeader from "../../../components/SectionHeader";
import Table from "../../../components/Table";
import TableHeader from "../../../components/TableHeader";
import TableRow from "../../../components/TableRow";
import builton from "../../../utils/builton";
import notify from "../../../utils/toast";
import Spinner from "../../../components/Spinner";
import { timestampToDateString } from "../../../utils/dateModifiers";
import useReactRouter from "use-react-router";
import { getStatusColor } from "../../../utils/orderModifiers";
import BLogo from "../../../assets/icons/b_logo";
import Button from "../../../components/Button";

const MyOrders = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState(undefined);
  const [rawOrders, setRawOrders] = useState(undefined);
  const [loadMore, setLoadMore] = useState(false);

  const { history } = useReactRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const orders = await builton.orders.get({ size: 10 });
      setOrders(orders.current);
      setRawOrders(orders);
    } catch (err) {
      notify("Failed to fetch orders. Please try again.", {
        type: "error"
      });
    }
    setLoading(false);
  };

  const loadMoreOrders = async () => {
    setLoadMore(true);
    try {
      const newOrders = await rawOrders.next();
      setOrders([...orders, ...newOrders]);
    } catch(err) {
      notify("Failed to fetch orders. Please try again.", {
        type: "error"
      });
    } finally {
      setLoadMore(false);
    }
  };

  const hasMoreOrders = () => {
    if (rawOrders && orders && orders.length > 0) {
      return rawOrders.paginationTotal > orders.length;
    }
    return false;
  };

  return (
    <>
      {loading && (
        <div className="spinner-container">
          <Spinner />
        </div>
      )}
      {(!loading && orders.length > 0) && (
        <div className="orders-table-container">
          <SectionHeader title="My Orders" />
          <Table>
            <TableHeader>
              <div className="human-id--row">#id</div>
              <div className="delivery-status--row">Delivery status</div>
              <div className="created--row">Created</div>
              <div className="amount--row">Amount</div>
            </TableHeader>
            {orders &&
              orders.map(order => {
                return (
                  <TableRow
                    key={`order-${order.human_id}`}
                    onClick={() =>
                      history.push(`/my-account/my-orders/${order._id.$oid}`)
                    }
                  >
                    <div className="human-id--row">{order.human_id}</div>
                    <div
                      className={`delivery-status--row ${getStatusColor(
                        order.delivery_status
                      )}`}
                    >
                      {order.delivery_status}
                    </div>
                    <div className="created--row">
                      {timestampToDateString(order.created.$date)}
                    </div>
                    <div className="amount--row">
                      {order.total_amount} {order.currency}
                    </div>
                  </TableRow>
                );
              })}
          </Table>
        </div>
      )}
      <div className={`orders-load-more-container ${hasMoreOrders() ? 'show-orders-more' : 'hide-orders-more'}`}>
        <Button loading={loadMore} onClick={() => loadMoreOrders()} title="Load more" type="button" />
      </div>
      {(!loading && orders.length === 0) &&
        <div className="no-orders">
          <BLogo width={160} height={120}/>
          No orders found.
        </div>
      }
    </>
  );
};

export default MyOrders;
