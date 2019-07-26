import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import useReactRouter from "use-react-router";
import { useGlobal, useDispatch } from "reactn";

import "./index.scss";
import Header from "../../components/Header";
import { Field, Form } from "react-final-form";
import Input from "../../components/Input";
import Button from "../../components/Button";
import builton from "../../utils/builton";
import notify from "../../utils/toast";
import SectionHeader from "../../components/SectionHeader";
import TableRow from "../../components/TableRow";
import TableHeader from "../../components/TableHeader";
import {parseAddress} from "../../utils/address";
import Table from "../../components/Table";

const MyAccount = () => {
  const { match, history } = useReactRouter();
  const [activeMenu, setActiveMenu] = useState("my-profile");
  const [orders, setOrders] = useState(undefined);
  const [user] = useGlobal("user");
  const updateUser = useDispatch("updateUser");

  useEffect(() => {
    if (match.params.menuId) {
      if (match.params.menuId === 'my-orders') {
        fetchOrders();
      }
      setActiveMenu(match.params.menuId);
    }
  }, [match.params.menuId]);

  const fetchOrders = async () => {
    try {
      const orders = await builton.users.setMe().getOrders();
      setOrders(orders);
    } catch(err) {
      notify('Failed to fetch orders. Please try again.', {
        type: 'error'
      })
    }
  };

  const Error = ({ name }) => (
    <div className="form-error-container">
      <Field name={name} subscription={{ error: true, touched: true }}>
        {({ meta: { error, touched } }) =>
          error && touched ? <span>{error}</span> : null
        }
      </Field>
    </div>
  );

  const onSubmit = async values => {
    try {
      const updatedUser = await builton.users.setMe().update({
        body: values
      });
      updateUser(updatedUser);
    } catch (err) {
      notify(`Failed to update user. Please try again.`, { type: "error" });
    }
  };

  const validate = values => {
    const errors = {};
    if (!values.email) {
      errors.email = "Required";
    }
    return errors;
  };

  const renderUserProfleForm = () => {
    return (
      <div className="form-content-container">
        <Form
          onSubmit={onSubmit}
          initialValues={{
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email
          }}
          validate={values => validate(values)}
        >
          {({ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit} className="form-container">
              <div className="input">
                <Field
                  name="first_name"
                  type="text"
                  render={({ input }) => (
                    <Input
                      id="input-1"
                      inputProps={input}
                      submitting={submitting}
                      colorScheme={1}
                      placeholder="First Name"
                    />
                  )}
                />
                <Error name="first_name" />
              </div>
              <div className="input">
                <Field
                  name="last_name"
                  type="text"
                  render={({ input, meta }) => (
                    <Input
                      id="input-2"
                      inputProps={input}
                      meta={meta}
                      submitting={submitting}
                      colorScheme={1}
                      placeholder="Last Name"
                    />
                  )}
                />
                <Error name="last_name" />
              </div>
              <div className="input">
                <Field
                  name="email"
                  type="email"
                  render={({ input, meta }) => (
                    <Input
                      id="input-3"
                      inputProps={input}
                      submitting={submitting}
                      meta={meta}
                      colorScheme={1}
                      placeholder="Email"
                    />
                  )}
                />
                <Error name="email" />
              </div>
              <div className="button-container">
                <Button
                  type="submit"
                  className="button round"
                  loading={submitting}
                  title="Save"
                />
              </div>
            </form>
          )}
        </Form>
      </div>
    );
  };

  console.log(orders);

  return (
    <div className="main-container">
      <Header />
      <div className="my-account-wrapper">
        <div className="my-account-menu-container">
          <div className="my-account-menu-wrapper">
            <div
              onClick={() => history.push("/my-account/my-profile")}
              className={`${
                activeMenu === "my-profile" ? "active-menu-item" : ""
              }`}
            >
              My Profile
            </div>
            <div
              onClick={() => history.push("/my-account/my-orders")}
              className={`${
                activeMenu === "my-orders" ? "active-menu-item" : ""
              }`}
            >
              My Orders
            </div>
            <div
              onClick={() => history.push("/my-account/my-payments")}
              className={`${
                activeMenu === "my-payments" ? "active-menu-item" : ""
              }`}
            >
              My Payments
            </div>
          </div>
        </div>
        <div className="my-account-content-container">
          <div
            className={`my-account-content my-profile-content ${
              activeMenu === "my-profile"
                ? "show-my-account"
                : "hide-my-account"
            }`}
          >
            <SectionHeader title="My Profile" />
            {activeMenu === "my-profile" && renderUserProfleForm()}
          </div>
          <div
            className={`my-account-content ${
              activeMenu === "my-orders" ? "show-my-account" : "hide-my-account"
            }`}
          >
            <SectionHeader title="My Orders" />
            <Table>
              <TableHeader>
                <div className="human-id--row">
                  #id
                </div>
                <div className="delivery-status--row">
                  Delivery status
                </div>
                <div className="delivery-address--row">
                  Delivery address
                </div>
                <div className="amount--row">
                  Amount
                </div>
              </TableHeader>
              {(activeMenu === 'my-orders' && orders) && orders.map((order, index) => {
                return (
                  <TableRow key={`order-${order.human_id}`}>
                    <div className="human-id--row">
                      {order.human_id}
                    </div>
                    <div className="delivery-status--row">
                      {order.delivery_status}
                    </div>
                    <div className="delivery-address--row">
                      {parseAddress(order.delivery_address)}
                    </div>
                    <div className="amount--row">
                      {order.total_amount} {order.currency}
                    </div>
                  </TableRow>
                )
              })}
            </Table>
          </div>
          <div
            className={`my-account-content ${
              activeMenu === "my-payments"
                ? "show-my-account"
                : "hide-my-account"
            }`}
          >

          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(MyAccount);
