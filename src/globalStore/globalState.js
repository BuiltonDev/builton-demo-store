// TODO: For the future authentication

import { setGlobal, resetGlobal, addReducer } from 'reactn';
import {
  clearFieldCurry,
  getFieldCurry,
  setFieldCurry,
  clearAllFields
} from './localStorage';

let INITIALIZED = false;

const clearUser = clearFieldCurry('user');
const getUser = getFieldCurry('user');
const setUser = setFieldCurry('user');


addReducer('updateUser', (global, user) => {
  setUser(user);
  return {
    user
  };
});

export default {
  init: () => {
    if (INITIALIZED) {
      console.log('Authentication already initialized');
      return;
    }

    let data = {
      user: null
    };

    // Check to see if userid and companyid cookie is set. if not, cleanup.
    if (
      document.cookie.indexOf('builton-userid') < 0
    ) {
      clearUser();
    }

    try {
      data = {
        user: getUser()
      };
    } catch (err) {
      clearUser();
    }

    // Setting values in global store
    setGlobal(data);

    INITIALIZED = true;
  },
  clear: () => {
    clearAllFields();
    resetGlobal();
  },
  logout: time => {
    clearUser();
    resetGlobal();

    INITIALIZED = false;
    setTimeout(
      () => {
        window.location.href = '/auth/signout';
      },
      time ? time : 0
    );
  }
};
