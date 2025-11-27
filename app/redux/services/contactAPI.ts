import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

type ContactQueryArgs = {
  page?: number;
  pageSize?: number;
  sort?: string;
  status?: string;
};

type ContactMutationArgs = {
  id: string;
  payload: Record<string, unknown>;
};

export const contactAPI = createApi({
  reducerPath: "contactAPI",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["refetchContact"],
  endpoints: (builder) => ({
    getContact: builder.query<unknown, ContactQueryArgs | void>({
      query: ({
        page = 1,
        pageSize = 10,
        sort = "asc",
        status = "Verified",
      }) => ({
        url: "/contact",
        method: "GET",
        params: { page, pageSize, sort, status },
      }),
      providesTags: ["refetchContact"],
    }),

    postContact: builder.mutation<unknown, Record<string, unknown>>({
      query: (payload) => ({
        url: "/contact",
        method: "POST",
        body: payload,
      }),
    }),

    UpdateContact: builder.mutation<unknown, ContactMutationArgs>({
      query: ({ payload, id }) => ({
        url: `/contact/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["refetchContact"],
    }),
  }),
});

export const {
  useGetContactQuery,
  usePostContactMutation,
  useUpdateContactMutation,
} = contactAPI;
