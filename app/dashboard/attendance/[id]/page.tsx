"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useGetClassScheduleByIdQuery } from "@/app/redux/services/classScheduleApi";
import { useMarkBulkAttendanceMutation } from "@/app/redux/services/attendanceApi";
import Link from "next/link";

function AttendancePageSingleClass() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  console.log(id, "sssss=>");

  const { user } = useSelector((state: any) => state.auth);

  // Fetch class schedule details
  const {
    data: classScheduleData,
    isLoading: isLoadingSchedule,
    error: scheduleError,
  } = useGetClassScheduleByIdQuery(id, { skip: !id });

  const classSchedule = (classScheduleData as any)?.data || classScheduleData;

  console.log(classSchedule, "classSchedule=>");

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

  console.log("Students:", students);
  console.log("Sessions:", sessions);

  // Attendance mutation
  const [markBulkAttendance, { isLoading: isSubmitting }] =
    useMarkBulkAttendanceMutation();

  // State for selected students by timeblock (using object with array instead of Set)
  const [selectedStudentsByTimeBlock, setSelectedStudentsByTimeBlock] =
    useState<Record<string, string[]>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Helper function to get a consistent key for each timeblock
  const getTimeBlockKey = (sessionIdx: number, blockIdx: number) => {
    return `${sessionIdx}-${blockIdx}`;
  };

  // Initialize with empty selections for all timeblocks (only once)
  useEffect(() => {
    console.log("Sessions length:", sessions.length);
    if (sessions.length > 0 && students.length > 0 && !isInitialized) {
      const timeBlockSelections: Record<string, string[]> = {};
      sessions.forEach((session: any, sessionIdx: number) => {
        const timeBlocks = session?.timeBlocks || [];
        console.log(
          `Session ${sessionIdx} has ${timeBlocks.length} timeblocks`
        );
        timeBlocks.forEach((_: any, blockIdx: number) => {
          const timeBlockKey = getTimeBlockKey(sessionIdx, blockIdx);
          timeBlockSelections[timeBlockKey] = [];
        });
      });
      console.log("Initializing attendance state:", timeBlockSelections);
      setSelectedStudentsByTimeBlock(timeBlockSelections);
      setIsInitialized(true);
    }
  }, [sessions, students, isInitialized]);

  // Debug: Log state changes
  useEffect(() => {
    console.log("Current attendance state:", selectedStudentsByTimeBlock);
  }, [selectedStudentsByTimeBlock]);

  // Handle checkbox change for a specific timeblock
  const handleCheckboxChange = (timeBlockKey: string, studentId: string) => {
    console.log("Checkbox clicked:", timeBlockKey, studentId);
    setSelectedStudentsByTimeBlock((prev) => {
      const currentList = prev[timeBlockKey] || [];
      const isChecked = currentList.includes(studentId);

      const newList = isChecked
        ? currentList.filter((id) => id !== studentId)
        : [...currentList, studentId];

      console.log("Updated list:", newList);

      return {
        ...prev,
        [timeBlockKey]: newList,
      };
    });
  };

  // Toggle all students for a timeblock
  const toggleAllStudentsForTimeBlock = (
    timeBlockKey: string,
    selectAll: boolean
  ) => {
    const studentIds = students.map(
      (student: any) => student?.id || student?._id
    );
    setSelectedStudentsByTimeBlock((prev) => ({
      ...prev,
      [timeBlockKey]: selectAll ? studentIds : [],
    }));
  };

  // Handle form submission
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!classSchedule) {
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

    if (!courseId || !markedBy) {
      alert("Missing required information");
      return;
    }

    try {
      // Mark attendance for each timeblock
      const allRequests: Promise<any>[] = [];

      sessions.forEach((session: any, sessionIdx: number) => {
        const timeBlocks = session?.timeBlocks || [];
        const sessionId = session?.id || session?._id;

        timeBlocks.forEach((timeBlock: any, blockIdx: number) => {
          const timeBlockKey = getTimeBlockKey(sessionIdx, blockIdx);
          const selectedStudentIds =
            selectedStudentsByTimeBlock[timeBlockKey] || [];

          // Prepare students array with ALL students (both present and absent)
          const allStudents = (students as any[]).map((student: any) => {
            const studentId = student?.id || student?._id;
            const isPresent = selectedStudentIds.includes(studentId);

            return {
              studentId: studentId,
              status: isPresent ? "present" : "absent",
            };
          });

          // Filter out any students without valid studentId
          const validStudents = allStudents.filter(
            (student) => student.studentId && student.studentId.trim() !== ""
          );

          const payload = {
            courseId: courseId,
            sessionId: sessionId,
            timeBlockKey: timeBlockKey,
            markedBy: markedBy,
            students: validStudents,
          };

          console.log("Attendance Payload:", payload);

          const fixedPayload = {
            ...payload,
            sessionId: String(payload.sessionId),
            timeBlockKey: String(payload.timeBlockKey),
            markedBy: String(payload.markedBy),
            students: payload.students.map((s: any) => ({
              studentId: String(s.studentId),
              status: s.status === "present" ? "present" : "absent",
            })) as { studentId: string; status: "present" | "absent" }[],
          };

          allRequests.push(markBulkAttendance(fixedPayload).unwrap());
        });
      });

      // Wait for all requests to complete
      await Promise.all(allRequests);
      alert("Attendance marked successfully for all classes!");
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
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Mark Attendance
            </h1>
            <p className="text-gray-600 mt-1">
              Course: {classSchedule?.course?.title || "—"}
            </p>
            <p className="text-gray-600">
              Date: {classSchedule?.date || "—"} | Time:{" "}
              {classSchedule?.time || "—"}
            </p>
          </div>
          <Link
            href="/dashboard/class-schedule"
            className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900 transition-colors"
          >
            Back
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {sessions.length === 0 || students.length === 0 ? (
              <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                {sessions.length === 0
                  ? "No sessions configured for this class schedule."
                  : "No students assigned to this class schedule."}
              </div>
            ) : (
              <>
                {/* Grid Table for Attendance */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="sticky left-0 z-10 bg-gray-100 border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900 min-w-[200px]">
                          Learner
                        </th>
                        {/* Column headers for each timeblock */}
                        {sessions.map((session: any, sessionIdx: number) => {
                          const timeBlocks = session?.timeBlocks || [];
                          return timeBlocks.map(
                            (timeBlock: any, blockIdx: number) => {
                              const timeBlockKey = getTimeBlockKey(
                                sessionIdx,
                                blockIdx
                              );
                              return (
                                <th
                                  key={timeBlockKey}
                                  className="border border-gray-300 bg-gray-100 px-3 py-3 text-center font-semibold text-gray-900 min-w-[120px]"
                                >
                                  <div className="text-sm">
                                    <div className="font-medium">
                                      Class {blockIdx + 1}
                                    </div>
                                    <div className="text-xs text-gray-600 mt-1">
                                      {timeBlock.startDate}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      {timeBlock.startTime} -{" "}
                                      {timeBlock.endTime}
                                    </div>
                                  </div>
                                </th>
                              );
                            }
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Student rows */}
                      {students.map((student: any) => {
                        const studentId = student?.id || student?._id;
                        const studentName = student?.firstName || "Unknown";
                        const studentLastName = student?.lastName || "";

                        return (
                          <tr key={studentId}>
                            <td className="sticky left-0 z-10 bg-white border border-gray-300 px-4 py-3 font-medium text-gray-900">
                              <div className="truncate">
                                {studentName} {studentLastName}
                              </div>
                              <div className="text-xs text-gray-600 truncate">
                                {student?.email || "—"}
                              </div>
                            </td>
                            {/* Checkbox cells for each timeblock */}
                            {sessions.map(
                              (session: any, sessionIdx: number) => {
                                const timeBlocks = session?.timeBlocks || [];
                                return timeBlocks.map(
                                  (timeBlock: any, blockIdx: number) => {
                                    const timeBlockKey = getTimeBlockKey(
                                      sessionIdx,
                                      blockIdx
                                    );
                                    const selectedList =
                                      selectedStudentsByTimeBlock[
                                        timeBlockKey
                                      ] || [];
                                    const isPresent =
                                      selectedList.includes(studentId);

                                    return (
                                      <td
                                        key={`${timeBlockKey}-${studentId}`}
                                        className="border border-gray-300 px-3 py-3 text-center"
                                      >
                                        <input
                                          type="checkbox"
                                          className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                                          checked={isPresent}
                                          onChange={(e) => {
                                            console.log(
                                              "Checkbox change event:",
                                              {
                                                timeBlockKey,
                                                studentId,
                                                checked: e.target.checked,
                                                currentList: selectedList,
                                              }
                                            );
                                            handleCheckboxChange(
                                              timeBlockKey,
                                              studentId
                                            );
                                          }}
                                        />
                                      </td>
                                    );
                                  }
                                );
                              }
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Summary info */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {sessions.map((session: any, sessionIdx: number) => {
                      const timeBlocks = session?.timeBlocks || [];
                      return timeBlocks.map(
                        (timeBlock: any, blockIdx: number) => {
                          const timeBlockKey = getTimeBlockKey(
                            sessionIdx,
                            blockIdx
                          );
                          const totalSelected = (
                            selectedStudentsByTimeBlock[timeBlockKey] || []
                          ).length;
                          return (
                            <div
                              key={timeBlockKey}
                              className="p-3 rounded-lg bg-gray-50 border border-gray-200"
                            >
                              <div className="text-xs text-gray-600 font-medium">
                                Class {blockIdx + 1}
                              </div>
                              <div className="text-lg font-bold text-primary-600 mt-1">
                                {totalSelected}/{students.length}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Present
                              </div>
                            </div>
                          );
                        }
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </form>

          {/* Submit Button - Outside form for better visibility */}
          {sessions.length > 0 && students.length > 0 && (
            <div className="flex items-center justify-center pt-6 mt-6 border-t-2 border-gray-200">
              <button
                type="button"
                onClick={handleSubmit}
                className="min-w-[200px] px-12 py-4 rounded-lg bg-blue-600 text-white text-lg font-bold uppercase tracking-wide hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-95"
                disabled={isSubmitting}
              >
                {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttendancePageSingleClass;
