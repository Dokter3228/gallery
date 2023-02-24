import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { extendedUsersApi } from "../api/usersApi";

export interface User {
  login: string | null;
}

const initialState: User = {
  login: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      extendedUsersApi.endpoints.checkAuth.matchFulfilled,
      (state, action: PayloadAction<User>) => {
        state.login = action.payload.login;
      }
    );
  },
});

export default userSlice.reducer;
