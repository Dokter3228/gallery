import React, {  useState } from "react";
import { useSetImageCommentMutation } from "../../../features/api/imagesApi";
import {Comment, Image, setComments} from "../../../features/images/imagesSlice";
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
    // setImageComment({
    //     comment,
    //     author: props.currentUser,
    //     uuid: props.img.uuid
    // })
      dispatch(
      setComments({
        uuid: props.img.uuid,
    // @ts-ignore
        comments: [
          ...props.img.comments,
          {
            author: props.currentUser,
            text: comment,
          },
        ],
      })
    );
    setComment("");
  };
  return (
    <div>
      <h1>{comment}</h1>
      <img className="rounded-2xl w-60 h-22" src={props.img.src} />
      <h3 className="text-center">
        Author: <span className="font-bold ">{props.img.author}</span>
      </h3>
      <h3 className="text-center">
        Creation Date:{" "}
        <span className="font-bold ">{props.img.creationDate}</span>
      </h3>
      <input
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        name="myInput"
        className="text-black"
        type="text"
        placeholder="leave a comment"
      />
      <button
        onClick={handleCommentSending}
        type="submit"
        className="text-black rounded-sm bg-green-400"
      >
        Send
      </button>
      <div className="bg-gray-50">
        <h1 className="text-black">Comments: </h1>
        {props.img &&
          props.img?.comments?.length > 0 &&
          props.img.comments.map((comment, index) => {
            console.log(props);
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
