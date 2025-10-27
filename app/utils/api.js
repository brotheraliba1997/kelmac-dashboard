// services/api.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
    prepareHeaders: (headers, { getState }) => {
      const tokens = getState().auth.tokens;

      if (tokens?.accessToken) {
        headers.set("Authorization", `Bearer ${tokens.accessToken}`);
      }

      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  endpoints: () => ({}), // 👈 baaki services yahan inject hoti hain (authAPI, userAPI, etc.)
});
