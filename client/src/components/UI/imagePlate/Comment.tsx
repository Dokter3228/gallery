import React from "react";
import { useAppSelector } from "../../../App/store";
import { useAppDispatch } from "../../../hooks";
import { deleteComment } from "../../../features/slices/imagesSlice";
import { EntityId } from "@reduxjs/toolkit";

const CommentPlate = (props: {
  uuid: EntityId;
  img: any;
  author: string;
  text: string;
}) => {
  const allImages = useAppSelector((state) => state.images.entities);
  const dispatch = useAppDispatch();
  function handleCommentDeleting() {
    let filteredComments = [];
    for (let image of Object.values(allImages)) {
      // @ts-ignore
      if (image.uuid === props.img.uuid) {
        // @ts-ignore
        for (let comment of image.comments) {
          if (comment.uuid !== props.uuid) filteredComments.push(comment);
        }
      }
    }
    dispatch(
      deleteComment({
        id: props.img.uuid,
        changes: {
          comments: filteredComments,
        },
      })
    );
  }

  return (
    <>
      <h1 className="text-2xl">{props.author}</h1>
      <p>{props.text}</p>
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
