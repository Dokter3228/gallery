import React, { useEffect } from "react";
import { useState } from "react";
import { useCheckUserMutation } from "../../features/api/usersApi";
import {
  useAddImageMutation,
  useGetImagesQuery,
  useSetImageCommentMutation, useSetImageCommentsMutation,
} from "../../features/api/imagesApi";
import {
  useCheckCookieMutation,
  useCurrentUserQuery,
} from "../../features/api/usersApi";
import Logout from "../Logout/Logout";
import { useNavigate } from "react-router-dom";
import ImagePlate from "../UI/imagePlate/ImagePlate";
import { useAppSelector } from "../../App/store";
import { useAppDispatch } from "../../hooks";
import {addImage} from "../../features/images/imagesSlice";
import {nanoid} from "@reduxjs/toolkit";
import {reset} from "../../features/images/commentsSlice";



const App = (): JSX.Element => {
  // @ts-ignore
  const imageSelector = useAppSelector((state) => state.images.entities);
  const commentsSelector = useAppSelector(state => state.comments.comments)

  const navigate = useNavigate();
  const [checkCookie] = useCheckCookieMutation();
  // FIXME
  const { data: { author } = {} } = useCurrentUserQuery("");
  const [blobState, setBlobState] = useState<string[]>([]);

  const dispatch = useAppDispatch();
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

  const [selectedFile, setSelectedFile] = useState<File | string | Blob>("");
  const { data: imagesH, isLoading } = useGetImagesQuery();
  const [addImageToServer] = useAddImageMutation();
  const [checkIfUserExists] = useCheckUserMutation();
  const [setImageComment] = useSetImageCommentMutation();
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
        const {data} = await checkIfUserExists();
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
      // for(let comment of commentsSelector) {
      //   console.log(comment)
      //   setImageComment({
      //      // @ts-ignore
      //   comment: comment.comment,
      //   // @ts-ignore
      //   author: comment.author,
      //   // @ts-ignore
      //   uuid: comment.uuid,
      //   });
      // }
    setImageComments({comments: commentsSelector})
  };

  return (
    <div className="bg-gray-900 text-white px-6">
      <h1 className="text-3xl text-center py-10 ">Gallery main page</h1>
      {/*<h1 className="text-3xl text-center py-10 text-green-600">*/}
      {/*  Uploaded images*/}
      {/*</h1>*/}
      {/*<div className="mx-80 flex justify-center items-center gap-x-10">*/}
      {/*  {blobState &&*/}
      {/*    blobState.map((url) => {*/}
      {/*      return (*/}
      {/*        <img className="rounded-2xl w-60 h-22" src={url} alt="asdfas" />*/}
      {/*      );*/}
      {/*    })}*/}
      {/*</div>*/}
      <form className="text-center my-6 mb-10 flex items-center justify-center gap-20">
        <input
          type="file"
          name="screenshot"
          onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!e.target.files) return;
            setSelectedFile(e.target.files[0]);
            const href = URL.createObjectURL(e.target.files[0]);
            // @ts-ignore
            setBlobState((prev) => [...prev, href]);
            // @ts-ignore
            const { data } = await checkIfUserExists();
            dispatch(addImage({
              uuid: nanoid(),
              author: data.login,
            // @ts-ignore
              comments: [],
              src: href,
              creationDate: "not created yet"
            }))
            // @ts-ignore
            // dispatch(
            //     addImage( {
            //         author: "dfasdfa",
            //         comments: [
            //           {
            //             author: "asdfasdfa",
            //             text: "uploaded"
            //           }
            //         ],
            //         creationDate: "fasdfas",
            //         src: href,
            //         uuid: "dfasoudfhliawuehflaiw",
            //     })
            //   );
          }}
        />
        {/*<button onClick={(e) => upload(e)}>Upload the image</button>*/}
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
              <ImagePlate key={img.uuid} img={img} currentUser={author} newComments={newComments.length > 0 && newComments} />
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
