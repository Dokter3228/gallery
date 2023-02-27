import { createEntityAdapter, createSlice, EntityId } from "@reduxjs/toolkit";

export type Image = {
  author: string;
  comments: Comment[];
  creationDate: string;
  src: string;
  uuid: EntityId;
};

export type Comment = {
  uuid: any;
  author: string;
  text: string;
};

const imagesAdapter = createEntityAdapter<Image>({
  selectId: (image) => image.uuid,
});

const imagesSlice = createSlice({
  name: "images",
  initialState: imagesAdapter.getInitialState(),
  reducers: {
    setAllImages: imagesAdapter.setAll,
    addImage: imagesAdapter.addOne,
    deleteImage: imagesAdapter.removeOne,
    deleteComment: imagesAdapter.updateOne,
  },
});

export const { setAllImages, addImage, deleteImage, deleteComment } =
  imagesSlice.actions;
export default imagesSlice.reducer;
