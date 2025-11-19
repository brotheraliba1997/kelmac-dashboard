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
      query: ({ page = 1, limit = 20, status }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (status) {
          params.append("status", status);
        }
        return {
          url: `/payment?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Payments"],
    }),
  }),
});

export const {
  useAttachPaymentMethodMutation,
  useGetCustomerPaymentMethodsQuery,
  useGetPaymentsQuery,
} = PaymentAPI;
