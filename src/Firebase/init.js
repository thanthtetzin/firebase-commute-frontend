import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
const env = require("../config.json");
const config = env[process.env.NODE_ENV];

firebase.initializeApp(config.firebaseConfig);
export const firebaseAuth = firebase.auth();
//export const firestore = firebase.firestore();
