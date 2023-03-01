import { createEntityAdapter, createSlice, EntityId } from "@reduxjs/toolkit";
import { api } from "../api/emptySplitApi";
import { extendedImagesApi } from "../api/imagesApi";
import { Comment } from "./commentsSlice";
export type Image = {
  author: string;
  comments: Comment[];
  creationDate: string;
  src: string;
  _id: EntityId;
  new?: boolean;
  deleted?: boolean;
};

const imagesAdapter = createEntityAdapter<Image>({
  selectId: (image) => image._id,
});

const imagesSlice = createSlice({
  name: "images",
  initialState: imagesAdapter.getInitialState(),
  reducers: {
    setAllImages: imagesAdapter.setAll,
    addImage: imagesAdapter.addOne,
    changeImage: imagesAdapter.updateOne,
    deleteImage: imagesAdapter.removeOne,
    deleteComment: imagesAdapter.updateOne,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      extendedImagesApi.endpoints.getImages.matchFulfilled,
      (state, action) => {
        imagesAdapter.setAll(state, action.payload);
      }
    );
    builder.addMatcher(
      extendedImagesApi.endpoints.deleteImage.matchFulfilled,
      (state, action) => {
        imagesAdapter.removeOne(state, action.payload._id);
      }
    );
    builder.addMatcher(
      extendedImagesApi.endpoints.postImagesComments.matchFulfilled,
      (state, action) => {}
    );
  },
});

export const {
  setAllImages,
  addImage,
  deleteImage,
  deleteComment,
  changeImage,
} = imagesSlice.actions;
export default imagesSlice.reducer;
