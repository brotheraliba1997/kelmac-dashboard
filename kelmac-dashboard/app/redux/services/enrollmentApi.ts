import { baseApi } from './baseApi';

export const enrollmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    enrollInCourse: builder.mutation({
      query: (courseId) => ({
        url: `/enrollments/${courseId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Course', 'User'],
    }),

    getUserEnrollments: builder.query({
      query: () => '/enrollments/me',
      providesTags: ['User', 'Course'],
    }),
  }),
});

export const { useEnrollInCourseMutation, useGetUserEnrollmentsQuery } = enrollmentApi;
