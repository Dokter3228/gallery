
import { useState } from 'react';
import {useLoginMutation} from "../../features/api/usersApi";

// @ts-ignore
export default function Login({ setToken }) {
    const [credentials, setCredentials] = useState({login: "", password: ""})
    const [authError, setAuthError] = useState(false)

    const [loginUser2] = useLoginMutation();

    // @ts-ignore
    const handleSubmit = async e => {
        e.preventDefault();
    // @ts-ignore
        const res = await loginUser2({
            login: credentials.login,
            password: credentials.password
        });
    // @ts-ignore
        if(res?.error?.data.message === "you are not signed up") {
            setAuthError(true)
            setTimeout(() => {
                setAuthError(false)
            }, 2000)
            setToken(false)
        } else {
            setToken(true);
        }
        setCredentials({login: "", password: ""})
    }
    return(
        <div className="mt-40">
            <h1>Please Log In</h1>
            <form className="my-10" onSubmit={handleSubmit}>
                <label >
                    <p>Login</p>
                    <input className="text-black" type="text" value={credentials.login} onChange={e =>
                        setCredentials(prev => { return {...prev, login: e.target.value}})}/>
                </label>
                <label >
                    <p>Password</p>
                    <input className="text-black"  type="password" value={credentials.password} onChange={e => setCredentials(prev => { return {...prev, password: e.target.value}})}/>
                </label>
                <div>
                    <button className="mt-6 text-green-300" type="submit">Submit</button>
                </div>
                {authError && <h1 className="text-red-400">wrong credentials!</h1>}
            </form>
        </div>
    )
}