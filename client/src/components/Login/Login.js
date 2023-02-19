import React, { useState } from 'react';

async function loginUser(credentials) {
    return fetch('/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json()).then(res => res)
}
export default function Login(props) {
    const [credentials, setCredentials ] = useState({login: "", password: ""})
    const [authError, setAuthError] = useState(false)
    const handleSubmit = async e => {
        e.preventDefault();
        const token = await loginUser({
            login: credentials.login,
            password: credentials.password
        });
        if(token.message === "you are not signed up") {
            setAuthError(true)
            setTimeout(() => {
                setAuthError(false)
            }, 2000)
            props.setToken(false)
        } else {
            props.setToken(token);
        }
        setCredentials({login: "", password: ""})
    }
    return(
        <div className="mt-40">
            <h1>Please Log In</h1>
            <form className="my-10" onSubmit={handleSubmit}>
                <label >
                    <p>Login</p>
                    <input className="text-black" type="text" value={credentials.login} onChange={e => setCredentials(prev => ({...prev, login: e.target.value}))}/>
                </label>
                <label >
                    <p>Password</p>
                    <input className="text-black"  type="password" value={credentials.password} onChange={e => setCredentials(prev => ({...prev, password: e.target.value}))}/>
                </label>
                <div>
                    <button className="mt-6 text-green-300" type="submit">Submit</button>
                </div>
                {authError && <h1 style={{
                    color: "red"
                }}>wrong credentials!</h1>}
            </form>
        </div>
    )
}

