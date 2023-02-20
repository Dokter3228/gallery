import {useEffect, useState} from "react";
import Cookies from 'js-cookie';
import { isExpired } from "react-jwt";
import Login from "../components/Login/Login";
import Signin from "../components/SignIn/Signin";
import Logout from "../components/Logout/Logout";


import {useGetImagesQuery, useAddImageMutation} from "../features/api/imagesApi";
import {useCheckUserMutation} from "../features/api/usersApi";

function Main() {
    const [token, setToken] = useState(false)
    const [signInPage, setSignInPage] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)

    const {data: imagesH, isLoading} = useGetImagesQuery("")
    const [addImageHere] = useAddImageMutation()
    const [checkIfUserExists] = useCheckUserMutation()
    // @ts-ignore
    const upload = async (e) => {
        e.preventDefault();
        const cookie = Cookies.get("set-cookie");
        // @ts-ignore
        const {data} = await checkIfUserExists({token: cookie});
        // const {login} = await getUser()
        let formData = new FormData();
        // @ts-ignore
        formData.append("image", selectedFile);
        formData.append("login", data.login)
        addImageHere(formData)
    };

    useEffect( () => {
        const cookie = Cookies.get("set-cookie");
        // @ts-ignore
        setToken(!isExpired(cookie))
    }, [] );

    if(isLoading) {
        return <h1>Wait pls!</h1>
    }

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
                {!token ?  <Signin setSignInPage={setSignInPage} setToken={setToken} /> :  <Login setToken={setToken} />}
                <button className="text-red-200" onClick={() => setSignInPage(false)}>Already have an account? Log in here!</button>
            </div>
            )

    }
  return (
    <div className="bg-gray-900 text-white">
      <h1 className="text-2xl text-center py-10 ">Gallery main page</h1>
        <form className="text-center my-6 mb-10 flex items-center justify-center gap-20">
            <input
                type="file"
                name="screenshot"
                onChange={(e) => {
                    // @ts-ignore
                    setSelectedFile(e.target.files[0]);
                }}
            />
            <button onClick={(e) => upload(e)}>Upload the image</button>
        </form>
        <div className="flex flex-wrap gap-20 items-center justify-center my-20">
            {!isLoading ? imagesH.map((img) => {
                const imgSrc = "http://localhost:17548/images/" + img + ".jpeg"
                return <img key={img} className="rounded-2xl w-60 h-22" src={imgSrc} />
            }) : <h1>No images now!</h1>}
        </div>
        <Logout setToken={setToken} />
    </div>
  );
}

export default Main;