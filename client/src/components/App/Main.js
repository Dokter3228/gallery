import {useEffect, useState} from "react";
import Cookies from 'js-cookie';
import { isExpired, decodeToken } from "react-jwt";
import Login from "../Login/Login";
import Signin from "../Signin/Signin";
import Logout from "../Logout/Logout";
import Axios from "axios";
async function getUser() {
    const cookie = Cookies.get("set-cookie");
    return fetch(`http://localhost:17540/users/getUser/`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({token: cookie})
    })
        .then(data => data.json()).then(res => res)
}

function Main() {
    const [token, setToken] = useState(false)
    const [signInPage, setSignInPage] = useState(false)
    const [images, setImages] = useState([])
    const [selectedFile, setSelectedFile] = useState(null)
    const upload = async (e) => {
        e.preventDefault();
        const {login} = await getUser()
        let formData = new FormData();
        formData.append("image", selectedFile);
        formData.append("login", login)
        Axios.post("http://localhost:17540/images/image/2", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }).then((res) => {
            setImages(prev => [...prev, res.data.uuid])
            console.log("Success ", res.data.uuid);
        });
    };

    useEffect( () => {
        const cookie = Cookies.get("set-cookie");
        setToken(!isExpired(cookie))
        async function getAllImages() {
            return fetch(`/images/allImages/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(data => data.json()).then(res => {
                        setImages( res)
                })
        }
        console.log(1)
        getAllImages()
    }, [] );

    if(!token && signInPage === false) {
        return (
            <>
                <Login setToken={setToken} />
                <button onClick={() => setSignInPage(true)}>Don't have an account? Sign in here</button>
            </>
            )
    } else if(signInPage) {
        return (
            <>
                <Signin setSignInPage={setSignInPage} setToken={setToken} />
                <button onClick={() => setSignInPage(false)}>Already have an account? Log in here!</button>
            </>
            )

    }
  return (
    <div>
      <h1>Gallery main page</h1>
        <form>`
            <input
                type="file"
                name="screenshot"
                onChange={(e) => {
                    setSelectedFile(e.target.files[0]);
                }}
            />
            <button onClick={(e) => upload(e)}>Submit</button>
        </form>
        {images.length > 0 ? images.map((img) => {
            const imgSrc = "http://localhost:17540/images/" + img + ".jpeg"
            return <img key={img} style={{
            width: "200px"
            }
            } src={imgSrc} />
        }) : <h1>No images now!</h1>}
        <Logout setToken={setToken} />
    </div>
  );
}

export default Main;
