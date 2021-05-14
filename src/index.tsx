import React from "react";
import ReactDOM from "react-dom";
import { ApiService } from "./api";
import "./index.css";
import App from "./app/app";

const apiService = new ApiService();

ReactDOM.render(
  <React.StrictMode>
    <App apiService={apiService} />
  </React.StrictMode>,
  document.getElementById("root")
);
