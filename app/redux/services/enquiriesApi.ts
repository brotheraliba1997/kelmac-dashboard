import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

export const enquiriesApi = createApi({
  reducerPath: "enquiriesApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Enquiries"],
  endpoints: (builder) => ({
    getEnquiries: builder.query<
      {
        data: any[];
        totalItems: number;
        totalPages: number;
        currentPage: number;
        limit: number;
        hasNextPage?: boolean;
        hasPreviousPage?: boolean;
      },
      { search?: string; page?: number; limit?: number }
    >({
      query: ({ search = "", page = 1, limit = 10 }) => ({
        url: "/enquiries",
        params: { search, page, limit },
      }),
      providesTags: ["Enquiries"],
    }),
  }),
});

export const { useGetEnquiriesQuery } = enquiriesApi;
