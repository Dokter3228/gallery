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
            <div className="overflow-hidden text-center pb-20 text-lg h-screen w-screen bg-gray-900 text-white flex-col items-center justify-center">
                <Login setToken={setToken} />
                <button className="text-red-200" onClick={() => setSignInPage(true)}>Don't have an account? Sign in here</button>
            </div>
            )
    } else if(signInPage) {
        return (
            <div className="overflow-hidden text-center pb-20 text-lg h-screen w-screen bg-gray-900 text-white flex-col items-center justify-center">
                <Signin setSignInPage={setSignInPage} setToken={setToken} />
                <button className="text-red-200" onClick={() => setSignInPage(false)}>Already have an account? Log in here!</button>
            </div>
            )

    }
  return (
    <div className="bg-gray-900 text-white">
      <h1 className="text-2xl text-center py-10">Gallery main page</h1>
        <form className="text-center my-6 mb-10 flex items-center justify-center gap-20">
            <input
                type="file"
                name="screenshot"
                onChange={(e) => {
                    setSelectedFile(e.target.files[0]);
                }}
            />
            <button onClick={(e) => upload(e)}>Upload the image</button>
        </form>
        <div className="flex flex-wrap gap-20 items-center justify-center my-20">
            {images.length > 0 ? images.map((img) => {
                const imgSrc = "http://localhost:17540/images/" + img + ".jpeg"
                return <img key={img} className="rounded-2xl w-60 h-22" src={imgSrc} />
            }) : <h1>No images now!</h1>}
        </div>
        <Logout setToken={setToken} />
    </div>
  );
}

export default Main;
