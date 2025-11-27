import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

export const languageAPI = createApi({
  reducerPath: "languageAPI",
  baseQuery: baseQueryWithAuth, // Set default base query to the one with auth headers
  endpoints: (builder) => ({
    // Client Queries
    getlanguage: builder.query<unknown, void>({
      query: () => ({
        url: "/languages/all",
        method: "GET",
      }),
    }),
    // Interpreter Queries
  }),
});

export const { useGetlanguageQuery } = languageAPI;
