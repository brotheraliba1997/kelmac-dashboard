import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

export const enrollmentApi = createApi({
  reducerPath: "enrollmentApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder: any) => ({
    enrollInCourse: builder.mutation({
      query: (courseId: any) => ({
        url: `/enrollments/${courseId}`,
        method: "POST",
      }),
      invalidatesTags: ["Course", "User"],
    }),

    getUserEnrollments: builder.query({
      query: () => "/enrollments/me",
      providesTags: ["User", "Course"],
    }),
  }),
});

export const { useEnrollInCourseMutation, useGetUserEnrollmentsQuery } =
  enrollmentApi;
