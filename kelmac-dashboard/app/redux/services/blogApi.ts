import { baseApi } from './baseApi';

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBlogs: builder.query({
      query: () => '/blogs',
      providesTags: ['Blog'],
    }),

    getBlogById: builder.query({
      query: (id) => `/blogs/${id}`,
      providesTags: ['Blog'],
    }),

    createBlog: builder.mutation({
      query: (data) => ({
        url: '/blogs',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Blog'],
    }),
  }),
});

export const {
  useGetAllBlogsQuery,
  useGetBlogByIdQuery,
  useCreateBlogMutation,
} = blogApi;
