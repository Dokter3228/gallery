import { api } from "./emptySplitApi";
import { Comment, setAllImages } from "../slices/imagesSlice";
import { Image } from "../slices/imagesSlice";
import { reset, StoreComment } from "../slices/commentsSlice";
import { EntityId } from "@reduxjs/toolkit";

type Comments = {
  comments: StoreComment[];
};
export const extendedImagesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getImages: builder.query<Image[], void>({
      keepUnusedDataFor: 0,
      query: () => "/images/",
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAllImages(data));
        } catch (err) {
          dispatch(setAllImages([]));
        }
      },
      providesTags: (result, error, arg) =>
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
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAllImages(data));
        } catch (err) {
          dispatch(setAllImages([]));
        }
      },
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
    setImageComments: builder.mutation<void, Comments>({
      query: (body) => ({
        url: "/images/comments/",
        method: "POST",
        body,
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(reset());
      },
      invalidatesTags: ["Images"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetImagesQuery,
  useAddImageMutation,
  useSetImageCommentsMutation,
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
