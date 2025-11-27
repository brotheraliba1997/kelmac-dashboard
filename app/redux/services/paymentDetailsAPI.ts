import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithAuth } from "./api";

type ClientPaymentPayload = Record<string, unknown>;

type PaymentDetailsQueryArgs = {
  page?: number;
  pageSize?: number;
  sort?: string;
};

type UpdatePaymentDetailsArgs = {
  payload: ClientPaymentPayload;
  id: string;
};

export const PaymentDetailsAPI = createApi({
  reducerPath: "PaymentDetailsAPI",
  baseQuery: baseQueryWithAuth, // Set default base query to the one with auth headers
  tagTypes: ["refetchClientsPayment"],
  endpoints: (builder) => ({
    paymentDetails: builder.mutation<unknown, ClientPaymentPayload>({
      query: (payload) => ({
        url: "/clientPaymentDetails",
        method: "POST",
        body: { ...payload },
      }),
      invalidatesTags: ["refetchClientsPaymentDetails"],
    }),

    getClientPaymentDetails: builder.query<
      unknown,
      PaymentDetailsQueryArgs | void
    >({
      query: ({
        page = 1,
        pageSize = 10,
        sort = "asc",
      }: PaymentDetailsQueryArgs = {}) => ({
        url: "/clientPaymentDetails",
        method: "GET",
        params: { page, pageSize, sort },
      }),
      providesTags: ["refetchClientsPaymentDetails"],
    }),
    updateClientPaymentDetails: builder.mutation<
      unknown,
      UpdatePaymentDetailsArgs
    >({
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
