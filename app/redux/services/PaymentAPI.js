import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

export const PaymentAPI = createApi({
  reducerPath: "PaymentAPI",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["refetchCustPaymentMethods"],
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
  }),
});

export const {
  useAttachPaymentMethodMutation,
  useGetCustomerPaymentMethodsQuery,
} = PaymentAPI;
