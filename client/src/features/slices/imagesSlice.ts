import { createEntityAdapter, createSlice, EntityId } from "@reduxjs/toolkit";
import { api } from "../api/emptySplitApi";
import { extendedImagesApi } from "../api/imagesApi";
import { reset } from "./commentsSlice";

export type Image = {
  author: string;
  comments: Comment[];
  creationDate: string;
  src: string;
  uuid: EntityId;
  new?: boolean;
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
  extraReducers: (builder) => {
    builder.addMatcher(
      extendedImagesApi.endpoints.getImages.matchFulfilled,
      (state, action) => {
        imagesAdapter.setAll(state, action.payload.data);
      }
    );
    builder.addMatcher(
      extendedImagesApi.endpoints.deleteImage.matchFulfilled,
      (state, action) => {
        imagesAdapter.removeOne(state, action.payload.id);
      }
    );
    builder.addMatcher(
      extendedImagesApi.endpoints.postImagesComments.matchFulfilled,
      (state, action) => {
        imagesAdapter.removeOne(state, action.payload.id);
      }
    );
  },
});

export const { setAllImages, addImage, deleteImage, deleteComment } =
  imagesSlice.actions;
export default imagesSlice.reducer;
