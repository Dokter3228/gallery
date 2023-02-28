import { api } from "./emptySplitApi";
import {  setAllImages } from "../slices/imagesSlice";
import { Image } from "../slices/imagesSlice";
import { Comment } from "../slices/commentsSlice";
import { EntityId } from "@reduxjs/toolkit";

type Comments = {
  comments: Comment[];
};
export const extendedImagesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getImages: builder.query<Image[], void>({
      keepUnusedDataFor: 0,
      query: () => "/images/",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ uuid }) => ({ type: "Images" as const, uuid })),
              "Images",
            ]
          : ["Images"],
    }),
    addImage: builder.mutation<Image[], FormData>({
      query: (body) => ({
        url: "/images/1",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Images"],
    }),
    deleteImage: builder.mutation<void, EntityId>({
      query: (id) => ({
        url: `/images/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Images", "Users"],
    }),
    deleteComments: builder.mutation<
      void,
      { id: EntityId; comments: object[] }
    >({
      query: (body) => ({
        url: `/images/${body.id}/comments`,
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Images", "Users"],
    }),
    // FiXME refactor to convention
    // CONVENTION VERB/URL setImageComments -> postImagesComments
    postImagesComments: builder.mutation<void, Comments>({
      query: (body) => ({
        url: "/images/comments/",
        // FXIME refactor to Patch
        method: "POST",
        body,
      }),
      invalidatesTags: ["Images"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetImagesQuery,
  useAddImageMutation,
  useDeleteCommentsMutation,
  useDeleteImageMutation,
} = extendedImagesApi;

// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// export const imagesApi = createApi({
//     reducerPath: 'getImages',
//     baseQuery: fetchBaseQuery({
//         baseUrl: 'http://localhost:17548/',
//     }),
//     tagTypes: ['Images'],
//     endpoints: (builder) => ({
//         getImages: builder.query({
//             query: () => '/slices/allImages',
//             providesTags: (result, error, arg) =>
//                 result
//                     // @ts-ignore
//                     ? [...result.map(({ uuid }) => ({ type: 'Images' as const, uuid })), 'Images']
//                     : ['Images'],
//         }),
//         addImage: builder.mutation({
//             query: (body) => ({
//                 url: "/slices/image/1",
//                 method: "POST",
//                 body,
//             }),
//             invalidatesTags: ["Images"]
//         })
//     }),
// })

// export const { useGetImagesQuery, useAddImageMutation } = imagesApi
