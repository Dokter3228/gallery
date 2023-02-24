import React from "react";
import { useAppSelector } from "../../../App/store";
import { useAppDispatch } from "../../../hooks";
import { EntityId } from "@reduxjs/toolkit";
import { Comment, deleteComment } from "../../../features/slices/commentsSlice";

const CommentPlate = (props: { img: any; comment: Comment }) => {
  const allImages = useAppSelector((state) => state.images.entities);
  const dispatch = useAppDispatch();
  function handleCommentDeleting() {
    // let filteredComments = [];
    // for (let image of Object.values(allImages)) {
    //   if (!image) continue;
    //   if (image._id === props.img._id) {
    //     for (let comment of image.comments) {
    //       if (comment.uuid !== props.uuid) filteredComments.push(comment);
    //     }
    //   }
    // }
    // dispatch(
    //   deleteComment({
    //     id: props.img.uuid,
    //     changes: {
    //       comments: filteredComments,
    //     },
    //   })
    // );
  }

  return (
    <>
      <h1 className="text-2xl">{props.comment.author}</h1>
      <p>{props.comment.text}</p>
      <button
        onClick={handleCommentDeleting}
        className="bg-red-500 text-black rounded-md w-8 h-8 font-semibold"
      >
        X
      </button>
    </>
  );
};

export default CommentPlate;
