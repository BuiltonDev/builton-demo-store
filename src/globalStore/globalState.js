import { setGlobal, resetGlobal, addReducer, getDispatch } from 'reactn';
import {
  clearFieldCurry,
  getFieldCurry,
  setFieldCurry,
  clearAllFields
} from './localStorage';
import builton from "../utils/builton";

let INITIALIZED = false;

const DEFAULT_CHECKOUT = {
  0: {
    title: 'cart',
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
};

const DEFAULT_ORDER = {
  items: [],
  delivery_address: '',
  payment_method: '',
};

const clearUser = clearFieldCurry('user');
const getUser = getFieldCurry('user');
const setUser = setFieldCurry('user');

const clearBuiltonSession = clearFieldCurry('builtonSession');
const getBuiltonSession = getFieldCurry('builtonSession');
const setBuiltonSession = setFieldCurry('builtonSession');

const clearCheckout = clearFieldCurry('checkout');
const getCheckout = getFieldCurry('checkout');
const setCheckout = setFieldCurry('checkout');

const clearOrder = clearFieldCurry('order');
const getOrder = getFieldCurry('order');
const setOrder = setFieldCurry('order');

addReducer('updateUser', (global, dispatch, user, setLocalStorage = true) => {
  if (setLocalStorage) {
    setUser(user);
  }
  return {
    user
  };
});

addReducer('clearCart', (global, dispatch) => {
  builton.cart.empty();
  return {
    cart: []
  }
});

addReducer('updateCheckoutStep', (global, dispatch, checkout) => {
  setCheckout(checkout);
  return {
    checkout
  }
});

addReducer('addItemToCart', (global, dispatch, item) => {
  const addItemToBuiltonCart = () => {
    builton.cart.addProduct({
      productId: item.product._id.$oid,
      quantity: 1,
      subProducts: [item.size._id.$oid]
    });
  };

  const builtonCart = builton.cart.get();
  if (!!builtonCart.length) {
    for (let i = 0; i < builtonCart.length; i += 1) {
      if (builtonCart[i].productId === item.product._id.$oid) {
        // In case we have the product, we need to add a subproduct to that product
        builton.cart.addSubproduct(item.size._id.$oid, item.product._id.$oid, true);
        break;
      } else if (i === builtonCart.length - 1) {
        // in case we haven't found a product with the same id, we add one
        builton.cart.addProduct({ productId: item.product._id.$oid, quantity: 1, subProducts: [ item.size._id.$oid ]});
        break;
      }
    }
  } else {
    // Add product to the cart
    addItemToBuiltonCart();
  }


  return {
    cart: [
      ...global.cart,
      item
    ]
  }
});

addReducer('removeItemFromCart', (global, dispatch, item) => {
  const builtonCart = builton.cart.get();
  if (!!builtonCart.length) {
    for (let i = 0; i < builtonCart.length; i += 1) {
      if (builtonCart[i].productId === item.product._id.$oid) {
        if (builtonCart[i].subProducts.length === 1) {
          // If its the last sub product in the product, we remove the product
          builton.cart.removeProduct({ productId: item.product._id.$oid, quantity: 1})
        } else {
          // otherwise we remove the sub product
          builton.cart.removeSubproduct(item.size._id.$oid, item.product._id.$oid, true);
        }
      }
    }
  }
  if (!!global.cart.length) {
    for (let i = 0; i < global.cart.length; i += 1) {
      if (global.cart[i].size._id.$oid === item.size._id.$oid) {
        global.cart.splice(i, 1);
        break;
      }
    }
  }
  return global;
});

addReducer('updateOrder', (global, dispatch, order) => {
  setOrder(order);
  return {
    order
  }
});

addReducer('updatePaymentMethod', (global, dispatch, paymentMethod) => {
  return {
    paymentMethod
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


addReducer('clearCheckout', async (global, dispatch) => {
  await dispatch.updateOrder(DEFAULT_ORDER);
  await dispatch.updatePaymentMethod(null);
  await dispatch.updateCheckoutStep(DEFAULT_CHECKOUT);
});

addReducer('logout', async (global, dispatch) => {
  await dispatch.updateUser(null, false);
  await dispatch.updateBuiltonSession(null, false);
  await dispatch.updateOrder(DEFAULT_ORDER);
  await dispatch.updatePaymentMethod(null);
  await dispatch.clearCheckout();
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
        order: DEFAULT_ORDER,
        paymentMethod: null,
        cart: [],
        checkout: DEFAULT_CHECKOUT
      };

    try {
      data = {
        user: getUser(),
        builtonSession: getBuiltonSession(),
        checkout: getCheckout() || DEFAULT_CHECKOUT,
        order: getOrder() || DEFAULT_ORDER,
        cart: [],
        paymentMethod: null,
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
  logout: async () => {
    clearUser();
    clearBuiltonSession();
    clearOrder();
    clearCheckout();
    await getDispatch().logout();


    INITIALIZED = false;
  }
};
