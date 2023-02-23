import mongoose, {Schema} from "mongoose";
import {Comment} from "./comments";
import Image from "./image";

export type UserType = {
  login: string;
  password: string
  name?: string;
  avatar?: string;
  images: [string];
  comments: [string];
};

const userSchema = new mongoose.Schema<UserType>({
  login: {
    required: true,
    type: String,
  },
  name: {
    type: String
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
