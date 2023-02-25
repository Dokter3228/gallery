import {api} from "./emptySplitApi";
import { setAllImages } from "../images/imagesSlice";
import {Image} from "../images/imagesSlice";
import {reset} from "../images/commentsSlice";
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
      providesTags: (result, error, arg) => result
          ? [
              ...result.map(({ uuid }) => ({ type: "Images" as const, uuid })),
              "Images",
            ]
          : ["Images"]
    }),
    addImage: builder.mutation({
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
    setImageComment: builder.mutation({
      query: (body) => ({
        url: "/images/1",
        method: "PUT",
        body,
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
          const { data } = await queryFulfilled;
          dispatch(reset())
      },
      invalidatesTags: ["Images"],
    }),
    setImageComments: builder.mutation({
      query: (body) => ({
        url: "/images/comments/",
        method: "POST",
        body,
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
          const { data } = await queryFulfilled;
          dispatch(reset())
      },
      invalidatesTags: ["Images"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetImagesQuery,
  useAddImageMutation,
  useSetImageCommentMutation,
    useSetImageCommentsMutation
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
//             query: () => '/images/allImages',
//             providesTags: (result, error, arg) =>
//                 result
//                     // @ts-ignore
//                     ? [...result.map(({ uuid }) => ({ type: 'Images' as const, uuid })), 'Images']
//                     : ['Images'],
//         }),
//         addImage: builder.mutation({
//             query: (body) => ({
//                 url: "/images/image/1",
//                 method: "POST",
//                 body,
//             }),
//             invalidatesTags: ["Images"]
//         })
//     }),
// })

// export const { useGetImagesQuery, useAddImageMutation } = imagesApi
