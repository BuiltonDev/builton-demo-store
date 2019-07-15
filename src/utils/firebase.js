import firebase from "firebase/app";
import 'firebase/auth';
import config from '../config';

firebase.initializeApp({
  apiKey: config.firebase.apiKey,
  authDomain: config.firebase.authDomain,
});

export default firebase;
