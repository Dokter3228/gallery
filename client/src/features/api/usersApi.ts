import { usersApiTagged } from "./emptySplitApi";

export const extendedUsersApi = usersApiTagged.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: "/users/login",
        method: "POST",
        body,
        credentials: "include",
      }),
    }),
    checkUser: builder.mutation({
      query: (body) => ({
        url: "/users/checkAuth",
        method: "POST",
        body,
        credentials: "include",
      }),
    }),
    logout: builder.mutation({
      query: (body) => ({
        url: "/users/logout",
        method: "POST",
        body,
        credentials: "include",
      }),
    }),
    signup: builder.mutation({
      query: (body) => ({
        url: "/users/registration",
        method: "POST",
        body,
        credentials: "include",
      }),
    }),
    checkCookie: builder.mutation({
      query: (body) => ({
        url: "/users/checkCookie",
        method: "POST",
        body,
        credentials: "include",
      }),
    }),
    currentUser: builder.query({
      query: (body) => ({
        url: "/users/current-user",
        method: "POST",
        body,
        credentials: "include",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useCheckUserMutation,
  useCheckCookieMutation,
  useCurrentUserQuery
} = extendedUsersApi;
