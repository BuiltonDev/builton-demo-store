import React, { useState } from 'react';
import { Form, Field } from 'react-final-form'
import builton from '../../utils/builton';
import { useDispatch } from 'reactn';
import { withRouter } from 'react-router-dom';
import notify from '../../utils/toast';

import './auth.scss';
import { setFirebaseToken } from "../../utils/auth";
import firebaseClient from '../../utils/firebase';
import useReactRouter from 'use-react-router';

const Auth = () => {
  const [formType, setFormType] = useState('login');
  const updateUser = useDispatch('updateUser'); //reducer
  const updateBuiltonSession = useDispatch('updateBuiltonSession');

  const { history } = useReactRouter();

  const onSubmit = async values => {
    try {
      if (formType === 'register') {
        await firebaseClient
          .auth()
          .createUserWithEmailAndPassword(values.email, values.password);
      } else {
        await firebaseClient
          .auth()
          .signInWithEmailAndPassword(values.email, values.password);
      }

      const idToken = await setFirebaseToken();
      await updateBuiltonSession(idToken);

      let apiUser;

      if (formType === 'register') {
        apiUser = await builton.users.authenticate({body: {
          email: values.email,
          first_name: '', // TODO remove
          last_name: ''  // TODO remove
        }});
      } else {
        apiUser = await builton.users.setMe().get();
      }

      await updateUser(apiUser);

      if (!apiUser) {
        throw new Error('Missing user data');
      }

      history.push('/');
    } catch (err) {
      notify('Failed to load message', { type: 'error' });
    }
  };

  const Error = ({ name }) => (
    <Field name={name} subscription={{ error: true, touched: true }}>
      {({ meta: { error, touched } }) =>
        error && touched ? <span>{error}</span> : null
      }
    </Field>
  );

  return (
    <div className='wrapper'>
      <Form
        onSubmit={onSubmit}
        validate={values => {
          const errors = {};
          if (!values.email) {
            errors.email = 'Required';
          }
          if (!values.password) {
            errors.password = 'Required';
          }
          if (formType === 'register') {
            if (!values.confirmPassword) {
              errors.confirmPassword = 'Required';
            }

            if (values.confirmPassword !== values.password) {
              errors.confirmPassword = 'Passwords do not match';
            }
          }
          return errors
        }}
      >
        {({ handleSubmit, form, submitting, pristine, values }) => (
          <form onSubmit={handleSubmit}>
            <div>
              <Field
                name="email"
                component="input"
                type="text"
                placeholder="Email"
              />
              <Error name="firstName" />
            </div>
            <div>
              <Field
                name="password"
                component="input"
                type="password"
                placeholder="Password"
              />
              <Error name="password" />
            </div>
            {formType === 'register' &&
              <div>
                <Field
                  name="confirmPassword"
                  component="input"
                  type="password"
                  placeholder="Password"
                />
                <Error name="confirmPassword" />
              </div>
            }
            <div className="buttons">
              <button type="button" onClick={() => setFormType(formType === 'register' ? 'login' : 'register')} disabled={submitting}>
                {formType === 'register' ? 'Login' : 'Register'}
              </button>
              <button type="submit" disabled={submitting}>
                Submit
              </button>
            </div>
          </form>
        )}
      </Form>

    </div>
  )
};

export default withRouter(Auth);
