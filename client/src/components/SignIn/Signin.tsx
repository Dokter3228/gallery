import { useState } from 'react';

import {useLoginMutation, useSignupMutation} from "../../features/api/usersApi";

// @ts-ignore
export default function Signin({ setToken, setSignInPage }) {
    const [credentials, setCredentials] = useState({login: "", password: ""})
    const [userAlreadyExistsError, setUserAlreadyExistsError] = useState(false)

    const [checkIfUserAlreadySignedIn] = useLoginMutation()
    const [signInTheUser] = useSignupMutation()
    // @ts-ignore
    const handleSubmit = async e => {
        e.preventDefault();
        const check = await checkIfUserAlreadySignedIn({
            login: credentials.login,
            password: credentials.password
        })
    // @ts-ignore
        if(check?.data?.login) {
            setUserAlreadyExistsError(true)
            setTimeout(() => {
                setUserAlreadyExistsError(false)
            }, 2000)
            return;
        }
        await signInTheUser({
           login: credentials.login,
            password: credentials.password
        });
            setToken(true);
            setSignInPage(false)
         setCredentials({login: "", password: ""})
    }
    return(
        <div className="mt-40">
            <h1>You can Sign In here</h1>
            <form className="my-10"  onSubmit={handleSubmit}>
                <label>
                    <p>Login</p>
                    <input className="text-black" type="text" value={credentials.login} onChange={e => setCredentials(prev => { return {...prev, login: e.target.value}})}/>
                </label>
                <label>
                    <p>Password</p>
                    <input className="text-black" type="password" value={credentials. password} onChange={e => setCredentials(prev => { return {...prev, password: e.target.value}})}/>
                </label>
                <div>
                    <button className="mt-6 text-green-300" type="submit">Submit</button>
                </div>
            </form>
            {userAlreadyExistsError && <h1 className="text-red-400">This user already exists</h1>}
        </div>
    )
}