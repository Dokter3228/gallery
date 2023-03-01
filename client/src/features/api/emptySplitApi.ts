import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  any
> = async (args, WebApi, extraOptions) => {
  const baseUrl = "http://localhost:17548/";

  const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    credentials: "include",
  });
  const result = await rawBaseQuery(args, WebApi, extraOptions);

  if (result.error?.status === 401) {
    // HARD REDIRECT!
    window.location.href = "http://localhost:3000/login";
  }

  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithAuth,
  endpoints: () => ({}),
  tagTypes: ["Images", "Users", "Comments"],
});
