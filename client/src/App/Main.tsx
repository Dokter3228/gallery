import Login from "../components/Login/Login";
import Signin from "../components/SignIn/Signin";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../components/App/App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signin",
    element: <Signin />,
  },
]);

const Main = (): JSX.Element => <RouterProvider router={router} />;

export default Main;
