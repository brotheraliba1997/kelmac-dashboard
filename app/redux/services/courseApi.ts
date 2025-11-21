import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

// Types for course and pagination
export interface Course {
  id: string;
  title: string;
  description?: string;
  instructor?: {
    firstName?: string;
    lastName?: string;
    [key: string]: any;
  };
  price?: number;
  sessions?: any[];
  [key: string]: any;
}

export interface CoursePagination {
  currentPage: number;
  data: Course[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  limit: number;
  totalItems: number;
  totalPages: number;
}
export const courseApi = createApi({
  reducerPath: "courseApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Course"],
  endpoints: (builder) => ({
    getAllCourses: builder.query<CoursePagination, Record<string, any>>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== "") {
            searchParams.append(key, String(value));
          }
        });
        const queryString = searchParams.toString();
        return `/courses${queryString ? `?${queryString}` : ""}`;
      },
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
