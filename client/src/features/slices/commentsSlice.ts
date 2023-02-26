import { createSlice, EntityId, PayloadAction, Slice } from "@reduxjs/toolkit";

export type StoreComment = {
  text: string;
  author: string;
  uuid: EntityId;
};
interface CommentsState {
  comments: StoreComment[];
}

const initialState: CommentsState = {
  comments: [],
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    addComment(state, action: PayloadAction<StoreComment>) {
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
    reset: (state) => {
      state.comments = [];
    },
  },
});

export const { addComment, reset, deleteComment } = commentsSlice.actions;
export default commentsSlice.reducer;
