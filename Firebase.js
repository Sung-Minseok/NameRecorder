// Import the functions you need from the SDKs you need
import * as firebase from "firebase/app";
import * as firebaseAuth from 'firebase/auth';
import * as firebaseDB from "firebase/firestore";
import * as fireStorage from "firebase/storage";
// import {getMessaging} from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGIN_ID,
//   appId: process.env.REACT_APP_APP_ID
// };
const firebaseConfig = {
  apiKey: "AIzaSyAaXsrdTmrNR-zETyP5R_B1mgSEuxBW0mY",
  authDomain: "namerecorder-2f24c.firebaseapp.com",
  projectId: "namerecorder-2f24c",
  storageBucket: "namerecorder-2f24c.appspot.com",
  messagingSenderId: "364075813917",
  appId: "1:364075813917:web:f77afe41339389d6eb8af4"
};

// Initialize Firebase
export default firebase.initializeApp(firebaseConfig);
export const auth = firebaseAuth
export const db = firebaseDB
export const storage = fireStorage
// export const msg = getMessaging(firebase.initializeApp(firebaseConfig));