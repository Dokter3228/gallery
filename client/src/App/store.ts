import { configureStore } from '@reduxjs/toolkit'
import addImage from "../features/images/imagesSlice";
import {imagesApi} from "../features/api/imagesApi";
export const store = configureStore({
    reducer: {
        [imagesApi.reducerPath]: imagesApi.reducer,
        images: addImage
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(imagesApi.middleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch