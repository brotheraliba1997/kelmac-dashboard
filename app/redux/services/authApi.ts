import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithoutAuth } from "./baseQuery";

type LoginPayload = {
  email: string;
  password: string;
};

type InterpreterRegistration = Record<string, unknown>;
type UpdatePasswordPayload = Record<string, unknown>;

export const authAPI = createApi({
  reducerPath: "authAPI",
  baseQuery: baseQueryWithoutAuth,
  endpoints: (builder) => ({
    loginUser: builder.mutation<unknown, LoginPayload>({
      query: (credentials) => ({
        url: "/email/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: any) => {
        const role = response?.user?.role;
        const roleId =
          typeof role === "number"
            ? role
            : typeof role === "object" && role?.id
            ? role.id
            : undefined;
        const roleName = typeof role === "string" ? role : undefined;
        const allowedIds = [1, 3, 4, 5, 6];
        const allowedNames = [
          "admin",
          "instructor",
          "corporate",
          "finance",
          "operator",
        ];

        const isAllowed =
          (roleId !== undefined && allowedIds.includes(roleId)) ||
          (roleName !== undefined && allowedNames.includes(roleName));

        if (!isAllowed) {
          throw new Error("Unauthorized role");
        }

        return response;
      },
    }),

    forgotPassword: builder.mutation<unknown, { email: string }>({
      query: (credentials) => ({
        url: "/forgot-password",
        method: "POST",
        body: credentials,
      }),
    }),

    verifyToken: builder.mutation<unknown, string>({
      query: (token) => ({
        url: `/verify-token?token=${token}`,
        method: "GET",
      }),
    }),

    UpdatePassword: builder.mutation<unknown, UpdatePasswordPayload>({
      query: (payload) => ({
        url: `/update-password`,
        method: "PATCH",
        body: payload,
      }),
    }),

    RegisterInterpreter: builder.mutation<unknown, InterpreterRegistration>({
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
