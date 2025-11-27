import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";

export const attendanceApi = createApi({
  reducerPath: "attendanceApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Attendance"],
  endpoints: (builder) => ({
    // Bulk attendance marking
    markBulkAttendance: builder.mutation({
      query: (body: {
        courseId: string;
        sessionId: string;
        markedBy: string;
        students: Array<{
          studentId: string;
          status: "present" | "absent";
        }>;
      }) => ({
        url: "/attendance/bulk",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Attendance"],
    }),
  }),
});

export const { useMarkBulkAttendanceMutation } = attendanceApi;

