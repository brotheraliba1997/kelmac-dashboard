import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder: any) => ({
    getAllBlogs: builder.query({
      query: () => "/blogs",
      providesTags: ["Blog"],
    }),

    getBlogById: builder.query({
      query: (id: any) => `/blogs/${id}`,
      providesTags: ["Blog"],
    }),

    createBlog: builder.mutation({
      query: (data: any) => ({
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
