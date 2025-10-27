import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

export const companyApi = createApi({
  reducerPath: "companyApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder: any) => ({
    getAllCompanies: builder.query({
      query: () => "/companies",
      providesTags: ["Company"],
    }),

    getCompanyById: builder.query({
      query: (id: any) => `/companies/${id}`,
      providesTags: ["Company"],
    }),

    createCompany: builder.mutation({
      query: (data: any) => ({
        url: "/companies",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Company"],
    }),

    updateCompany: builder.mutation({
      query: ({ id, ...data }: any) => ({
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
