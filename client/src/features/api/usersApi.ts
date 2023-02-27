import { api } from "./emptySplitApi";
import { User } from "../slices/userSlice";
type Login = {
  login: string;
  password: string;
};

export const extendedUsersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<Login, void>({
      query: (body) => ({
        url: "/users/login",
        method: "POST",
        body,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/users/logout",
        method: "POST",
      }),
    }),
    signup: builder.mutation<Login, any>({
      query: (body) => ({
        url: "/users/register",
        method: "POST",
        body,
      }),
    }),
    checkAuth: builder.mutation<void, void>({
      query: () => ({
        url: "/users/checkAuth",
        method: "POST",
      }),
    }),
    currentUser: builder.query<User, void>({
      query: () => ({
        url: "/users/checkAuth",
        method: "POST",
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
  useCheckAuthMutation,
  useCurrentUserQuery,
} = extendedUsersApi;
