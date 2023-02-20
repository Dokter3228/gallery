import * as React from 'react'
import * as ReactDOM from "react-dom/client"
import Main from './App/Main';
import {store, useAppSelector} from './App/store'
import { Provider } from 'react-redux'
import {ApiProvider} from "@reduxjs/toolkit/dist/query/react";
import {imagesApi} from "./features/api/imagesApi";
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
      <ApiProvider api={imagesApi}>
          <Provider store={store}>
              <Main />
          </Provider>
      </ApiProvider>
  </React.StrictMode>
);
