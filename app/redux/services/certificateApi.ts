import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

export const certificateApi = createApi({ 
  reducerPath: "certificateApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder:any) => ({
    getAllCertificates: builder.query({
      query: () => '/certificates/me', // user ke certificates
      providesTags: ['Certificate'],
    }),

    getCertificateById: builder.query({
      query: (id:any) => `/certificates/${id}`,
      providesTags: ['Certificate'],
    }),
  }),
});

export const {
  useGetAllCertificatesQuery,
  useGetCertificateByIdQuery,
} = certificateApi;
