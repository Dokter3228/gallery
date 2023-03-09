import Login from "../components/Login/Login";
import Signup from "../components/Signup/Signup";
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
    path: "/signup",
    element: <Signup />,
  },
]);

const Main = (): JSX.Element => <RouterProvider router={router} />;

export default Main;
