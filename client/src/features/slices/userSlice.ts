import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { extendedUsersApi } from "../api/usersApi";

export interface User {
  login: string;
}

const initialState: User = {
  login: "nobody",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      extendedUsersApi.endpoints.currentUser.matchFulfilled,
      (state, action: PayloadAction<User>) => {
        state.login = action.payload.login;
      }
    );
  },
});

export default userSlice.reducer;
