import { api } from "./emptySplitApi";
import { User } from "../slices/userSlice";
type Login = {
  login: string;
  password: string;
};

export const extendedUsersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<void, Login>({
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
    checkAuth: builder.query<Login, void>({
      query: () => ({
        url: "/users/checkAuth",
        method: "POST",
      }),
    }),
  }),
  overrideExisting: false,
});

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
  useCheckAuthQuery,
} = extendedUsersApi;
