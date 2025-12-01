import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithAuth } from "./api";

type WalletListArgs = {
  page?: number;
  pageSize?: number;
  sort?: string;
};

type WalletTransactionsArgs = WalletListArgs & {
  walletId: string;
};

type WalletMutationPayload = {
  id: string;
  payload?: Record<string, unknown>;
};

export const walletAPI = createApi({
  reducerPath: "walletAPI",
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    "refetchTransactions , refetchwallet",
    "refetchwallet",
    "refetchTransactions",
  ],
  endpoints: (builder) => ({
    getWallets: builder.query<unknown, WalletListArgs | void>({
      query: ({
        page = 1,
        pageSize = 10,
        sort = "asc",
      }: WalletListArgs = {}) => ({
        url: "/wallets",
        method: "GET",
        params: { page, pageSize, sort },
      }),
      providesTags: [{ type: "refetchwallet" }],
    }),

    getWalletById: builder.query<unknown, string>({
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

    getSendWalletAmountWithdrawRequest: builder.mutation<unknown, void>({
      query: () => ({
        url: "/wallets/sendWalletAmountWithdrawRequest",
        method: "GET",
      }),
    }),

    getWalletWithDraw: builder.mutation<unknown, WalletMutationPayload>({
      query: ({ id, payload }) => ({
        url: `/wallets/${id}/withdraw`,
        method: "POST",
        body: payload,
      }),
    }),

    getWalletWithDrawRequests: builder.mutation<unknown, WalletMutationPayload>(
      {
        query: ({ id, payload }) => ({
          url: `/transactions/${id}/updateWalletWithdrawRequest`,
          method: "PATCH",
          body: payload,
        }),
        invalidatesTags: [{ type: "refetchTransactions" }],
      }
    ),

    getWalletTransactions: builder.query<unknown, WalletTransactionsArgs>({
      query: ({ walletId, page = 1, pageSize = 10, sort = "asc" }) => ({
        url: `/wallets/${walletId}/transactions`,
        method: "GET",
        params: { page, pageSize, sort },
      }),
      providesTags: ["refetchTransactions"],
    }),

    getWalletPaymentRequestsTransactions: builder.query<
      unknown,
      WalletListArgs | void
    >({
      query: ({
        page = 1,
        pageSize = 10,
        sort = "asc",
      }: WalletListArgs = {}) => ({
        url: `/wallets/paymentRequests/transactions`,
        method: "GET",
        params: { page, pageSize, sort },
      }),
      providesTags: ["refetchTransactions"],
    }),

    getOwnWalletTransactions: builder.query<unknown, WalletListArgs | void>({
      query: ({
        page = 1,
        pageSize = 10,
        sort = "asc",
      }: WalletListArgs = {}) => ({
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
