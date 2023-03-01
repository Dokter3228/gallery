import mongoose, { Schema } from "mongoose";
import { Comment, CommentType } from "./comments";

export type UserType = {
  login: string;
  password: string;
  name?: string;
  avatar?: string;
  isAdmin?: boolean;
  images: [string];
  comments: CommentType[];
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
    default: false,
  },
  comments: [String],
  // but RETAINS FULL COMMENT ARRAY! NOT OBJECT IDS ARRAY
  // {
  //   type: Schema.Types.ObjectId,
  //       ref: "Comment",
  // },
  // but RETAINS FULL COMMENT ARRAY! NOT OBJECT IDS ARRAY
  images: [String],
});

export default mongoose.model<UserType>("User", userSchema);
