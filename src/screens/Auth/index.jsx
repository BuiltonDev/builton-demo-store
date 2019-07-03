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
import BLogo from "../../assets/icons/b_logo";

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
      notify(`Failed to ${formType === 'login' ? 'Login' : 'Register'}. Please try again.`, { type: 'error' });
    }
  };

  const Error = ({ name }) => (
    <div className='form-error-container'>
      <Field name={name} subscription={{ error: true, touched: true }}>
        {({ meta: { error, touched } }) =>
          error && touched ? <span>{error}</span> : null
        }
      </Field>
    </div>
  );

  return (
    <div className='wrapper'>
      <div className='builton-logo-container'>
        <BLogo height={84} width={84} />
        Demo store
      </div>
      <div className='paper-container'>
      <Form
        onSubmit={onSubmit}
        validate={values => {
          const errors = {};
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
            <div className='input input--hoshi'>
              <Field
                name="email"
                type="email"
                render={({input}) =>
                  <>
                    <input
                      {...input}
                      onChange={(el) => {
                        input.onChange(el.target.value);
                        if(el.target.value) {
                          el.target.parentNode.classList.add('input--filled')
                        } else {
                          el.target.parentNode.classList.remove('input--filled')
                        }
                      }}
                      className="input__field input__field--hoshi"
                      id="input-1"
                    />
                    <label className="input__label input__label--hoshi input__label--hoshi-color-1" htmlFor="input-1">
                      <span className="input__label-content input__label-content--hoshi">Email</span>
                    </label>
                  </>
                }
              />
              <Error name="firstName" />
            </div>
            <div className='input input--hoshi'>
              <Field
                name="password"
                type="password"
                render={({input}) =>
                  <>
                    <input
                      {...input}
                      onChange={(el) => {
                        input.onChange(el.target.value);
                        if(el.target.value) {
                          el.target.parentNode.classList.add('input--filled')
                        } else {
                          el.target.parentNode.classList.remove('input--filled')
                        }
                      }}
                      className="input__field input__field--hoshi"
                      id='input-3'
                    />
                    <label className="input__label input__label--hoshi input__label--hoshi-color-2" htmlFor="input-3">
                      <span className="input__label-content input__label-content--hoshi">Password</span>
                    </label>
                  </>
                }
              />
              <Error name="password" />
            </div>
            {formType === 'register' &&
              <div className='input input--hoshi'>
                <Field
                  name="confirmPassword"
                  type="password"
                  render={({input}) =>
                    <>
                      <input
                        {...input}
                        onChange={(el) => {
                          input.onChange(el.target.value);
                          if(el.target.value) {
                            el.target.parentNode.classList.add('input--filled')
                          } else {
                            el.target.parentNode.classList.remove('input--filled')
                          }
                        }}
                        className="input__field input__field--hoshi"
                        id='input-2'
                      />
                      <label className="input__label input__label--hoshi input__label--hoshi-color-2" htmlFor="input-2">
                        <span className="input__label-content input__label-content--hoshi">Confirm password</span>
                      </label>
                    </>
                  }
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
    </div>
  )
};

export default withRouter(Auth);
