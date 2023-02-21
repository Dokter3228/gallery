import { configureStore } from "@reduxjs/toolkit";
import addImage from "../features/images/imagesSlice";
import { extendedImagesApi } from "../features/api/imagesApi";
import { extendedUsersApi } from "../features/api/usersApi";
import { emptySplitApi } from "../features/api/emptySplitApi";
import { TypedUseSelectorHook, useSelector } from "react-redux";
export const store = configureStore({
  reducer: {
    [emptySplitApi.reducerPath]: extendedImagesApi.reducer,
    [extendedUsersApi.reducerPath]: extendedUsersApi.reducer,
    images: addImage,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(emptySplitApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: // | TypedUseSelectorHook<ServiceStore>
TypedUseSelectorHook<RootState> = useSelector;
