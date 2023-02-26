import React, { useState } from "react";
import { Comment, Image } from "../../../features/slices/imagesSlice";
import { Simulate } from "react-dom/test-utils";
import { useAppDispatch } from "../../../hooks";

import { addComment } from "../../../features/slices/commentsSlice";
import { useDeleteImageMutation } from "../../../features/api/imagesApi";

type ImagePlateProps = {
  img: Image;
  currentUser: string;
  newComments: [
    {
      author: string;
      uuid: string;
      text: string;
    }
  ];
};

const ImagePlate = (props: ImagePlateProps): JSX.Element => {
  const [comment, setComment] = useState("");

  const [deleteImageFromTheServer] = useDeleteImageMutation();
  const dispatch = useAppDispatch();
  const handleCommentSending = (e: React.FormEvent) => {
    e.preventDefault();
    // @ts-ignore
    dispatch(
      addComment({
        text: comment,
        author: props.currentUser,
        uuid: props.img.uuid,
      })
    );
    setComment("");
  };

  function handleImageDeleting() {
    if (props.img.creationDate === "not created yet") {
      console.log("remove from the state");
    } else {
      deleteImageFromTheServer(props.img.uuid);
    }
  }

  return (
    <div>
      <img className="rounded-2xl w-full h-52 h-22" src={props.img.src} />
      <h3 className="text-center">
        Author: <span className="font-bold ">{props.img.author}</span>
      </h3>
      <h3 className="text-center">
        Creation Date:{" "}
        <span className="font-bold ">{props.img.creationDate}</span>
      </h3>
      <div className="flex justify-between items-center ">
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          name="myInput"
          className="text-black p-1 rounded-md"
          type="text"
          placeholder="leave a comment"
        />
        <button
          onClick={handleCommentSending}
          type="submit"
          className="bg-green-500 text-black rounded-md p-1 m-2 font-semibold"
        >
          Send
        </button>
        <button
          onClick={handleImageDeleting}
          type="submit"
          className="bg-red-500 text-black rounded-md p-1 m-2 font-semibold"
        >
          Delete
        </button>
      </div>
      <div className="bg-gray-50 rounded-md p-4">
        <h1 className="text-black">Comments: </h1>
        {props.img &&
          props.img?.comments?.length > 0 &&
          props.img.comments.map((comment, index) => {
            return (
              <div
                key={index}
                className="text-black flex justify-between mx-2 "
              >
                <h1 className="text-2xl">{comment.author}</h1>
                <p>{comment.text}</p>
              </div>
            );
          })}
        {props.newComments &&
          props.newComments.map((comment, index) => {
            return (
              <div
                key={index}
                className="text-black flex justify-between mx-2 "
              >
                <h1 className="text-2xl">{comment.author}</h1>
                <p>{comment.text}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ImagePlate;
