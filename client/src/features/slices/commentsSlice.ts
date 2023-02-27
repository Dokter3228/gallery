import { createSlice, EntityId, PayloadAction, Slice } from "@reduxjs/toolkit";
import { extendedImagesApi } from "../api/imagesApi";

// TODO add relative import this types to server

export type Comment = {
  text: string;
  author: string;
  uuid: EntityId; // uuid of comment
  image_id: EntityId; // uuid of comment
  new?: boolean;
  updated?: boolean;
};

interface CommentsState {
  comments: Comment[];
}

const initialState: CommentsState = {
  comments: [],
};

// TODO refactor to EntityProvider

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    addComment(state, action: PayloadAction<Comment>) {
      state.comments.push(action.payload);
    },
    deleteComment(state, action: PayloadAction<EntityId>) {
      for (let comment of state.comments) {
        if (comment.uuid === action.payload) {
          // @ts-ignore
          const index = state.comments.indexOf(comment);
          state.comments.splice(index, 1);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      extendedImagesApi.endpoints.postImagesComments.matchFulfilled,
      (state, action) => {
        state.comments = [];
      }
    );
  },
});

export const { addComment, reset, deleteComment } = commentsSlice.actions;
export default commentsSlice.reducer;
