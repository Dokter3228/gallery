import mongoose, { ObjectId, Schema } from "mongoose";

const imageCommentSchema = new mongoose.Schema<CommentType>({
  author: String,
  text: String,
  new: Boolean,
});

const Comment = mongoose.model<CommentType>("Comment", imageCommentSchema);

export type CommentType = {
  author: string;
  text: string;
  _id: ObjectId;
  creation_date: string;
  update_date: string;
  new?: boolean;
};

export { Comment };
