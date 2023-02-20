import {useState} from "react";
import { redirect } from "react-router-dom";
async function logoutUser() {
    return fetch('/users/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(data => data.json()).then(res => res)
}// @ts-ignore
export default function Logout({ setToken }) {
    // @ts-ignore
    const handleSubmit = async e => {
        e.preventDefault();
        await logoutUser();
        setToken(false)
        return redirect("/");
    }
    return(
        <div className="text-center pb-20 text-lg">
            <form onSubmit={handleSubmit}>
                <button>
                    Logout
                </button>
            </form>
        </div>
    )
}