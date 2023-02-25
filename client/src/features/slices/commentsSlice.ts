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
    reset: (state) => {
      state.comments = [];
    },
  },
});

export const { addComment, reset } = commentsSlice.actions;
export default commentsSlice.reducer;
