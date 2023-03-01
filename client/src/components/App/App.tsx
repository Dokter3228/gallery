import React, { useEffect } from "react";
import { useState } from "react";
import { useCheckAuthQuery } from "../../features/api/usersApi";
import {
  useAddImageMutation,
  useDeleteCommentsMutation,
  useDeleteImageMutation,
  useGetImagesQuery,
  usePatchImageCommentsMutation,
} from "../../features/api/imagesApi";
import Logout from "../Logout/Logout";
import ImagePlate from "../UI/imagePlate/ImagePlate";
import { useAppSelector } from "../../App/store";
import { useAppDispatch } from "../../hooks";
import { addImage, Image } from "../../features/slices/imagesSlice";
import { nanoid } from "@reduxjs/toolkit";
import { Comment } from "../../features/slices/commentsSlice";

const App = (): JSX.Element => {
  useCheckAuthQuery();
  useGetImagesQuery();
  const dispatch = useAppDispatch();
  const imageSelector = useAppSelector((state) =>
    Object.values(state.images.entities)
  );
  const commentsSelector = useAppSelector(
    // @ts-ignore
    (state): Comment[] => Object.values(state.comments.entities)
  );
  const currentUser = useAppSelector((state) => state.user.login);
  const [blobState, setBlobState] = useState<string[]>([]);

  const [addImageToServer] = useAddImageMutation();
  const [deleteImageFromTheServer] = useDeleteImageMutation();
  const [deleteCommentsFromImage] = useDeleteCommentsMutation();
  const [patchComments] = usePatchImageCommentsMutation();
  const handleSavingChanges = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (imageSelector.length <= 0) return;
    for (let image of imageSelector) {
      if (!image) continue;
      if (image.deleted) {
        deleteImageFromTheServer(image._id);
      }
      if (image.new) {
        let blob = await fetch(image.src).then((r) => r.blob());
        const myFile = new File([blob], "image.jpeg", {
          type: "image/file",
        });
        let formData = new FormData();
        formData.append("image", myFile);
        if (currentUser) formData.append("author", currentUser);
        addImageToServer(formData);
      } else {
        for (let comment of commentsSelector) {
          const res = [];
          if (comment.uuid === image._id) {
            res.push(comment);
          }
          patchComments({
            id: image._id,
            author: currentUser,
            comments: res,
          });
        }
      }

      setBlobState([]);
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
            setBlobState((prev) => [...prev, href]);
            dispatch(
              addImage({
                _id: nanoid(),
                author: currentUser || "unknown",
                comments: [],
                src: href,
                creationDate: "not created yet",
                new: true,
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
        {imageSelector ? (
          imageSelector.map((img) => {
            if (!img) return;
            if (img.deleted) return;
            return (
              <ImagePlate
                key={img._id}
                img={img}
                currentUser={currentUser || "unknown"}
                newComments={commentsSelector.filter(
                  (comment) => comment.uuid === img._id
                )}
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
