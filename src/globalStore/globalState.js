import { setGlobal, resetGlobal, addReducer } from 'reactn';
import {
  clearFieldCurry,
  getFieldCurry,
  setFieldCurry,
  clearAllFields
} from './localStorage';
import get from 'lodash.get';

let INITIALIZED = false;

const clearCompany = clearFieldCurry('company');
const clearUser = clearFieldCurry('user');
const getCompany = getFieldCurry('company');
const setCompany = setFieldCurry('company');
const getUser = getFieldCurry('user');
const setUser = setFieldCurry('user');
const getPreferences = getFieldCurry('preferences');
const setPreferences = setFieldCurry('preferences');
const getCompanyPreferences = getFieldCurry('companyPreferences');
const setCompanyPreferences = setFieldCurry('companyPreferences');
const getReleaseHash = getFieldCurry('releaseHash');
const setReleaseHash = setFieldCurry('releaseHash');

addReducer('updateReleaseHash', (global, releaseHash) => {
  setReleaseHash(releaseHash);
  return {
    releaseHash
  };
});

addReducer('updateCompany', (global, company) => {
  setCompany(company);
  thirdparty.onCompanyUpdate(company);
  return {
    company
  };
});

addReducer('updateUser', (global, user) => {
  setUser(user);
  thirdparty.onUserUpdate(user);
  return {
    user
  };
});

addReducer('updatePreferences', (global, preference) => {
  const newPreferences = {
    ...global.preferences
  };
  newPreferences[global.user.auth_id] = {
    ...newPreferences[global.user.auth_id],
    ...preference
  };
  setPreferences(newPreferences);
  return {
    preference: {
      ...newPreferences
    }
  };
});

addReducer('updateCompanyPreferences', (global, company, preference) => {
  const newPreferences = {
    ...global.companyPreferences
  };
  newPreferences[global.user.auth_id] = {
    [company._id.$oid]: {
      ...get(newPreferences, `${global.user.auth_id}.${company._id.$oid}`),
      ...preference
    }
  };
  setCompanyPreferences(newPreferences);
  return {
    companyPreferences: {
      ...newPreferences
    }
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
      company: null,
      preferences: null,
      companyPreferences: null,
      releaseHash: null
    };

    // Check to see if userid and companyid cookie is set. if not, cleanup.
    if (
      document.cookie.indexOf('builton-userid') < 0 &&
      document.cookie.indexOf('builton-companyid') < 0
    ) {
      clearCompany();
      clearUser();
    }

    try {
      data = {
        user: getUser(),
        company: getCompany(),
        preferences: getPreferences(),
        companyPreferences: getCompanyPreferences(),
        releaseHash: getReleaseHash()
      };
    } catch (err) {
      clearUser();
      clearCompany();
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
    clearCompany();
    clearUser();
    resetGlobal();
    thirdparty.onReset();

    INITIALIZED = false;
    setTimeout(
      () => {
        window.location.href = '/auth/signout';
      },
      time ? time : 0
    );
  }
};
