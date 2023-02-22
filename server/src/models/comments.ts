import mongoose from "mongoose";


const imageCommentSchema = new mongoose.Schema({
  author: String,
  text: String
})

const Comment = mongoose.model('Comment', imageCommentSchema)


export type CommentType = {
  author: string;
  text: string;
  // id: EntityId;
};

export {Comment}

