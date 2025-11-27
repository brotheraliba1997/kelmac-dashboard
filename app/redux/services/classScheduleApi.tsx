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

    getClassScheduleById: builder.query<unknown, string>({
      query: (id: string) => `/class-schedule/${id}`,
      providesTags: ["ClassSchedule"],
    }),

    createClassSchedule: builder.mutation<
      unknown,
      Record<string, unknown>
    >({
      query: (body) => ({
        url: "/class-schedule",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ClassSchedule"],
    }),
  }),
});

export const {
  useGetAllClassSchedulesQuery,
  useGetClassScheduleByIdQuery,
  useCreateClassScheduleMutation,
} = classScheduleApi;
