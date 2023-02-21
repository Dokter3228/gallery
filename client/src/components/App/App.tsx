import React from 'react';
import {useState} from "react";
import {useCheckUserMutation} from "../../features/api/usersApi";
import {useAddImageMutation, useGetImagesQuery} from "../../features/api/imagesApi";
import Logout from "../Logout/Logout";
const App = () => {
    const [selectedFile, setSelectedFile] = useState(null)
    const {data: imagesH, isLoading} = useGetImagesQuery("")
    const [addImageHere] = useAddImageMutation()
    const [checkIfUserExists] = useCheckUserMutation()
    // @ts-ignore
    const upload = async (e) => {
        e.preventDefault();
        // @ts-ignore
        const {data} = await checkIfUserExists();
        // const {login} = await getUser()
        let formData = new FormData();
        // @ts-ignore
        formData.append("image", selectedFile);
        formData.append("login", data.login)
        addImageHere(formData)
    };
    if(isLoading) {
        return <h1>Wait pls!</h1>
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
            <Logout />
        </div>
    );
};

export default App;
