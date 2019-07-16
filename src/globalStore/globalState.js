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

const clearBag = clearFieldCurry('bag');
const getBag = getFieldCurry('bag');
const setBag = setFieldCurry('bag');

addReducer('updateUser', (global, dispatch, user) => {
  setUser(user);
  return {
    user
  };
});

addReducer('addItemToBag', (global, dispatch, item) => {
  setBag([...(getBag() || []), item]);
  return {
    bag: [...(getBag() || [])]
  }
});

addReducer('updateBuiltonSession', (global, dispatch, builtonSession) => {
  setBuiltonSession(builtonSession);
  return {
    builtonSession
  };
});

addReducer('removeItemFromBag', (global, dispatch, itemId) => {
  const bag = getBag();
  for (let i = 0; i < bag.length; i += 1) {
    if (bag[i].size._id.$oid === itemId) {
      bag.splice(i, 1);
      break;
    }
  }
  setBag(bag);
  return {
    bag
  }
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
      bag: []
    };

    try {
      data = {
        user: getUser(),
        builtonSession: getBuiltonSession(),
        bag: getBag(),
      };
    } catch (err) {
      clearUser();
      clearBuiltonSession();
      clearBag();
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
    clearBag();
    resetGlobal();

    INITIALIZED = false;
  }
};
