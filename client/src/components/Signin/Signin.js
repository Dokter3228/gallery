import React, { useState } from 'react';


async function checkIfUserExists(credentials) {
    return fetch('/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json()).then(res => res)
}
async function createUser(credentials) {
    return fetch('/users/newUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json()).then(res => res)
}
export default function Signin(props) {
    const [credentials, setCredentials ] = useState({login: "", password: ""})
    const [userAlreadyExistsError, setUserAlreadyExistsError] = useState(false)
    const handleSubmit = async e => {
        e.preventDefault();
        const check = await checkIfUserExists({
            login: credentials.login, password: credentials.password
        })
        if(check.login) {
            setUserAlreadyExistsError(true)
            setTimeout(() => {
                setUserAlreadyExistsError(false)
            }, 2000)
            return;
        }
        const token = await createUser({
            login: credentials.login, password: credentials.password
        });
            props.setToken(token);
            props.setSignInPage(false)
            setCredentials({login: "", password: ""})
    }
    return(
        <div className="mt-40">
            <h1>You can Sign In here</h1>
            <form className="my-10"  onSubmit={handleSubmit}>
                <label>
                    <p>Login</p>
                    <input className="text-black" type="text" value={credentials.login} onChange={e => setCredentials(prev => ({...prev, login: e.target.value}))}/>
                </label>
                <label>
                    <p>Password</p>
                    <input className="text-black" type="password" value={credentials.password} onChange={e => setCredentials((prev) => ({...prev, password: e.target.value}))}/>
                </label>
                <div>
                    <button className="mt-6 text-green-300" type="submit">Submit</button>
                </div>
            </form>
            {userAlreadyExistsError && <h1 style={{
                color: "red"
            }}>This user already exists</h1>}
        </div>
    )
}