import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import type { RootState } from "../store";

// Base query function without authorization headers
export const baseQueryWithoutAuth = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth`,
});

// Factory function to create baseQueryWithAuth with logout dependency
export const createBaseQueryWithAuth = (
  logoutAction: any
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
  const baseQuery = fetchBaseQuery({
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

  // Enhanced base query with token expiration handling
  return async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);

    // Check for 401 Unauthorized or 403 Forbidden (token expired/invalid)
    if (
      result.error &&
      (result.error.status === 401 || result.error.status === 403)
    ) {
      // Dispatch logout action
      api.dispatch(logoutAction());

      // Redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return result;
  };
};
