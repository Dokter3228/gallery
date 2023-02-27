import React, { useEffect } from "react";
import { useState } from "react";
import {
  useCheckAuthMutation,
  useCurrentUserQuery,
} from "../../features/api/usersApi";
import {
  useAddImageMutation,
  useDeleteCommentsMutation,
  useDeleteImageMutation,
  useGetImagesQuery,
  useSetImageCommentsMutation,
} from "../../features/api/imagesApi";
import Logout from "../Logout/Logout";
import { useNavigate } from "react-router-dom";
import ImagePlate from "../UI/imagePlate/ImagePlate";
import { useAppSelector } from "../../App/store";
import { useAppDispatch } from "../../hooks";
import { addImage } from "../../features/slices/imagesSlice";
import { nanoid } from "@reduxjs/toolkit";
import { StoreComment } from "../../features/slices/commentsSlice";
import comment from "../UI/imagePlate/Comment";

const App = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // @ts-ignore
  const imageSelector = useAppSelector((state) => state.images.entities);
  const commentsSelector = useAppSelector(
    (state: any): StoreComment[] => state.comments.comments
  );
  const deletedImagesSelector = useAppSelector((state) => state.deletedImages);
  // @ts-ignore
  const { data } = useCurrentUserQuery();
  const [checkIfUserAuthorized, { isLoading, isSuccess, error, isError }] =
    useCheckAuthMutation();

  useEffect(() => {
    const redirectIfNoCookie = async () => {
      const res = await checkIfUserAuthorized();
      // @ts-ignore
      if (res?.error) {
        navigate("/login");
      }
    };
    redirectIfNoCookie();
  }, []);

  const [blobState, setBlobState] = useState<string[]>([]);

  const { isLoading: isImagesLoading } = useGetImagesQuery();
  const [addImageToServer] = useAddImageMutation();
  const [setImageComments] = useSetImageCommentsMutation();
  const [deleteImageFromTheServer] = useDeleteImageMutation();
  const [deleteCommentsFromImage] = useDeleteCommentsMutation();

  if (isImagesLoading) {
    return <h1>Wait pls!</h1>;
  }

  const handleSavingChanges = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    let newComments: any = [];
    for (let image of Object.values(imageSelector)) {
      // @ts-ignore
      if (image.creationDate === "not created yet") {
        // @ts-ignore
        let blob = await fetch(image.src).then((r) => r.blob());
        const myFile = new File([blob], "image.jpeg", {
          type: "image/file",
        });
        let formData = new FormData();
        formData.append("image", myFile);
        if (data !== undefined) formData.append("login", data.login);
        // @ts-ignore
        formData.append("uuid", image.uuid);
        addImageToServer(formData);
      } else {
        // @ts-ignore
        // @ts-ignore
        // newComments = newComments.concat(image.comments);
        // console.log("new comments --- ", newComments);
        // await deleteCommentsFromImage({
        //   // @ts-ignore
        //   id: image.uuid,
        //   // @ts-ignore
        //   comments: image.comments,
        // });
      }
      setBlobState([]);
    }
    setTimeout(() => {
      // @ts-ignore
      setImageComments({ comments: commentsSelector });
    }, 1000);
    for (let deletedImageUuid of deletedImagesSelector) {
      deleteImageFromTheServer(deletedImageUuid);
    }
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
            dispatch(
              addImage({
                uuid: nanoid(),
                author: data !== undefined ? data.login : "unknown author",
                // @ts-ignore
                comments: [],
                src: href,
                creationDate: "not created yet",
              })
            );
          }}
        />
        <button
          className="bg-green-500 text-black rounded-md p-1.5 font-semibold"
          onClick={handleSavingChanges}
        >
          Save Changes
        </button>
      </form>
      <div className="flex flex-wrap gap-20 items-center justify-center my-20">
        {!isLoading ? (
          Object.values(imageSelector).map((img) => {
            const newComments: any = [];
            commentsSelector.forEach((comment) => {
              // @ts-ignore
              if (comment.uuid === img.uuid) {
                newComments.push(comment);
              }
            });
            return (
              <ImagePlate
                // @ts-ignore
                key={img.uuid}
                // @ts-ignore
                img={img}
                currentUser={data !== undefined ? data.login : "unknown author"}
                newComments={newComments.length > 0 && newComments}
              />
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
