import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";
import { classScheduleApi } from "./classScheduleApi";

export const attendanceApi = createApi({
  reducerPath: "attendanceApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Attendance", "ClassSchedule"],
  endpoints: (builder) => ({
    // Get pass/fail assignment summary and results
    getPassFailCheckAssignment: builder.query<
      {
        classScheduleId: string;
        courseId: string;
        sessionId: string;
        totalStudents: number;
        passedStudents: number;
        failedStudents: number;
        results: Array<{
          id: string;
          studentId: string;
          studentName: string;
          totalClasses: number;
          presentCount: number;
          absentCount: number;
          result: "PASS" | "FAIL" | string;
          certificateIssued: boolean;
          certificateId?: string;
        }>;
      },
      { classScheduleId: string; courseId: string; sessionId: string }
    >({
      query: ({ classScheduleId, courseId, sessionId }) => ({
        url:
          `/attendance/pass-fail-check-assigment` +
          `?classScheduleId=${encodeURIComponent(classScheduleId)}` +
          `&courseId=${encodeURIComponent(courseId)}` +
          `&sessionId=${encodeURIComponent(sessionId)}`,
        method: "GET",
      }),
      providesTags: ["Attendance"],
    }),
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
      invalidatesTags: ["Attendance", "ClassSchedule"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Cross-invalidate class schedules so paginated list refetches
          dispatch(classScheduleApi.util.invalidateTags(["ClassSchedule"]));
        } catch (err) {
          // ignore
        }
      },
    }),
    // Approve or reject certificate
    approveCertificate: builder.mutation<
      { success: boolean; message: string },
      {
        recordId: string;
        approve: boolean;
        notes?: string;
        certificateUrl?: string;
        operatorId: string;
      }
    >({
      query: (body) => ({
        url: "/attendance/pass-fail-approve-certificate",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Attendance"],
    }),
  }),
});

export const {
  useMarkBulkAttendanceMutation,
  useGetPassFailCheckAssignmentQuery,
  useApproveCertificateMutation,
} = attendanceApi;
