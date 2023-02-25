import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:17548/",
    credentials: "include",
  }),
  endpoints: () => ({}),
  tagTypes: ["Images", "Users"],
});
