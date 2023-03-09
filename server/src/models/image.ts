import mongoose, { Schema } from "mongoose";

export type Image = {
  author: string;
  creationDate: string;
  src: string;
  comments: string[];
  tags: string[];
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
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
  src: {
    type: String,
    require: true,
  },
});

export default mongoose.model<Image>("Image", imageSchema);
