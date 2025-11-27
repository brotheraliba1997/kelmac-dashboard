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
    [key: string]: unknown;
  };
  price?: number;
  sessions?: unknown[];
  [key: string]: unknown;
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
type CourseQueryParams = Record<string, string | number | boolean | undefined>;
type CoursePayload = Record<string, unknown>;

export const courseApi = createApi({
  reducerPath: "courseApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Course"],
  endpoints: (builder) => ({
    getAllCourses: builder.query<CoursePagination, CourseQueryParams | void>({
      query: (params: CourseQueryParams = {}) => {
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

    getCourseById: builder.query<unknown, string>({
      query: (id) => `/courses/${id}`,

      providesTags: ["Course"],
    }),

    createCourse: builder.mutation<unknown, CoursePayload>({
      query: (data) => ({
        url: "/courses",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Course"],
    }),

    updateCourse: builder.mutation<
      unknown,
      { id: string; data: CoursePayload }
    >({
      query: ({ id, data }) => ({
        url: `/courses/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Course"],
    }),

    deleteCourse: builder.mutation<unknown, string>({
      query: (id) => ({
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
