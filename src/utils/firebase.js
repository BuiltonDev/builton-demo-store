import firebase from "firebase";
import config from '../config';

firebase.initializeApp({
  apiKey: config.firebase.apiKey,
  authDomain: config.firebase.authDomain,
});

export default firebase;
