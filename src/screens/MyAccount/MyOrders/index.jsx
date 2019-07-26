import React, { useState, useEffect } from "react";
import SectionHeader from "../../../components/SectionHeader";
import Table from "../../../components/Table";
import TableHeader from "../../../components/TableHeader";
import TableRow from "../../../components/TableRow";
import { parseAddress } from "../../../utils/address";
import builton from "../../../utils/builton";
import notify from "../../../utils/toast";
import Spinner from "../../../components/Spinner";
import { timestampToDateString } from "../../../utils/dateModifiers";

const MyOrders = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState(undefined);

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = status => {
    if (status === "PENDING") {
      return "undetermined";
    } else if (status === "CANCELLED") {
      return "negative";
    } else {
      return "positive";
    }
  };

  const fetchOrders = async () => {
    try {
      const orders = await builton.users.setMe().getOrders();
      setOrders(orders);
    } catch (err) {
      notify("Failed to fetch orders. Please try again.", {
        type: "error"
      });
    }
    setLoading(false);
  };

  return (
    <>
      <SectionHeader title="My Orders" />
      {loading && (
        <div className="spinner-container">
          <Spinner />
        </div>
      )}
      {!loading && (
        <Table>
          <TableHeader>
            <div className="human-id--row">#id</div>
            <div className="delivery-status--row">Delivery status</div>
            <div className="created--row">Created</div>
            <div className="amount--row">Amount</div>
          </TableHeader>
          {orders &&
            orders.map((order, index) => {
              return (
                <TableRow key={`order-${order.human_id}`} onClick={() => {}}>
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
      )}
    </>
  );
};

export default MyOrders;
