import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
export const imagesApi = createApi({
    reducerPath: 'getImages',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:17548/',
    }),
    tagTypes: ['Images'],
    endpoints: (builder) => ({
        getImages: builder.query({
            query: () => '/images/allImages',
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
            }),
            invalidatesTags: ["Images"]
        })
    }),
})
export const { useGetImagesQuery, useAddImageMutation } = imagesApi