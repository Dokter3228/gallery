import React, { useState, useEffect } from "react";

import {
  useSignupMutation,
  useCheckAuthMutation,
} from "../../features/api/usersApi";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks";

export default function Signin() {
  const [credentials, setCredentials] = useState({ login: "", password: "" });
  const [userAlreadyExistsError, setUserAlreadyExistsError] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [signInTheUser] = useSignupMutation();

  // @ts-ignore
  const [checkIfUserAuthorized] = useCheckAuthMutation();

  useEffect(() => {
    const redirectIfHasCookie = async () => {
      const res = await checkIfUserAuthorized();
      // @ts-ignore
      if (res.data.login) {
        navigate("/");
      }
    };
    redirectIfHasCookie();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const check = await signInTheUser({
      login: credentials.login,
      password: credentials.password,
    });
    // @ts-ignore
    if (check?.data) {
      navigate("/");
    }
    // @ts-ignore
    if (check?.error?.data?.message === "this user already exists") {
      setUserAlreadyExistsError(true);
      setTimeout(() => {
        setUserAlreadyExistsError(false);
      }, 2000);
      return;
    }
    setCredentials({ login: "", password: "" });
  };
  return (
    <div className="pb-32 h-screen text-white flex items-center justify-center gap-10">
      <div>
        <h1 className="text-3xl mb-8">You can Sign In here</h1>
        <form className="h-full" onSubmit={handleSubmit}>
          <label className="flex-col items-center justify-center">
            <p>Login</p>
            <input
              autoComplete=""
              className="text-black"
              type="text"
              value={credentials.login}
              onChange={handleChange}
            />
          </label>
          <label className="my-6">
            <p>Password</p>
            <input
              className="text-black"
              type="password"
              value={credentials.password}
              onChange={(e) =>
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
          {userAlreadyExistsError && (
            <h1 className="text-red-400">This user already exists</h1>
          )}
        </form>
        <Link className="text-red-300 mt-6" to="/login">
          Already have an account? Log in here
        </Link>
      </div>
    </div>
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    return setCredentials((prev) => {
      return { ...prev, login: e.target.value };
    });
  }
}
