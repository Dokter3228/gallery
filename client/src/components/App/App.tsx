import React, { useEffect } from "react";
import { useState } from "react";
import { useCheckAuthMutation, useCurrentUserQuery } from "../../features/api/usersApi";
import {
  useAddImageMutation,
  useGetImagesQuery,
  useSetImageCommentsMutation,
} from "../../features/api/imagesApi";
import Logout from "../Logout/Logout";
import { useNavigate } from "react-router-dom";
import ImagePlate from "../UI/imagePlate/ImagePlate";
import { useAppSelector } from "../../App/store";
import { useAppDispatch } from "../../hooks";
import {addImage} from "../../features/images/imagesSlice";
import {nanoid} from "@reduxjs/toolkit";



const App = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // @ts-ignore
  const imageSelector = useAppSelector((state) => state.images.entities);
  const commentsSelector = useAppSelector(state => state.comments.comments)

  // @ts-ignore
  const {data} = useCurrentUserQuery("")
  const [checkIfUserAuthorized] = useCheckAuthMutation()

  useEffect(() => {
    const redirectIfNoCookie = async () => {
      const res = await checkIfUserAuthorized("")
      // @ts-ignore
      if (res?.error) {
        navigate("/login");
      }
    };
    redirectIfNoCookie();
  }, []);


  const [blobState, setBlobState] = useState<string[]>([]);


  const { isLoading } = useGetImagesQuery();
  const [addImageToServer] = useAddImageMutation();
  const [setImageComments] = useSetImageCommentsMutation()

  if (isLoading) {
    return <h1>Wait pls!</h1>;
  }

  const handleImageSending = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault()
    for (let image of Object.values(imageSelector)) {
      // @ts-ignore
      if(image.creationDate === "not created yet") {
        // @ts-ignore
        let blob = await fetch(image.src).then((r) => r.blob());
        const myFile = new File([blob], "image.jpeg", {
          type: "image/file",
        });
        // @ts-ignore
        let formData = new FormData();
        // @ts-ignore
        formData.append("image", myFile);
        formData.append("login", data.login);
        // @ts-ignore
        formData.append("uuid", image.uuid)
        addImageToServer(formData);
      }
     setBlobState([]);
    }
    setTimeout(() => {
      setImageComments({comments: commentsSelector})
    }, 1000)
  };

  return (
    <div className="bg-gray-900 text-white px-6">
      <h1 className="text-3xl text-center py-10 ">Gallery main page</h1>
      <form className="text-center my-6 mb-10 flex items-center justify-center gap-20">
        <input
          type="file"
          name="screenshot"
          onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!e.target.files) return;
            const href = URL.createObjectURL(e.target.files[0]);
            // @ts-ignore
            setBlobState((prev) => [...prev, href]);
            // @ts-ignore
            dispatch(addImage({
              uuid: nanoid(),
              author: data.login,
            // @ts-ignore
              comments: [],
              src: href,
              creationDate: "not created yet"
            }))
          }}
        />
        <button
          className="bg-green-500 text-black rounded-md p-1.5 font-semibold"
          onClick={handleImageSending}
        >
          Save Changes
        </button>
      </form>
      <div className="flex flex-wrap gap-20 items-center justify-center my-20">
        {!isLoading ? (
          Object.values(imageSelector).map((img) => {
            const newComments:any = [];
            commentsSelector.forEach(comment => {
              // @ts-ignore
              if(comment.uuid === img.uuid) {
                newComments.push(comment)
              }
            })
            return (
              // @ts-ignore
              <ImagePlate key={img.uuid} img={img} currentUser={data.login} newComments={newComments.length > 0 && newComments} />
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
