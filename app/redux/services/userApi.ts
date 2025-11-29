import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithAuth } from "./api";
import { User } from "../types";

type UserQueryParams = Record<string, string | number | boolean | undefined>;
type CreateUserPayload = Record<string, unknown>;
type UpdateProfilePayload = {
  id: string | number;
} & Record<string, User>;

export const userAPI = createApi({
  reducerPath: "userAPI",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    // ✅ Create User
    createUser: builder.mutation<User, CreateUserPayload>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    // ✅ Get All Users
    getUsers: builder.query<User, UserQueryParams | void>({
      query: (params: UserQueryParams = {}) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== "") {
            searchParams.append(key, String(value));
          }
        });
        const queryString = searchParams.toString();
        return `/users${queryString ? `?${queryString}` : ""}`;
      },
      // query: (params) => ({
      //   url: "/users",
      //   method: "GET",
      //   params,
      // }),
      providesTags: ["Users"],
    }),

    // ✅ Get One User by ID
    getUserById: builder.query<User, string | number>({
      query: (id) => `/users/${id}`,
    }),

    // ✅ Update User
    updateProfile: builder.mutation<User, UpdateProfilePayload>({
      query: ({ id, ...body }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    // ✅ Delete User
    deleteUser: builder.mutation<unknown, string | number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateProfileMutation,
  useDeleteUserMutation,
} = userAPI;
