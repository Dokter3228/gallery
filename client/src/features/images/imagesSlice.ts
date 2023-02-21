import { createEntityAdapter, createSlice, EntityId } from "@reduxjs/toolkit";
export interface ImagesState {
  imagesArray: string[];
}

export type Image = {
  id: EntityId;
  src: string;
  // comments : array of uniq comments from entityProvider of Comment
  comments: EntityId[];
  author: string;
};

export type Comment = {
  author: string;
  text: string;
  id: EntityId;
};

export const commentEntityAdapter = createEntityAdapter<Comment>({
  selectId: (comment) => {
    return comment.id;
  },
});

export const imageEntityAdapter = createEntityAdapter<Image>({
  selectId: (image) => {
    return image.id;
  },
});

const initialState: ImagesState = {
  imagesArray: [],
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    addImage: (state, action) => {
      state.imagesArray.push(action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { addImage } = counterSlice.actions;

export default counterSlice.reducer;
