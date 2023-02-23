import mongoose, {Schema} from "mongoose";
import {Comment} from "./comments";
import Image from "./image";

const userSchema = new mongoose.Schema({
  login: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  avatar: {
    type: String,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  images: [
    {
      type: Schema.Types.ObjectId,
      ref: "Image"
    }
  ]
});

export default mongoose.model("User", userSchema);
