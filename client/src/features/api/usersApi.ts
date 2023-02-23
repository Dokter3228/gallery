import { api } from "./emptySplitApi";

export const extendedUsersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: "/users/login",
        method: "POST",
        body,
      }),
    }),
    checkUser: builder.mutation({
      query: (body) => ({
        url: "/users/checkAuth",
        method: "POST",
        body,
      }),
    }),
    logout: builder.mutation({
      query: (body) => ({
        url: "/users/logout",
        method: "POST",
        body,
      }),
    }),
    signup: builder.mutation({
      query: (body) => ({
        url: "/users/registration",
        method: "POST",
        body,
      }),
    }),
    checkCookie: builder.mutation({
      query: (body) => ({
        url: "/users/checkCookie",
        method: "POST",
        body,
      }),
    }),
    currentUser: builder.query({
      query: (body) => ({
        url: "/users/current-user",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

// TODO add types
export const config = api.injectEndpoints({
  endpoints: (builder) => ({
    getConfig: builder.query({
      query: () => "/config",
    }),
  }),
});

export const { useGetConfigQuery } = config;
export const {
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useCheckUserMutation,
  useCheckCookieMutation,
  useCurrentUserQuery,
} = extendedUsersApi;
