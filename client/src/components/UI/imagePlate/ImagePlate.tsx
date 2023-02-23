import React, {  useState } from "react";
import { useSetImageCommentMutation } from "../../../features/api/imagesApi";
import {Comment, Image, addComment} from "../../../features/images/imagesSlice";
import { Simulate } from "react-dom/test-utils";
import {useAppDispatch} from "../../../hooks";

type ImagePlateProps = {
    img: Image,
    key: string,
    currentUser: string
}
const ImagePlate: React.FC<ImagePlateProps> = (props) => {
  const [comment, setComment] = useState("");
  const [setImageComment] = useSetImageCommentMutation();

  const dispatch = useAppDispatch()
  const handleCommentSending = (e: React.FormEvent) => {
    e.preventDefault();
    setImageComment({
        comment,
        author: props.currentUser,
        uuid: props.img.uuid
    })
    //   dispatch(
    //   addComment({
    //     uuid: props.img.uuid,
    //   // @ts-ignore
    //     comments: [
    //       ...props.img.comments,
    //       {
    //         author: props.currentUser,
    //         text: comment,
    //       },
    //     ],
    //   })
    // );
    setComment("");
  };
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
      </div>
    </div>
  );
};

export default ImagePlate;
