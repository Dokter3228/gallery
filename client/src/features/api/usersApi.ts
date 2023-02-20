import {usersApiTagged} from "./emptySplitApi";

export const extendedUsersApi = usersApiTagged.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (body) => ({
                url: "/users/login",
                method: "POST",
                body,
                credentials: 'include'
            }),
        }),
        checkUser: builder.mutation({
            query: (body) => ({
                url: "/users/getUser",
                method: "POST",
                body,
                credentials: 'include'
            }),
        }),
        logout: builder.mutation({
            query: (body) => ({
                url: "/users/logout",
                method: "POST",
                body,
                credentials: 'include'
            }),
        }),
        signup: builder.mutation({
            query: (body) => ({
                url: "/users/newUser",
                method: "POST",
                body,
                credentials: 'include'
            }),
        })
    }),
  overrideExisting: false,
})

export const { useLoginMutation, useSignupMutation, useLogoutMutation, useCheckUserMutation } = extendedUsersApi


// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
//
// export const usersApi = createApi({
//     reducerPath: 'users',
//     baseQuery: fetchBaseQuery({
//         baseUrl: 'http://localhost:17548/',
//         credentials: 'include'
//     }),
//     tagTypes: ['Users'],
//     endpoints: (builder) => ({
//         login: builder.mutation({
//             query: (body) => ({
//                 url: "/users/login",
//                 method: "POST",
//                 body,
//                 credentials: 'include'
//             }),
//         }),
//         checkUser: builder.mutation({
//             query: (body) => ({
//                 url: "/users/getUser",
//                 method: "POST",
//                 body,
//                 credentials: 'include'
//             }),
//         }),
//         logout: builder.mutation({
//             query: (body) => ({
//                 url: "/users/logout",
//                 method: "POST",
//                 body,
//                 credentials: 'include'
//             }),
//         }),
//         signup: builder.mutation({
//             query: (body) => ({
//                 url: "/users/newUser",
//                 method: "POST",
//                 body,
//             }),
//         })
//     }),
// })
// export const { useLoginMutation , useSignupMutation, useLogoutMutation, useCheckUserMutation } = usersApi
