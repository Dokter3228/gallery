import mongoose, { Schema } from "mongoose";
import { Comment, CommentType } from "./comments";
import Image from "./image";

export type UserType = {
  login: string;
  password: string;
  name?: string;
  avatar?: string;
  images: [string];
  comments: CommentType[];
  isAdmin: boolean;
};

const userSchema = new mongoose.Schema<UserType>({
  login: {
    required: true,
    type: String,
  },
  name: {
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  avatar: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    required: true,
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
      ref: "Image",
    },
  ],
});

export default mongoose.model("User", userSchema);
