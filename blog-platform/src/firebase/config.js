import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/analytics';
import 'firebase/compat/auth';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { sendSignInLinkToEmail } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBSgnCQ-HEOJ80YlyQte53KFgsGmlpXtcY",
  authDomain: "test-2e605.firebaseapp.com",
  projectId: "test-2e605",
  storageBucket: "test-2e605.appspot.com",
  messagingSenderId: "520337021037",
  appId: "1:520337021037:web:dcd0e4ff0e9dadbc154764",
};

const app = firebase.initializeApp(firebaseConfig);

const db = app.firestore();
const auth = firebase.auth();
const blogsCollection = db.collection("blogs");

export {
  app,
  auth,
  sendSignInLinkToEmail,
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  blogsCollection,
  deleteObject,
};