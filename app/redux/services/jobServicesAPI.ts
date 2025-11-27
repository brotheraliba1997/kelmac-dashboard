import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

export const JobServicesAPI = createApi({
  reducerPath: "JobServicesAPI",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    getJobServices: builder.query<unknown, void>({
      query: () => ({
        url: "/jobServices/all",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetJobServicesQuery } = JobServicesAPI;
