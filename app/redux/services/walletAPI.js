import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

export const walletAPI = createApi({
  reducerPath: "walletAPI",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["refetchTransactions , refetchwallet"],
  endpoints: (builder) => ({
    getWallets: builder.query({
      query: ({ page = 1, pageSize = 10, sort = "asc" }) => ({
        url: "/wallets",
        method: "GET",
        params: { page, pageSize, sort },
      }),
      providesTags: ["refetchwallet"],
    }),

    getWalletById: builder.query({
      query: (id) => ({
        url: `/wallets/${id}`,
        method: "GET",
      }),
    }),

    getOwnWallet: builder.query({
      query: () => ({
        url: "/wallets/getOwnWallet",
        method: "GET",
      }),
    }),

    getSendWalletAmountWithdrawRequest: builder.mutation({
      query: () => ({
        url: "/wallets/sendWalletAmountWithdrawRequest",
        method: "GET",
      }),
    }),

    getWalletWithDraw: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/wallets/${id}/withdraw`,
        method: "POST",
        body: payload,
      }),
    }),


    getWalletWithDrawRequests: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/transactions/${id}/updateWalletWithdrawRequest`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["refetchTransactions"],
    }),

    getWalletTransactions: builder.query({
      query: ({ walletId, page = 1, pageSize = 10, sort = "asc" }) => ({
        url: `/wallets/${walletId}/transactions`,
        method: "GET",
        params: { page, pageSize, sort },
      }),
      providesTags: ["refetchTransactions"],
    }),


    getWalletPaymentRequestsTransactions: builder.query({
      query: ({page = 1, pageSize = 10, sort = "asc" }) => ({
        url: `/wallets/paymentRequests/transactions`,
        method: "GET",
        params: { page, pageSize, sort },
      }),
      providesTags: ["refetchTransactions"],
    }),


    getOwnWalletTransactions: builder.query({
      query: ({ walletId, page = 1, pageSize = 10, sort = "asc" }) => ({
        url: `/wallets/getOwnWalletTransactions`,
        method: "GET",
        params: { page, pageSize, sort },
      }),
      providesTags: ["refetchTransactions"],
    }),
  }),
});

export const {
  useGetWalletsQuery,
  useGetWalletByIdQuery,
  useGetOwnWalletQuery,
  useGetOwnWalletTransactionsQuery,
  useGetWalletTransactionsQuery,
  useGetWalletWithDrawMutation,
  useGetSendWalletAmountWithdrawRequestMutation,
  useGetWalletPaymentRequestsTransactionsQuery,
  useGetWalletWithDrawRequestsMutation,
} = walletAPI;
