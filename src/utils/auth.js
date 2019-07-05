import React from 'react';
import firebase from "firebase";
import builton from "./builton";

const setFirebaseToken = async () => {
  const fbUserPromise =  new Promise((resolve, reject) => {
    const user = firebase.auth().currentUser;
    if (user) {
      resolve(user);
    } else {
      const unsubscribe = firebase.auth().onAuthStateChanged(function(user) {
        unsubscribe();
        if (user) {
          resolve(user);
        } else {
          const error = new Error('User is not authenticated');
          reject(error);
        }
      });
    }
  });

  try {
    const fbPromise = await fbUserPromise;
    const idToken = await fbPromise.getIdToken();
    await builton.refreshBearerToken(idToken);
    return idToken;
  } catch(err) {
    return new Error('Failed to get idToken')
  }
};

export { setFirebaseToken };
