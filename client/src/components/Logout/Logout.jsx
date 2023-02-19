import React from "react";
async function logoutUser() {
    return fetch('/users/logout', {
        method: 'POST',
    })
        .then(data => data.json()).then(res => res)
}
export default function Logout(props) {
    const handleSubmit = async e => {
        e.preventDefault();
        await logoutUser();
        props.setToken(false)
    }
    return(
        <div className="text-center pb-20 text-lg">
                <button type="submit" onClick={handleSubmit} >
                    Logout
                </button>
        </div>
    )
}