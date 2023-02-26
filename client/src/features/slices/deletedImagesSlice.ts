import { createSlice, EntityId, PayloadAction } from "@reduxjs/toolkit";

type deleteImagesState = EntityId[];

const initialState: deleteImagesState = [];

const deletedImagesSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addDeletedImage(state, action) {
      if (!state.includes(action.payload)) state.push(action.payload);
    },
  },
});

export const { addDeletedImage } = deletedImagesSlice.actions;
export default deletedImagesSlice.reducer;
