import { configureStore } from '@reduxjs/toolkit'
import addImage from "../features/images/imagesSlice";
import {imagesApi} from "../features/api/imagesApi";
import {usersApi} from "../features/api/usersApi";
import {TypedUseSelectorHook, useSelector} from "react-redux";
export const store = configureStore({
    reducer: {
        [imagesApi.reducerPath]: imagesApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
        images: addImage
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(imagesApi.middleware, usersApi.middleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const useAppSelector: // | TypedUseSelectorHook<ServiceStore>
    TypedUseSelectorHook<RootState> = useSelector;