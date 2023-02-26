import { createEntityAdapter, createSlice, EntityId } from "@reduxjs/toolkit";

export type Image = {
  author: string;
  comments: [Comment];
  creationDate: string;
  src: string;
  uuid: EntityId;
};

export type Comment = {
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
    addComment: imagesAdapter.upsertOne,
  },
});

export const { setAllImages, addImage, addComment, deleteImage } =
  imagesSlice.actions;
export default imagesSlice.reducer;
