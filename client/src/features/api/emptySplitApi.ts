// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// initialize an empty api service that we'll inject endpoints into later as needed
export const emptySplitApi = createApi({
  baseQuery: fetchBaseQuery(
      { baseUrl: "http://localhost:17548/" }),
  endpoints: () => ({}),
});

export const imagesApiTagged = emptySplitApi.enhanceEndpoints({
  addTagTypes: ["Images"],
});

export const usersApiTagged = emptySplitApi.enhanceEndpoints({
  addTagTypes: ["Users"],
});
