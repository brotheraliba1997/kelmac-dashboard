import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

// Types for enrollment queries
interface EnrollmentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  courseId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

interface UpdateEnrollmentData {
  id: string;
  data: {
    status?: string;
    progress?: number;
    completedAt?: string;
    certificate?: string;
    notes?: string;
  };
}

interface CreateEnrollmentData {
  user: string;
  course: string;
  payment?: string;
  offer?: string;
  progress?: number;
  status?: "active" | "completed" | "cancelled";
  completionDate?: string;
}

export const enrollmentApi = createApi({
  reducerPath: "enrollmentApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Enrollment", "Course", "User"],
  endpoints: (builder) => ({
    // Get all enrollments with pagination, filtering, sorting, and search
    getAllEnrollments: builder.query<unknown, EnrollmentQueryParams | void>({
      query: (params: EnrollmentQueryParams = {}) => {
        const {
          page = 1,
          limit = 10,
          search,
          sortBy = "createdAt",
          sortOrder = "desc",
          status,
          courseId,
          userId,
          startDate,
          endDate,
        } = params;

        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sortBy,
          sortOrder,
        });

        // Add optional filters
        if (search) queryParams.append("search", search);
        if (status) queryParams.append("status", status);
        if (courseId) queryParams.append("courseId", courseId);
        if (userId) queryParams.append("userId", userId);
        if (startDate) queryParams.append("startDate", startDate);
        if (endDate) queryParams.append("endDate", endDate);

        return {
          url: `/enrollments?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Enrollment"],
    }),

    // Get enrollment by ID
    getEnrollmentById: builder.query<unknown, string>({
      query: (id: string) => `/enrollments/${id}`,
      providesTags: ["Enrollment"],
    }),

    // Create new enrollment
    createEnrollment: builder.mutation<unknown, CreateEnrollmentData>({
      query: (data: CreateEnrollmentData) => ({
        url: "/enrollments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Enrollment", "Course", "User"],
    }),

    // Enroll in course (simple enrollment)
    enrollInCourse: builder.mutation<unknown, string>({
      query: (courseId) => ({
        url: `/enrollments/${courseId}`,
        method: "POST",
      }),
      invalidatesTags: ["Enrollment", "Course", "User"],
    }),

    // Update enrollment
    updateEnrollment: builder.mutation<unknown, UpdateEnrollmentData>({
      query: ({ id, data }: UpdateEnrollmentData) => {
        return {
          url: `/enrollments/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["Enrollment", "Course", "User"],
    }),

    // Delete enrollment
    deleteEnrollment: builder.mutation<unknown, string>({
      query: (id: string) => ({
        url: `/enrollments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Enrollment", "Course", "User"],
    }),

    // Get user's enrollments
    getUserEnrollments: builder.query<unknown, EnrollmentQueryParams | void>({
      query: (params: EnrollmentQueryParams = {}) => {
        const {
          page = 1,
          limit = 10,
          search,
          sortBy = "createdAt",
          sortOrder = "desc",
          status,
        } = params;

        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sortBy,
          sortOrder,
        });

        if (search) queryParams.append("search", search);
        if (status) queryParams.append("status", status);

        return `/enrollments/me?${queryParams.toString()}`;
      },
      providesTags: ["Enrollment", "User", "Course"],
    }),

    // Get course enrollments (for instructors/admins)
    getCourseEnrollments: builder.query<
      unknown,
      { courseId: string } & EnrollmentQueryParams
    >({
      query: ({
        courseId,
        ...params
      }: { courseId: string } & EnrollmentQueryParams) => {
        const {
          page = 1,
          limit = 10,
          search,
          sortBy = "createdAt",
          sortOrder = "desc",
          status,
        } = params;

        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sortBy,
          sortOrder,
        });

        if (search) queryParams.append("search", search);
        if (status) queryParams.append("status", status);

        return `/courses/${courseId}/enrollments?${queryParams.toString()}`;
      },
      providesTags: ["Enrollment", "Course"],
    }),

    // Bulk update enrollments
    bulkUpdateEnrollments: builder.mutation<
      unknown,
      { ids: string[]; updates: Record<string, unknown> }
    >({
      query: (data) => ({
        url: "/enrollments/bulk-update",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Enrollment"],
    }),

    // Get enrollment statistics
    getEnrollmentStats: builder.query<
      unknown,
      {
        courseId?: string;
        userId?: string;
        dateRange?: string;
      }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();

        if (params.courseId) queryParams.append("courseId", params.courseId);
        if (params.userId) queryParams.append("userId", params.userId);
        if (params.dateRange) queryParams.append("dateRange", params.dateRange);

        return `/enrollments/stats?${queryParams.toString()}`;
      },
      providesTags: ["Enrollment"],
    }),
  }),
});

export const {
  useGetAllEnrollmentsQuery,
  useGetEnrollmentByIdQuery,
  useCreateEnrollmentMutation,
  useEnrollInCourseMutation,
  useUpdateEnrollmentMutation,
  useDeleteEnrollmentMutation,
  useGetUserEnrollmentsQuery,
  useGetCourseEnrollmentsQuery,
  useBulkUpdateEnrollmentsMutation,
  useGetEnrollmentStatsQuery,
} = enrollmentApi;
