"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { useGetClassScheduleByIdQuery } from "@/app/redux/services/classScheduleApi";
import { useMarkBulkAttendanceMutation } from "@/app/redux/services/attendanceApi";
import Link from "next/link";

function AttendancePageSingleClass() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params?.id as string;

  // Get query parameters for filtering timeblock
  const startDateParam = searchParams.get("startDate");
  const startTimeParam = searchParams.get("startTime");

  const { user } = useSelector((state: any) => state.auth);

  // Fetch class schedule details
  const {
    data: classScheduleData,
    isLoading: isLoadingSchedule,
    error: scheduleError,
  } = useGetClassScheduleByIdQuery(id, { skip: !id });

  const classSchedule = (classScheduleData as any)?.data || classScheduleData;

  // Get students directly from class schedule
  // Students format: [{ id, email, firstName, lastName }, ...]
  const students = classSchedule?.students || [];

  // Get sessions from course, not directly from classSchedule
  // Sessions are stored in classSchedule.course.sessions
  const courseSessions = classSchedule?.course?.sessions || [];

  // Helper function to find a session by ID in the course sessions
  const findSessionById = (sessionId: string) => {
    if (!sessionId) return null;
    return courseSessions.find(
      (session: any) => session?.id === sessionId || session?._id === sessionId
    );
  };

  // If we have a sessionId in the classSchedule, use that single session
  // Otherwise, use all course sessions
  const sessions = classSchedule?.sessionId
    ? [findSessionById(classSchedule.sessionId)].filter(Boolean)
    : courseSessions;

  // Attendance mutation
  const [markBulkAttendance, { isLoading: isSubmitting }] =
    useMarkBulkAttendanceMutation();

  // State for selected students (simplified for single timeblock)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  // Find the specific timeblock based on query parameters
  let targetTimeBlock = null;
  let targetSessionId = null;

  if (startDateParam && startTimeParam) {
    // Search through all sessions and timeblocks for a match
    for (const session of sessions) {
      const timeBlocks = session?.timeBlocks || [];
      const foundBlock = timeBlocks.find(
        (tb: any) =>
          tb.startDate === startDateParam && tb.startTime === startTimeParam
      );
      if (foundBlock) {
        targetTimeBlock = foundBlock;
        targetSessionId = session?.id || session?._id;
        break;
      }
    }
  }

  // Fallback to first timeblock if no match or no query params
  const firstSession = sessions[0];
  const firstTimeBlock = firstSession?.timeBlocks?.[0];
  const firstSessionId = firstSession?.id || firstSession?._id;

  // Use target timeblock if found, otherwise fallback to first
  const currentTimeBlock = targetTimeBlock || firstTimeBlock;
  const sessionId = targetSessionId || firstSessionId;

  // Handle individual student selection
  const toggleStudent = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  // Select all students
  const selectAll = () => {
    const allStudentIds = students.map(
      (student: any) => student?.id || student?._id
    );
    setSelectedStudents(allStudentIds);
  };

  // Deselect all students
  const deselectAll = () => {
    setSelectedStudents([]);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!classSchedule || !currentTimeBlock) {
      alert("Class schedule not found");
      return;
    }

    // Ensure courseId is only a string ID, not an object
    let courseId = "";
    if (typeof classSchedule?.course === "string") {
      courseId = classSchedule.course;
    } else if (classSchedule?.course?._id) {
      courseId = classSchedule.course._id;
    } else if (classSchedule?.course?.id) {
      courseId = classSchedule.course.id;
    }

    const markedBy = user?._id || user?.id || "";
    const classScheduleId = classSchedule?.id || classSchedule?._id || "";

    if (!courseId || !markedBy || !sessionId || !classScheduleId) {
      alert("Missing required information");
      return;
    }

    try {
      // Prepare students array with ALL students (both present and absent)
      const allStudents = students.map((student: any) => {
        const studentId = student?.id || student?._id;
        const isPresent = selectedStudents.includes(studentId);

        return {
          studentId: studentId,
          status: isPresent ? ("present" as const) : ("absent" as const),
        };
      });

      const payload = {
        classScheduleId: classScheduleId,
        courseId: courseId,
        sessionId: sessionId,
        startDate: currentTimeBlock.startDate,
        startTime: currentTimeBlock.startTime,
        markedBy: markedBy,
        students: allStudents,
      };

      console.log("Attendance Payload:", payload);

      await markBulkAttendance(payload).unwrap();
      alert("Attendance marked successfully!");
      router.push("/dashboard/class-schedule");
    } catch (error: any) {
      console.error("Error marking attendance:", error);
      alert(
        error?.data?.message || error?.message || "Failed to mark attendance"
      );
    }
  };

  if (isLoadingSchedule) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
        <div className="flex items-center gap-3 text-gray-700">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-primary-500" />
          <span className="font-medium">Loading class schedule…</span>
        </div>
      </div>
    );
  }

  if (scheduleError || !classSchedule) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
        <div className="max-w-xl w-full bg-white rounded-lg shadow-sm border border-red-100 p-6">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-3 w-3 rounded-full bg-red-500" />
            <div>
              <h5 className="text-lg font-semibold text-gray-900">
                Unable to load schedule
              </h5>
              <p className="mt-1 text-sm text-gray-600">
                Class schedule not found or failed to load. Please try again or
                return to the schedule list.
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Link
              href="/dashboard/class-schedule"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900 transition-colors"
            >
              Back to Class Schedule
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                📋 Mark Attendance
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500">
                    Course:
                  </span>
                  <span className="text-sm font-semibold text-blue-600">
                    {classSchedule?.course?.title || "—"}
                  </span>
                </div>
                {currentTimeBlock && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">
                        Date:
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {currentTimeBlock.startDate || "—"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">
                        Time:
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {currentTimeBlock.startTime} -{" "}
                        {currentTimeBlock.endTime}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <Link
              href="/dashboard/class-schedule"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
            >
              ← Back
            </Link>
          </div>
        </div>

        {!sessions.length || !students.length ? (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <p className="text-blue-800 font-medium">
              {!sessions.length
                ? "No sessions configured for this class schedule."
                : "No students assigned to this class schedule."}
            </p>
          </div>
        ) : (
          <>
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Quick Actions
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={selectAll}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors shadow-sm"
                  >
                    ✓ Select All
                  </button>
                  <button
                    onClick={deselectAll}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors shadow-sm"
                  >
                    ✗ Deselect All
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-linear-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Present</p>
                  <p className="text-3xl font-bold text-green-600">
                    {selectedStudents.length}
                  </p>
                </div>
                <div className="h-12 w-px bg-gray-300"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Absent</p>
                  <p className="text-3xl font-bold text-red-600">
                    {students.length - selectedStudents.length}
                  </p>
                </div>
                <div className="h-12 w-px bg-gray-300"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {students.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Students List */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Students ({students.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
                {students.map((student: any) => {
                  const studentId = student?.id || student?._id;
                  const isSelected = selectedStudents.includes(studentId);

                  return (
                    <div
                      key={studentId}
                      onClick={() => toggleStudent(studentId)}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? "border-green-500 bg-green-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      <div
                        className={`shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center ${
                          isSelected
                            ? "bg-green-500 border-green-500"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-semibold truncate ${
                            isSelected ? "text-green-900" : "text-gray-900"
                          }`}
                        >
                          {student?.firstName} {student?.lastName}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {student?.email}
                        </p>
                      </div>
                      <div
                        className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold ${
                          isSelected
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {isSelected ? "Present" : "Absent"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-4  text-white bg-primary-600 cursor-pointer hover:bg-primary-700 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    SUBMITTING...
                  </span>
                ) : (
                  "✓ SUBMIT ATTENDANCE"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AttendancePageSingleClass;
