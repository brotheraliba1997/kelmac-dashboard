import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

export const JobTypesAPI = createApi({
  reducerPath: "jobTypesAPI",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    getJobTypesAPI: builder.query({
      query: () => ({
        url: "/jobTypes/all",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetJobTypesAPIQuery  } = JobTypesAPI;
