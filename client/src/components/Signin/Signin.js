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
export default function Signin({ setToken, setSignInPage }) {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [userAlreadyExistsError, setUserAlreadyExistsError] = useState(false)
    const handleSubmit = async e => {
        e.preventDefault();
        const check = await checkIfUserExists({
            login, password
        })
        if(check.login) {
            setUserAlreadyExistsError(true)
            setTimeout(() => {
                setUserAlreadyExistsError(false)
            }, 2000)
            return;
        }
        const token = await createUser({
            login,
            password
        });
            setToken(token);
            setSignInPage(false)
        setLogin("")
        setPassword("")
    }
    return(
        <div className="mt-40">
            <h1>You can Sign In here</h1>
            <form className="my-10"  onSubmit={handleSubmit}>
                <label>
                    <p>Login</p>
                    <input className="text-black" type="text" value={login} onChange={e => setLogin(e.target.value)}/>
                </label>
                <label>
                    <p>Password</p>
                    <input className="text-black" type="password" value={password} onChange={e => setPassword(e.target.value)}/>
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