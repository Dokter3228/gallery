import React, { useEffect } from "react";
import { useState } from "react";
import { useCheckUserMutation } from "../../features/api/usersApi";
import {
  useAddImageMutation,
  useGetImagesQuery,
} from "../../features/api/imagesApi";
import {
  useCheckCookieMutation,
  useCurrentUserQuery,
} from "../../features/api/usersApi";
import Logout from "../Logout/Logout";
import { useNavigate } from "react-router-dom";
import ImagePlate from "../UI/imagePlate/ImagePlate";
import { useSelector } from "react-redux";
import {useAppSelector} from "../../App/store";

const App = () => {
  // @ts-ignore
  const imageSelector = useAppSelector((state) => state.images.entities)
  const navigate = useNavigate();
  const [checkCookie] = useCheckCookieMutation();
  const { data: { author } = {} } = useCurrentUserQuery("");

  useEffect(() => {
    const redirectIfNoCookie = async () => {
      const res = await checkCookie("");
      // @ts-ignore
      if (res?.error) {
        navigate("/login");
      }
    };
    redirectIfNoCookie();
  }, []);

  const [selectedFile, setSelectedFile] = useState<File | string| Blob>("");
  const { data: imagesH, isLoading } = useGetImagesQuery();
  const [addImageHere] = useAddImageMutation();
  const [checkIfUserExists] = useCheckUserMutation();
  const upload = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    // @ts-ignore
    const { data } = await checkIfUserExists();
    let formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("login", data.login);
    addImageHere(formData);
  };

  if (isLoading) {
    return <h1>Wait pls!</h1>;
  }

  return (
    <div className="bg-gray-900 text-white">
      <h1 className="text-3xl text-center py-10 ">Gallery main page</h1>
      <form className="text-center my-6 mb-10 flex items-center justify-center gap-20">
        <input
          type="file"
          name="screenshot"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (!e.target.files) return;
            setSelectedFile(e.target.files[0]);
          }}
        />
        <button onClick={(e) => upload(e)}>Upload the image</button>
      </form>
      <div className="flex flex-wrap gap-20 items-center justify-center my-20">
        {!isLoading ? (
          Object.values(imageSelector).map((img) => {
            return (
              // @ts-ignore
              <ImagePlate key={img.uuid} img={img} currentUser={author} />
            );
          })
        ) : (
          <h1>No images now!</h1>
        )}
        {Object.values(imageSelector).length === 0 && (
          <h1 className="text-2xl text-red-300">
            There's no images yet! Upload
          </h1>
        )}
      </div>
      <Logout />
    </div>
  );
};

export default App;
