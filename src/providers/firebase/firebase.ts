import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCNYz_A3rQcAzSbnYPwGMAAyyRo0M-9c5I",
  authDomain: "xtuml-hub.firebaseapp.com",
  projectId: "xtuml-hub",
  storageBucket: "xtuml-hub.appspot.com",
  messagingSenderId: "576596049145",
  appId: "1:576596049145:web:8278c28967286ae1d1f628",
  measurementId: "G-F32DBXX2TS",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
