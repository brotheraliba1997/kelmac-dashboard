import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    getAllBlogs: builder.query<unknown, void>({
      query: () => "/blogs",
      providesTags: ["Blog"],
    }),

    getBlogById: builder.query<unknown, string>({
      query: (id) => `/blogs/${id}`,
      providesTags: ["Blog"],
    }),

    createBlog: builder.mutation<unknown, Record<string, unknown>>({
      query: (data) => ({
        url: "/blogs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Blog"],
    }),
  }),
});

export const {
  useGetAllBlogsQuery,
  useGetBlogByIdQuery,
  useCreateBlogMutation,
} = blogApi;
