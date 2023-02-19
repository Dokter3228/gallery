import React from 'react';
import ReactDOM from 'react-dom/client';
import Main from './App/Main';
import { store } from './App/store'
import { Provider } from 'react-redux'
import './index.css'
import {ApiProvider} from "@reduxjs/toolkit/dist/query/react";
import {imagesApi} from "./features/api/imagesApi";

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
