import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithAuth } from "./api";

type PaymentsQueryArgs = {
  page?: number;
  limit?: number;
  status?: string;
};

export const PaymentAPI = createApi({
  reducerPath: "PaymentAPI",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["refetchCustPaymentMethods", "Payments"],
  endpoints: (builder) => ({
    attachPaymentMethod: builder.mutation({
      query: (id: string) => ({
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

    getPayments: builder.query<unknown, PaymentsQueryArgs | void>({
      query: ({ page = 1, limit = 20, status }: PaymentsQueryArgs = {}) => {
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
