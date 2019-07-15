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

const clearBuiltonSession = clearFieldCurry('builtonSession');
const getBuiltonSession = getFieldCurry('builtonSession');
const setBuiltonSession = setFieldCurry('builtonSession');


addReducer('updateUser', (global, dispatch, user) => {
  setUser(user);
  return {
    user
  };
});

addReducer('updateBuiltonSession', (global, dispatch, builtonSession) => {
  setBuiltonSession(builtonSession);
  return {
    builtonSession
  };
});


export default {
  init: () => {
    if (INITIALIZED) {
      console.log('Authentication already initialized');
      return;
    }

    let data = {
      user: null,
      builtonSession: null,
    };

    try {
      data = {
        user: getUser(),
        builtonSession: getBuiltonSession()
      };
    } catch (err) {
      clearUser();
      clearBuiltonSession();
    }

    // Setting values in global store
    setGlobal(data);

    INITIALIZED = true;
  },
  updateSession: (session) => {
    setBuiltonSession(session)
  },
  clear: () => {
    clearAllFields();
    resetGlobal();
  },
  logout: time => {
    clearUser();
    clearBuiltonSession();
    resetGlobal();

    INITIALIZED = false;
  }
};
