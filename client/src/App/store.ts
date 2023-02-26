import { configureStore } from "@reduxjs/toolkit";
import { api } from "../features/api/emptySplitApi";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import imagesReducer from "../features/slices/imagesSlice";
import commentsReducer from "../features/slices/commentsSlice";
import userReducer from "../features/slices/userSlice";
import deletedImagesReducer from "../features/slices/deletedImagesSlice";
export const store = configureStore({
  reducer: {
    images: imagesReducer,
    comments: commentsReducer,
    user: userReducer,
    deletedImages: deletedImagesReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: // | TypedUseSelectorHook<ServiceStore>
TypedUseSelectorHook<RootState> = useSelector;
