// TODO: For the future authentication

import { setGlobal, resetGlobal, addReducer, getDispatch } from 'reactn';
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

const clearCheckout = clearFieldCurry('checkout');
const getCheckout = getFieldCurry('checkout');
const setCheckout = setFieldCurry('checkout');

addReducer('updateUser', (global, dispatch, user, setLocalStorage = true) => {
  if (setLocalStorage) {
    setUser(user);
  }
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



addReducer('updateCheckoutStep', (global, dispatch, checkout) => {
  setCheckout(checkout);
  return {
    checkout
  }
});

addReducer('updateBuiltonSession', (global, dispatch, builtonSession , setLocalStorage = true) => {
  if (setLocalStorage) {
    setBuiltonSession(builtonSession);
  }
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

addReducer('logout', async (global, dispatch) => {
  await dispatch.updateUser(undefined, false);
  await dispatch.updateBuiltonSession(undefined, false);
})


export default {
  init: () => {
    if (INITIALIZED) {
      console.log('Authentication already initialized');
      return;
    }

    let data = {
        user: null,
        builtonSession: null,
        bag: null,
        checkout: {
          0: {
            title: 'bag',
            complete: false,
          },
          1: {
            title: 'authentication',
            complete: false,
          },
          2: {
            title: 'payment_method',
            complete: false,
          },
          3: {
            title: 'delivery_address',
            complete: false,
          },
          4: {
            title: 'confirm',
            complete: false,
          }
        }
      };

    try {
      data = {
        user: getUser(),
        builtonSession: getBuiltonSession(),
        bag: getBag(),
        checkout: getCheckout()
      };
    } catch (err) {
      clearUser();
      clearBuiltonSession();
      clearBag();
      clearCheckout();
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
  logout: async () => {
    clearUser();
    clearBuiltonSession();
    await getDispatch().logout();


    INITIALIZED = false;
  }
};
