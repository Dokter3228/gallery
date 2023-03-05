import mongoose, { ObjectId, Schema, Types } from "mongoose";
import { Comment, CommentType } from "./comments";

export type Image = {
  author: string;
  creationDate: string;
  src: string;
  comments: [ObjectId | string];
};

const imageSchema = new mongoose.Schema<Image>({
  author: {
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

export default mongoose.model<Image>("Image", imageSchema);
