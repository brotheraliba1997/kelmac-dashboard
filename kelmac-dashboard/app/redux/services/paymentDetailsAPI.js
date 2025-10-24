import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

export const PaymentDetailsAPI = createApi({
  reducerPath: "PaymentDetailsAPI",
  baseQuery: baseQueryWithAuth, // Set default base query to the one with auth headers
  tagTypes: ["refetchClientsPayment"],
  endpoints: (builder) => ({
    paymentDetails: builder.mutation({
      query: (payload) => ({
        url: "/clientPaymentDetails",
        method: "POST",
        body: { ...payload },
      }),
      invalidatesTags: ["refetchClientsPaymentDetails"],
    }),

    getClientPaymentDetails: builder.query({
      query: ({ page = 1, pageSize = 10, sort = "asc" }) => ({
        url: "/clientPaymentDetails",
        method: "GET",
        params: { page, pageSize, sort },
      }),
      providesTags: ["refetchClientsPaymentDetails"],
    }),
    updateClientPaymentDetails: builder.mutation({
      query: ({ payload, id }) => ({
        url: `/clientPaymentDetails/${id}`,
        method: "PATCH",
        body: { ...payload },
      }),
      invalidatesTags: ["refetchClientsPaymentDetails"],
    }),
  }),
});

export const {
  usePaymentDetailsMutation,
  useGetClientPaymentDetailsQuery,
  useUpdateClientPaymentDetailsMutation,
} = PaymentDetailsAPI;
