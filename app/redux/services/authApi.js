import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithoutAuth } from "./api";

export const authAPI = createApi({
  reducerPath: "authAPI",
  baseQuery: baseQueryWithoutAuth, // Set default base query to the one with auth headers
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/email/login",
        method: "POST",
        body: credentials,
      }),
    }),

    forgotPassword: builder.mutation({
      query: (credentials) => ({
        url: "/forgot-password",
        method: "POST",
        body: credentials,
      }),
    }),

    verifyToken: builder.mutation({
      query: (credentials) => ({
        url: `/verify-token?token=${credentials}`,
        method: "GET",
      }),
    }),

    UpdatePassword: builder.mutation({
      query: (payload) => ({
        url: `/update-password`,
        method: "PATCH",
        body: payload,
      }),
    }),

    RegisterInterpreter: builder.mutation({
      query: (payload) => ({
        url: "/register",
        method: "POST",
        body: { ...payload, role: "interpreter" },
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterInterpreterMutation,
  useForgotPasswordMutation,
  useVerifyTokenMutation,
  useUpdatePasswordMutation,
} = authAPI;
