import mongoose, { ObjectId } from "mongoose";

const imageCommentSchema = new mongoose.Schema<CommentType>({
  author: String,
  text: String,
  new: Boolean,
});

const Comment = mongoose.model<CommentType>("Comment", imageCommentSchema);

export type CommentType = {
  author: string;
  text: string;
  creation_date?: string;
  update_date?: string;
  new?: boolean;
  _id?: ObjectId | string;
};

export { Comment };
