import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Main from './components/App/Main';
import Signin from "./components/Signin/Signin";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
    },
    {
        path: "/logout",
        element: <Main />,
    },
    {
        path: "/signin",
        element: <Signin />,
    },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
          <RouterProvider router={router} />
  </React.StrictMode>
);
