import React, { useState } from 'react';
import { useForm, useField } from 'react-final-form-hooks';
import builton from '../../utils/builton';
import { useDispatch } from 'reactn';
import { withRouter } from 'react-router-dom';

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
      throw err;
    }
  };

  const validate = values => {
    let errors = {};
    if (!values.email) {
      errors.email = 'Required';
    }
    if (formType === 'register' && values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  const { form, handleSubmit, submitting } = useForm({
    onSubmit,
    validate
  });

  const email = useField('email', form);
  const password = useField('password', form);
  const confirmPassword = useField('confirmPassword', form);

  return (
    <div className='wrapper'>
        <form onSubmit={handleSubmit}>
          <div>
            <input {...email.input} placeholder="Email" type="email"/>
          </div>

          <div>
            <input {...password.input} placeholder="Password" type="password"/>
          </div>

          {formType === 'register' &&
            <div>
              <input {...confirmPassword.input} placeholder="Confirm password" type="password"/>
            </div>
          }

          <button onClick={() => setFormType(formType === 'login' ? 'register' : 'login')}>
            {formType === 'login' ? 'Register' : 'Login'}
          </button>
          <button type="submit">
            Submit
          </button>
        </form>
    </div>
  )
};

export default withRouter(Auth);
