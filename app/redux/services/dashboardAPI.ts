import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

export const DashboardAPI = createApi({
  reducerPath: "DashboardAPI",
  baseQuery: baseQueryWithAuth, // Set default base query to the one with auth headers
  endpoints: (builder) => ({
    getAdminDashboardStats: builder.query<unknown, void>({
      query: () => ({
        url: "/stats/admin",
        method: "GET",
      }),
    }),
    getUserDashboardStats: builder.query<unknown, void>({
      query: () => ({
        url: "/stats",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAdminDashboardStatsQuery, useGetUserDashboardStatsQuery } =
  DashboardAPI;
