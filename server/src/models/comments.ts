import mongoose, { ObjectId } from "mongoose";

const imageCommentSchema = new mongoose.Schema<CommentType>({
  author: String,
  text: String,
});

const Comment = mongoose.model<CommentType>("Comment", imageCommentSchema);

export type CommentType = {
  author: string;
  text: string;
  _id: ObjectId | { author: string; text: string };
};

export { Comment };
