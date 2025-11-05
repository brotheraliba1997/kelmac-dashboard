import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

export const classScheduleApi = createApi({
  reducerPath: "classScheduleApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["ClassSchedule"],
  endpoints: (builder: any) => ({
    getAllClassSchedules: builder.query({
      query: () => "/class-schedule",
      providesTags: ["ClassSchedule"],
    }),

    createClassSchedule: builder.mutation({
      query: (body: any) => ({
        url: "/class-schedule",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ClassSchedule"],
    }),
  }),
});

export const { useGetAllClassSchedulesQuery, useCreateClassScheduleMutation } =
  classScheduleApi;
