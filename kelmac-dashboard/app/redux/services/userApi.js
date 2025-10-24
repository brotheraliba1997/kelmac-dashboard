import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

export const userAPI = createApi({
  reducerPath: "userAPI",
  baseQuery: baseQueryWithAuth, // Set default base query to the one with auth headers
  tagTypes: ["refetchClients", "refetchInterpreters"],
  endpoints: (builder) => ({
    // Client Queries
    getClients: builder.query({
      query: ({ page = 1, pageSize = 10, sort = "asc" }) => ({
        url: "/users",
        method: "GET",
        params: { page, pageSize, sort, role: "client" },
      }),
      providesTags: ["refetchClients"],
    }),

    createClient: builder.mutation({
      query: (payload) => ({
        url: "/users",
        method: "POST",
        body: { ...payload, role: "client" },
      }),
      invalidatesTags: ["refetchClients"],
    }),

    updateClient: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: { ...payload, role: "client" },
      }),
      invalidatesTags: ["refetchClients"],
    }),

    // Interpreter Queries
    getInterpreters: builder.query({
      query: ({
        page = 1,
        pageSize = 10,
        sort = "asc",
        status = "Verified",
      }) => ({
        url: "/users",
        method: "GET",
        params: { page, pageSize, sort, role: "interpreter", status },
      }),
      providesTags: ["refetchInterpreters"],
    }),

    createInterpreter: builder.mutation({
      query: (payload) => ({
        url: "/users",
        method: "POST",
        body: { ...payload, role: "interpreter" },
      }),
      invalidatesTags: ["refetchInterpreters"],
    }),

    updateInterpreter: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: { ...payload, role: "interpreter" },
      }),
      invalidatesTags: ["refetchInterpreters"],
    }),

    paymentClient: builder.query({
      query: () => ({
        url: `/users/getAllClients`,
        method: "GET",
      }),
    }),

    updateProfile: builder.mutation({
      query: ({ payload }) => ({
        url: `/users/updateProfile`,
        method: "PATCH",
        body: payload,
      }),
    }),

    changePassword: builder.mutation({
      query: ({ payload }) => ({
        url: `/users/changePassword`,
        method: "PATCH",
        body: payload,
      }),
    }),

    getUserById: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
    }),

    checkUserAuth: builder.mutation({
      query: () => ({
        url: `/users/checkAuth`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useGetInterpretersQuery,
  useCreateInterpreterMutation,
  useUpdateInterpreterMutation,
  usePaymentClientQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetUserByIdMutation,
  useCheckUserAuthMutation,
} = userAPI;
