// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const fireBaseConfig = {
  apiKey: "AIzaSyD-7jepN9PAOze4SNQJ4pgYThvfwNylMpE",
  authDomain: "velas-santamarta.firebaseapp.com",
  projectId: "velas-santamarta",
  storageBucket: "velas-santamarta.firebasestorage.app",
  messagingSenderId: "643690285491",
  appId: "1:643690285491:web:3bc9600444cf0972ace3c6",
  measurementId: "G-VW13682S10"
};

// Initialize Firebase
const app = initializeApp(fireBaseConfig);

//inicialize analytics
//const analytics = getAnalytics(app);

//inicialize auth
const auth = getAuth(app);

export { auth };