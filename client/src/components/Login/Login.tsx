import React, { useState, useEffect } from "react";
import {
  useCheckAuthMutation,
  useLoginMutation,
} from "../../features/api/usersApi";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks";
export default function Login() {
  const [credentials, setCredentials] = useState({ login: "", password: "" });
  const [authError, setAuthError] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loginUser] = useLoginMutation();

  const [checkIfUserAuthorized] = useCheckAuthMutation();
  useEffect(() => {
    const redirectIfNoCookie = async () => {
      const res = await checkIfUserAuthorized();
      // @ts-ignore
      console.log(res);
      // @ts-ignore
      if (res.data.login) {
        navigate("/");
      }
    };
    redirectIfNoCookie();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await loginUser({
      login: credentials.login,
      password: credentials.password,
    });
    // @ts-ignore
    if (res?.error?.data.message === "you are not signed up") {
      setAuthError(true);
      setTimeout(() => {
        setAuthError(false);
      }, 2000);
    } else {
      navigate("/");
    }
    setCredentials({ login: "", password: "" });
  };
  return (
    <div className="pb-32 h-screen text-white flex items-center justify-center gap-10">
      <div>
        <h1 className="text-3xl mb-8">Please Log In</h1>
        <form className="h-full" onSubmit={handleSubmit}>
          <label className="flex-col items-center justify-center">
            <p>Login</p>
            <input
              className="text-black"
              type="text"
              value={credentials.login}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCredentials((prev) => {
                  return { ...prev, login: e.target.value };
                })
              }
            />
          </label>
          <label className="my-6">
            <p>Password</p>
            <input
              className="text-black"
              type="password"
              value={credentials.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCredentials((prev) => {
                  return { ...prev, password: e.target.value };
                })
              }
            />
          </label>
          <div>
            <button className="my-6 text-green-300" type="submit">
              Submit
            </button>
          </div>
          {authError && <h1 className="text-red-400">wrong credentials!</h1>}
        </form>
        <Link className="text-red-300 mt-6" to="/signin">
          Don't have an account? Sign In here
        </Link>
      </div>
    </div>
  );
}
