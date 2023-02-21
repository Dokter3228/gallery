import React, {useEffect, useState} from 'react';
import {useSetImageCommentMutation} from "../../../features/api/imagesApi";
import {useCurrentUserQuery} from "../../../features/api/usersApi";


const ImagePlate = (props) => {
    const imgSrc = "http://localhost:17548/images/" + props.img.uuid + ".jpeg";
    const [comment, setComment] = useState("")
    const [setImageComment] = useSetImageCommentMutation()
    const {data: {author} = {}} = useCurrentUserQuery("")
    const handleCommentSending = (e) => {
        e.preventDefault()
        setImageComment({
            comment,
            author,
            uuid: props.img.uuid
        })
    }
    return (
        <div>
            <h1>{comment}</h1>
            <img className="rounded-2xl w-60 h-22" src={imgSrc} />
            <h3 className="text-center">Author: <span className="font-bold " >{props.img.author}</span></h3>
            <input value={comment} onChange={(e) => setComment(e.target.value)} name="myInput" className="text-black"  type="text" placeholder="leave a comment" />
            <button onClick={handleCommentSending} type="submit" className="text-black rounded-sm bg-green-400">Send</button>
            <div className="bg-gray-50" >
                <h1 className="text-black">Comments: </h1>
                {props.img && props.img.comments.map((comment, index) => {
                      return <div key={index} className="text-black flex justify-between mx-2 " >
                          <h1 className="text-2xl">{comment.author}</h1>
                    <p >{comment.comment}</p>
                      </div>
                })}
            </div>
        </div>
    );
};

export default ImagePlate;
