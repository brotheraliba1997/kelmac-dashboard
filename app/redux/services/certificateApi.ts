import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

export const certificateApi = createApi({
  reducerPath: "certificateApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Certificate"],
  endpoints: (builder) => ({
    getAllCertificates: builder.query<unknown, void>({
      query: () => "/certificates/me", // user ke certificates
      providesTags: [{ type: "Certificate" }],
    }),

    getCertificateById: builder.query<unknown, string>({
      query: (id) => `/certificates/${id}`,
      providesTags: [{ type: "Certificate" }],
    }),
  }),
});

export const { useGetAllCertificatesQuery, useGetCertificateByIdQuery } =
  certificateApi;
