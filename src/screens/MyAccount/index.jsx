import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import useReactRouter from 'use-react-router';
import { useGlobal, useDispatch } from 'reactn';

import './index.scss';
import Header from "../../components/Header";
import {Field, Form} from "react-final-form";
import Input from "../../components/Input";
import Button from "../../components/Button";
import builton from "../../utils/builton";
import notify from "../../utils/toast";

const MyAccount = () => {
  const { match, history } = useReactRouter();
  const [activeMenu, setActiveMenu] = useState('my-profile');
  const [user] = useGlobal('user');
  const updateUser = useDispatch('updateUser');

  const fetchUser = async () => {
    try {
      const apiUser = await builton.users.setMe().get();
      updateUser(apiUser)
    } catch(err) {
      notify(
        `Failed to fetch user. Please try again.`,
        { type: "error" }
      );
    }
  }

  const onSubmit = async values => {
    try {
      const updatedUser = await builton.users.setMe().update({
        body: values
      });
    } catch (err) {
      notify(
        `Failed to update user. Please try again.`,
        { type: "error" }
      );
    }
  };

  useEffect(() => {
    if (match.params.menuId) {
      setActiveMenu(match.params.menuId);
      fetchUser();
    }
  }, [match.params.menuId]);

  const Error = ({ name }) => (
    <div className="form-error-container">
      <Field name={name} subscription={{ error: true, touched: true }}>
        {({ meta: { error, touched } }) =>
          error && touched ? <span>{error}</span> : null
        }
      </Field>
    </div>
  );

  return (
    <div className="main-container">
      <Header />
      <div className="my-account-wrapper">
        <div className="my-account-menu-container">
          <div className="my-account-menu-wrapper">
            <div onClick={() => history.push('/my-account/my-profile')} className={`${activeMenu === 'my-profile' ? 'active-menu-item' : ''}`}>My Profile</div>
            <div onClick={() => history.push('/my-account/my-orders')} className={`${activeMenu === 'my-orders' ? 'active-menu-item' : ''}`}>My Orders</div>
            <div onClick={() => history.push('/my-account/my-payments')} className={`${activeMenu === 'my-payments' ? 'active-menu-item' : ''}`}>My Payments</div>
          </div>
        </div>
        <div className="my-account-content-container">
          <div className="my-account-content">
            <Form onSubmit={onSubmit} initialValues={{
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email
            }}>
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
                    <Error name="email" />
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
                          placeholder="First Name"
                        />
                      )}
                    />
                    <Error name="email" />
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
                  <div className="buttons">
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
        </div>
      </div>
    </div>
  )
};

export default withRouter(MyAccount);
