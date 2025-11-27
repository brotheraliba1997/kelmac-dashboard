import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

type BillingTransactionsArgs = {
  billingId: string;
  page?: number;
  pageSize?: number;
  sort?: "asc" | "desc" | string;
};

export const billingAPI = createApi({
  reducerPath: "billingAPI",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["refetchTransactions"],

  endpoints: (builder) => ({
    getBillings: builder.query<unknown, void>({
      query: () => ({
        url: "/billings",
        method: "GET",
      }),
    }),

    getBillingById: builder.query<unknown, string>({
      query: (id) => ({
        url: `/billings/${id}`,
        method: "GET",
      }),
    }),

    getOwnBilling: builder.query<unknown, void>({
      query: () => ({
        url: "/billings/getOwnBilling",
        method: "GET",
      }),
      providesTags: ["refetchTransactions"],
    }),

    getStripPayment: builder.mutation<unknown, void>({
      query: () => ({
        url: "/stripe/clearOwnDues",
        method: "GET",
      }),
      invalidatesTags: ["refetchTransactions"],
    }),

    getBillingTransactions: builder.query<unknown, BillingTransactionsArgs>({
      query: ({ billingId, page = 1, pageSize = 10, sort = "asc" }) => ({
        url: `/billing/${billingId}/transactions`,
        method: "GET",
        params: { page, pageSize, sort },
      }),
      providesTags: ["refetchTransactions"],
    }),
  }),
});

export const {
  useGetBillingsQuery,
  useGetBillingByIdQuery,
  useGetOwnBillingQuery,
  useGetBillingTransactionsQuery,
  useGetStripPaymentMutation,
} = billingAPI;
