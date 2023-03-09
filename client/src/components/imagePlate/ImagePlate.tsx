import React, { useState } from "react";
import {
  changeImage,
  deleteImage,
  Image,
} from "../../features/slices/imagesSlice";
import { useAppDispatch } from "../../hooks";
import { addComment, deleteComment } from "../../features/slices/commentsSlice";
import { Comment } from "../../features/slices/commentsSlice";
import { useDeleteImageMutation } from "../../features/api/imagesApi";
import { useAppSelector } from "../../App/store";
import CommentPlate from "./Comment";
import { Simulate } from "react-dom/test-utils";
import change = Simulate.change;
import { EntityId, nanoid } from "@reduxjs/toolkit";

type ImagePlateProps = {
  img: Image;
  currentUser: string;
  newComments: Comment[];
};

const ImagePlate = (props: ImagePlateProps): JSX.Element => {
  const [comment, setComment] = useState("");
  const [deleteImageFromTheServer] = useDeleteImageMutation();
  const dispatch = useAppDispatch();
  const images = useAppSelector((state) =>
    Object.values(state.images.entities)
  );
  const allComments = useAppSelector((state) => Object.values(state.comments));
  const handleCommentSending = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      addComment({
        _id: nanoid(),
        text: comment,
        author: props.currentUser,
        uuid: props.img._id,
        new: true,
      })
    );
    setComment("");
  };

  function handleImageDeleting() {
    if (props.img.new) {
      images.forEach((image) => {
        if (image == undefined) return;
        if (image._id === props.img._id) dispatch(deleteImage(props.img._id));
      });
      // allComments.forEach((comment) => {
      //   if (comment.uuid === props.img._id) {
      //     dispatch(deleteComment(comment._id));
      //   }
      // });
    } else {
      images.forEach((image) => {
        if (image == undefined) return;
        if (image._id === props.img._id)
          dispatch(
            changeImage({ id: props.img._id, changes: { deleted: true } })
          );
      });
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
              <div key={index} className="text-black flex justify-between m-2 ">
                <CommentPlate key={index} comment={comment} img={props.img} />
              </div>
            );
          })}
        {props.newComments &&
          props.newComments.map((comment, index) => {
            return (
              <div key={index} className="text-black flex justify-between m-2 ">
                <h1 className="text-2xl">{comment.author}</h1>
                <p>{comment.text}</p>
                <button
                  onClick={() => {
                    dispatch(deleteComment(comment._id));
                  }}
                  className="bg-red-500 text-black rounded-md w-8 h-8 font-semibold"
                >
                  X
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ImagePlate;
