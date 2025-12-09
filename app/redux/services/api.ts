import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import type { RootState } from "../store";
import { logout } from "../slices/auth";
import { baseQueryWithoutAuth, createBaseQueryWithAuth } from "./baseQuery";

// Create baseQueryWithAuth by passing the logout action
export const baseQueryWithAuth = createBaseQueryWithAuth(logout);
