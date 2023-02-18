import {useEffect, useState} from "react";
import Cookies from 'js-cookie';
import { isExpired, decodeToken } from "react-jwt";
import Login from "../Login/Login";
import Signin from "../Signin/Signin";
import Logout from "../Logout/Logout";

async function getImageMeta(imageId) {
    return fetch(`/images/image/${imageId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(data => data.json()).then(res => res)
}
function Main() {
    const [token, setToken] = useState(false)
    const [signInPage, setSignInPage] = useState(false)
    useEffect(() => {
       const cookie = Cookies.get("set-cookie");
       setToken(!isExpired(cookie))
    }, [])
    if(!token && signInPage === false) {
        return (
            <>
                <Login setToken={setToken} />
                <button onClick={() => setSignInPage(true)}>Don't have an account? Sign in here</button>
            </>
            )
    } else if(signInPage) {
        return <Signin setSignInPage={setSignInPage} setToken={setToken} />
    }
  return (
    <div>
      <h1>Gallery main page</h1>
        <button onClick={async () => {
            const res = await getImageMeta("7a9eea06-3df7-4bd8-80f6-7d7e05617c8f")
            console.log(res)
        }
        }>fetch image</button>
        <Logout setToken={setToken} />
    </div>
  );
}

export default Main;
