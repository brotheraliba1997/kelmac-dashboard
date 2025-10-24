import { baseApi } from './baseApi';

export const courseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCourses: builder.query({
      query: () => '/courses',
      providesTags: ['Course'],
    }),

    getCourseById: builder.query({
      query: (id) => `/courses/${id}`,
      providesTags: ['Course'],
    }),

    createCourse: builder.mutation({
      query: (data) => ({
        url: '/courses',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Course'],
    }),

    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/courses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Course'],
    }),
  }),
});

export const {
  useGetAllCoursesQuery,
  useGetCourseByIdQuery,
  useCreateCourseMutation,
  useDeleteCourseMutation,
} = courseApi;
