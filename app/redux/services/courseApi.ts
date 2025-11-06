import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";
export const courseApi = createApi({
  reducerPath: "courseApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Course"],
  endpoints: (builder: any) => ({
    getAllCourses: builder.query({
      query: () => "/courses",
      providesTags: ["Course"],
    }),

    getCourseById: builder.query({
      query: (id: any) => `/courses/${id}`,

      providesTags: ["Course"],
    }),

    createCourse: builder.mutation({
      query: (data: any) => ({
        url: "/courses",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Course"],
    }),

    updateCourse: builder.mutation({
      query: ({ id, data }: { id: any; data: any }) => {
        console.log("Updating course with ID and data =>", id, data);
        return {
          url: `/courses/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["Course"],
    }),

    deleteCourse: builder.mutation({
      query: (id: any) => ({
        url: `/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),
  }),
});

export const {
  useGetAllCoursesQuery,
  useGetCourseByIdQuery,
  useCreateCourseMutation,
  useDeleteCourseMutation,
  useUpdateCourseMutation,
} = courseApi;
