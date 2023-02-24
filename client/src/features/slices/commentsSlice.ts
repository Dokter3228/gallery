import {
  createEntityAdapter,
  createSlice,
  EntityId,
  PayloadAction,
  Slice,
} from "@reduxjs/toolkit";
import { extendedImagesApi } from "../api/imagesApi";

// TODO add relative import this types to server

export type Comment = {
  text: string;
  author: string;
  uuid: EntityId; // uuid of image
  _id: EntityId; // uuid of comment
  new?: boolean;
  updated?: boolean;
};

const commentsAdapter = createEntityAdapter<Comment>({
  selectId: (comment) => comment._id,
});

const commentsSlice = createSlice({
  name: "Comments",
  initialState: commentsAdapter.getInitialState(),
  reducers: {
    addComment: commentsAdapter.addOne,
    deleteComment: commentsAdapter.removeOne,
    reset: commentsAdapter.removeAll,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      extendedImagesApi.endpoints.postImagesComments.matchFulfilled,
      (state, action) => {
        commentsAdapter.removeAll(state);
      }
    );
  },
});

export const { addComment, deleteComment } = commentsSlice.actions;
export default commentsSlice.reducer;
