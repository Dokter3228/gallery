import {imagesApiTagged} from "./emptySplitApi";

export const extendedImagesApi = imagesApiTagged.injectEndpoints({
  endpoints: (builder) => ({
    getImages: builder.query({
            query: () => '/images/',
            providesTags: (result, error, arg) =>
                result
                    // @ts-ignore
                    ? [...result.map(({ uuid }) => ({ type: 'Images' as const, uuid })), 'Images']
                    : ['Images'],
        }),
       addImage: builder.mutation({
            query: (body) => ({
                url: "/images/image/1",
                method: "POST",
                body,
                credentials: "include"
            }),
            invalidatesTags: ["Images"]
        })
  }),
  overrideExisting: false,
})

export const { useGetImagesQuery, useAddImageMutation } = extendedImagesApi


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
