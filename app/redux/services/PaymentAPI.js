import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

export const PaymentAPI = createApi({
  reducerPath: "PaymentAPI",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["refetchCustPaymentMethods", "Payments"],
  endpoints: (builder) => ({
    attachPaymentMethod: builder.mutation({
      query: (id) => ({
        url: `/stripe/attachPaymentMethod/${id}`,
        method: "GET",
      }),
      invalidatesTags: ["refetchCustPaymentMethods"],
    }),

    getCustomerPaymentMethods: builder.query({
      query: () => ({
        url: `/stripe/getCustomerPaymentMethods`,
        method: "GET",
      }),
      providesTags: ["refetchCustPaymentMethods"],
    }),

    getPayments: builder.query({
      query: ({ page = 1, limit = 20, status = "pending" }) => ({
        url: `/payment?page=${page}&limit=${limit}&status=${status}`,
        method: "GET",
      }),
      providesTags: ["Payments"],
    }),
  }),
});

export const {
  useAttachPaymentMethodMutation,
  useGetCustomerPaymentMethodsQuery,
  useGetPaymentsQuery,
} = PaymentAPI;
