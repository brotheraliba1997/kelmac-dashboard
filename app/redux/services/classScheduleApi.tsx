import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

export const classScheduleApi = createApi({
  reducerPath: "classScheduleApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["ClassSchedule"],
  endpoints: (builder) => ({
    getAllClassSchedules: builder.query<unknown, void>({
      query: () => "/class-schedule",
      providesTags: ["ClassSchedule"],
    }),

    // Paginated list with filters
    getPaginatedClassSchedules: builder.query<
      unknown,
      {
        search?: string;
        startDate?: string;
        endDate?: string;
        status?: string;
        studentId?: string;
        courseId?: string;
        instructorId?: string;
        limit?: number;
        page?: number;
      }
    >({
      query: (params) => ({
        url: "/class-schedule/paginated/list",
        params,
      }),
      providesTags: ["ClassSchedule"],
    }),

    getClassScheduleById: builder.query<unknown, string>({
      query: (id: string) => `/class-schedule/${id}`,
      providesTags: ["ClassSchedule"],
    }),

    createClassSchedule: builder.mutation<unknown, Record<string, unknown>>({
      query: (body) => ({
        url: "/class-schedule",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ClassSchedule"],
    }),

    updateClassSchedule: builder.mutation<
      unknown,
      { id: string; body: Record<string, unknown> }
    >({
      query: ({ id, body }) => ({
        url: `/class-schedule/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["ClassSchedule"],
    }),
  }),
});

export const {
  useGetAllClassSchedulesQuery,
  useGetPaginatedClassSchedulesQuery,
  useGetClassScheduleByIdQuery,
  useCreateClassScheduleMutation,
  useUpdateClassScheduleMutation,
} = classScheduleApi;
