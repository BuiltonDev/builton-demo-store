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
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          await firebase.auth().currentUser.getIdToken()
        } return false;
      });
    }}),
  endpoint: config.endpoint,
  apiKey: config.apiKey,
});

export default BuiltonClient;
