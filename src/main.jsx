import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import fbConfig from "./firebase.jsx";
import { initializeApp } from "firebase/app";

const app = initializeApp(fbConfig);

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
