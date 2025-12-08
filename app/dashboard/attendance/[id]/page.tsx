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

  // Attendance mutation
  const [markBulkAttendance, { isLoading: isSubmitting }] =
    useMarkBulkAttendanceMutation();

  // State for selected students (checkboxes)
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(
    new Set()
  );

  // Initialize with all students selected by default (optional)
  useEffect(() => {
    if (students.length > 0) {
      const allStudentIds = students.map(
        (student: any) => student?.id || student?._id
      );
      setSelectedStudents(new Set(allStudentIds));
    }
  }, [students]);

  // Handle checkbox change
  const handleCheckboxChange = (studentId: string) => {
    setSelectedStudents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    const sessionId = classSchedule?.sessionId;
    const markedBy = user?._id || user?.id || "";

    if (!courseId || !sessionId || !markedBy) {
      alert("Missing required information");
      return;
    }

    // Prepare students array with ALL students (both present and absent)
    // Each student must have both studentId and status
    const allStudents = (students as any[]).map((student: any) => {
      const studentId = student?.id || student?._id;
      const isPresent = selectedStudents.has(studentId);

      return {
        studentId: studentId,
        status: isPresent ? "present" : "absent",
      };
    });

    // Filter out any students without valid studentId
    const validStudents = allStudents.filter(
      (student) => student.studentId && student.studentId.trim() !== ""
    );

    try {
      const payload = {
        courseId: courseId, // Only the ID string
        sessionId: sessionId,
        markedBy: markedBy,
        students: validStudents,
      };

      console.log("Attendance Payload:", payload);

      const fixedPayload = {
        ...payload,
        sessionId: String(payload.sessionId),
        markedBy: String(payload.markedBy),
        students: payload.students.map((s: any) => ({
          studentId: String(s.studentId),
          status: s.status === "present" ? "present" : "absent",
        })) as { studentId: string; status: "present" | "absent" }[],
      };
      await markBulkAttendance(fixedPayload).unwrap();
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
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
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
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Select Present Students
              </h2>
              {students.length === 0 ? (
                <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                  No students assigned to this class schedule.
                </div>
              ) : (
                <div className="divide-y divide-gray-100 rounded-lg border border-gray-200 overflow-hidden">
                  {students.map((student: any) => {
                    const studentId = student?.id || student?._id;
                    const studentName = student?.firstName || "Unknown";
                    const studentLastName = student?.lastName || "";
                    const studentEmail = student?.email || "—";

                    const isPresent = selectedStudents.has(studentId);

                    return (
                      <label
                        key={studentId}
                        className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          checked={isPresent}
                          onChange={() => handleCheckboxChange(studentId)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 truncate">
                            {studentName} {studentLastName}
                          </div>
                          <div className="text-sm text-gray-600 truncate">
                            {studentEmail}
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isPresent
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {isPresent ? "Present" : "Absent"}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Selected: {selectedStudents.size} / {students.length}
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors disabled:opacity-60"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Mark Attendance"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AttendancePageSingleClass;
