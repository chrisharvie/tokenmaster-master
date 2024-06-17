import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyBpy5TUtgeSduqh__543jnbXcR3i6hEGWE",
  authDomain: "artick-228b7.firebaseapp.com",
  projectId: "artick-228b7",
  storageBucket: "artick-228b7.appspot.com",
  messagingSenderId: "658096774967",
  appId: "1:658096774967:web:6d568d0011f54ff960c4b2",
  measurementId: "G-MYL6Z5WZ6M",
});

const analytics = getAnalytics(firebaseApp);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
