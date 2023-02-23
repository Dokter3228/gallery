import mongoose, { Schema } from "mongoose";
import { Comment } from "./comments";

const imageSchema = new mongoose.Schema({
  author: {
    required: true,
    type: String,
  },
  uuid: {
    required: true,
    type: String,
  },
  creationDate: {
    require: true,
    type: String,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  src: {
    type: String,
    require: true,
  },
});

export default mongoose.model("Image", imageSchema);

// {
//     href: "http://localhost:17214/image3434l;jkl"
//     author: "Vasia",
//     uuid: "123123asd",
//     creationDate: Date.now(),
//     updatedDate: Date.now(),
//     comments: ['sadfasdas',"SADASDSA"]
// }
