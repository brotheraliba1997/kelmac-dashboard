import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

export interface PurchaseOrder {
  _id: string;
  orderId: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  course: {
    _id: string;
    title: string;
    price: number;
  };
  amount: number;
  currency: string;
  status: "pending" | "approved" | "rejected";
  paymentMethod: string;
  documentUrl?: string;
  notes?: string;
  submittedAt: string;
  reviewedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  reviewedAt?: string;
  decisionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrdersResponse {
  success: boolean;
  data: PurchaseOrder[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UpdatePurchaseOrderRequest {
  id: string;
  status: "approved" | "rejected";
  reviewedBy: string;
  reviewedAt: string;
  decisionNotes?: string;
}

export const purchaseOrderApi = createApi({
  reducerPath: "purchaseOrderApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["PurchaseOrders"],
  endpoints: (builder) => ({
    getPurchaseOrders: builder.query<
      PurchaseOrdersResponse,
      { page?: number; limit?: number; status?: string }
    >({
      query: ({ page = 1, limit = 20, status }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (status) {
          params.append("status", status);
        }
        return {
          url: `/purchase-orders?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["PurchaseOrders"],
    }),

    updatePurchaseOrder: builder.mutation<
      { success: boolean; data: PurchaseOrder },
      UpdatePurchaseOrderRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/purchase-orders/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["PurchaseOrders"],
    }),
  }),
});

export const { useGetPurchaseOrdersQuery, useUpdatePurchaseOrderMutation } =
  purchaseOrderApi;
