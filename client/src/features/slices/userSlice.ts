import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  login: string;
}

const initialState: UserState = {
  login: "nobody",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    currentUserLogin(state, action: PayloadAction<string>) {
      state.login = action.payload;
    },
  },
});

export const { currentUserLogin } = userSlice.actions;
export default userSlice.reducer;
