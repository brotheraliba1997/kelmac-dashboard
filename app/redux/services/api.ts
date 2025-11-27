import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import type { RootState } from "../store";

// Base query function without authorization headers
export const baseQueryWithoutAuth = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth`,
});

// Base query function with authorization headers
export const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state?.auth?.token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});
