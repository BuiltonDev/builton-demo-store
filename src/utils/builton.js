import Builton from '@builton/core-sdk';
import globalState from "../globalStore/globalState";
import { getFieldCurry } from '../globalStore/localStorage';
import firebase from './firebase';
import config from '../config';

globalState.init();

const builtonSession = getFieldCurry('builtonSession')();

const BuiltonClient = new Builton({
  ...(builtonSession && { bearerToken: builtonSession }),
  refreshTokenFn: () => {
    return new Promise(async (resolve, reject) => {
      const user = firebase.auth().currentUser;
      if (user) {
        const idToken = await user.getIdToken();
        resolve(idToken);
      } else {
        const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          unsubscribe();
          if (user) {
            const idToken = await user.getIdToken();
            resolve(idToken);
          } else {
            const error = new Error('User is not authenticated');
            reject(error);
          }
        });
      }
    });
    },
  endpoint: config.endpoint,
  apiKey: config.apiKey,
});

export default BuiltonClient;
