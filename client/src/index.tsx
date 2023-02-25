import * as React from "react";
import * as ReactDOM from "react-dom/client";
import Main from "./App/Main";
import { store } from "./App/store";
import { Provider } from "react-redux";
import "./index.scss";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Main />
    </Provider>
  </React.StrictMode>
);
