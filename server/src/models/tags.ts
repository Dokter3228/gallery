import mongoose, { ObjectId } from "mongoose";

const imageTagSchema = new mongoose.Schema<TagType>({
  name: String,
  author: String,
});

const Tag = mongoose.model<TagType>("Tag", imageTagSchema);

export type TagType = {
  name: string;
  _id: ObjectId | string;
  imageId: ObjectId | string;
  new?: boolean;
  author: string;
};

export { Tag };
