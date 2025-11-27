import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

export const companyApi = createApi({
  reducerPath: "companyApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    getAllCompanies: builder.query<unknown, void>({
      query: () => "/companies",
      providesTags: ["Company"],
    }),

    getCompanyById: builder.query<unknown, string>({
      query: (id) => `/companies/${id}`,
      providesTags: ["Company"],
    }),

    createCompany: builder.mutation<unknown, Record<string, unknown>>({
      query: (data) => ({
        url: "/companies",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Company"],
    }),

    updateCompany: builder.mutation<
      unknown,
      { id: string; [key: string]: unknown }
    >({
      query: ({ id, ...data }) => ({
        url: `/companies/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Company"],
    }),
  }),
});

export const {
  useGetAllCompaniesQuery,
  useGetCompanyByIdQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
} = companyApi;
