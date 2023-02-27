import mongoose, { ObjectId } from "mongoose";

const imageCommentSchema = new mongoose.Schema<CommentType>({
  author: String,
  text: String,
  id: String,
});

const Comment = mongoose.model<CommentType>("Comment", imageCommentSchema);

export type CommentType = {
  author: string;
  text: string;
  id: ObjectId;
};

export { Comment };
