import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import "./styles/navbar.css";
import "./styles/events.css";
import "./styles/dashboard.css";
import "./styles/details.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);