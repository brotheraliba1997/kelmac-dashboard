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
      alert("Class schedule not founds");
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
      <div className="page-wrapper" style={{ minHeight: 730 }}>
        <div className="content container-fluid">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "400px" }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (scheduleError || !classSchedule) {
    return (
      <div className="page-wrapper" style={{ minHeight: 730 }}>
        <div className="content container-fluid">
          <div className="alert alert-danger">
            <h5>Error</h5>
            <p>Class schedule not found or failed to load.</p>
            <Link href="/dashboard/class-schedule" className="btn btn-primary">
              Back to Class Schedule
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{ minHeight: 730 }}>
      <div className="content container-fluid">
        <div className="row justify-content-center">
          <div className="col-xl-10 col-12">
            <div className="card-header py-3 bg-gradient">
              <div className="row">
                <div className="col">
                  <h4 className="card-title">Mark Attendance</h4>
                  <p className="text-muted mb-0">
                    Course: {classSchedule?.course?.title || "—"}
                  </p>
                  <p className="text-muted mb-0">
                    Date: {classSchedule?.date || "—"} | Time:{" "}
                    {classSchedule?.time || "—"}
                  </p>
                </div>
                <div className="col-auto">
                  <Link
                    href="/dashboard/class-schedule"
                    className="btn btn-outline-secondary btn-sm"
                  >
                    Back
                  </Link>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <h5 className="mb-3">Select Present Students</h5>
                    {students.length === 0 ? (
                      <div className="alert alert-info">
                        No students assigned to this class schedule.
                      </div>
                    ) : (
                      <div className="list-group">
                        {students.map((student: any) => {
                          const studentId = student?.id || student?._id;
                          const studentName = student?.firstName || "Unknown";
                          const studentLastName = student?.lastName || "";
                          const studentEmail = student?.email || "—";

                          return (
                            <div
                              key={studentId}
                              className="list-group-item d-flex align-items-center"
                            >
                              <div className="form-check me-3">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={selectedStudents.has(studentId)}
                                  onChange={() =>
                                    handleCheckboxChange(studentId)
                                  }
                                  id={`student-${studentId}`}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`student-${studentId}`}
                                ></label>
                              </div>
                              <div className="grow">
                                <div className="fw-semibold">
                                  {studentName} {studentLastName}
                                </div>
                                <div className="text-muted small">
                                  {studentEmail}
                                </div>
                              </div>
                              <div>
                                {selectedStudents.has(studentId) ? (
                                  <span className="badge bg-success">
                                    Present
                                  </span>
                                ) : (
                                  <span className="badge bg-danger">
                                    Absent
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <div>
                      <span className="text-muted">
                        Selected: {selectedStudents.size} / {students.length}
                      </span>
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting || students.length === 0}
                      >
                        {isSubmitting ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Submitting...
                          </>
                        ) : (
                          "Mark Attendance"
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendancePageSingleClass;
