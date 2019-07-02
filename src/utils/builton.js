import React from 'react';
import Builton from '@builton/core-sdk/src/main';
import globalState from "../globalStore/globalState";
import { getFieldCurry } from '../globalStore/localStorage';
import firebase from 'firebase';

globalState.init();

const builtonSession = getFieldCurry('builtonSession')();

const BuiltonClient = new Builton({
  ...(builtonSession && { bearerToken: builtonSession }),
  ...(builtonSession && { refreshTokenFn: async () => await firebase.auth().currentUser.getIdToken()}),
  apiKey: 'kPLD9gPyee9e6Vq1hw3H-NvUbaTLNQtabNpMtqnqIElblNxcqPQ1-shrObMpKl1KeZc9-TJmC9KQ2xP-yKhB8Q=='
});

export default BuiltonClient;
