import Builton from '@builton/core-sdk/src/main';
import globalState from "../globalStore/globalState";
import { getFieldCurry } from '../globalStore/localStorage';
import firebase from './firebase';
import config from '../config';

globalState.init();

const builtonSession = getFieldCurry('builtonSession')();

const BuiltonClient = new Builton({
  ...(builtonSession && { bearerToken: builtonSession }),
  ...(builtonSession && { refreshTokenFn: async () => {
      return firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          const idToken = await firebase.auth().currentUser.getIdToken();
          globalState.updateSession(idToken);
          return idToken;
        } return false;
      });
    }}),
  endpoint: config.endpoint,
  apiKey: config.apiKey,
});

export default BuiltonClient;
