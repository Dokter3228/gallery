import { api } from "./emptySplitApi";
import {currentUserLogin} from "../images/userSlice";


export const extendedUsersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: "/users/login",
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
        url: "/users/register",
        method: "POST",
        body,
      }),
    }),
    checkAuth: builder.mutation({
      query: (body) => ({
        url: "/users/checkAuth",
        method: "POST",
        body,
      }),
    }),
    currentUser: builder.query({
      query: (body) => ({
        url: "/users/checkAuth",
        method: "POST",
        body,
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
          const { data } = await queryFulfilled;
          dispatch(currentUserLogin(data.login))
      },
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
  useCheckAuthMutation,
  useCurrentUserQuery
} = extendedUsersApi;
