"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
// ← adjust path if needed
import { FaTimes } from "react-icons/fa";
import { useCreateClassScheduleMutation } from "@/app/redux/services/classScheduleApi";
import { useGetAllCoursesQuery } from "@/app/redux/services/courseApi";
import { useGetUsersQuery } from "@/app/redux/services/userApi";
import { GetUserRoleName } from "@/app/utils/getUserRoleName";

interface ClassScheduleForm {
  course: string;
  instructor: string;
  students: string;
  date: string;
  time: string;
  duration: number;

  securityKey: string;
  status: string;
}

export default function ClassScheduleComponent({ findOne }: any) {
  const router = useRouter();
  const [createClassSchedule, { isLoading }] = useCreateClassScheduleMutation();
  const { data, error } = useGetAllCoursesQuery<any>({});

  const courses = (data?.data || data || []) as any[];
  console.log("Courses for Class Schedule:", courses);

  const { data: user, error: err } = useGetUsersQuery({});

  const [formData, setFormData] = useState<ClassScheduleForm>({
    course: "",
    instructor: "",
    students: "",
    date: "",
    time: "",
    duration: 60,

    securityKey: "",
    status: "scheduled",
  });

  // ✅ Populate data if editing
  useEffect(() => {
    if (findOne) {
      setFormData({
        course: findOne.course?._id || "",
        instructor: findOne.instructor?._id || "",
        students: findOne.students || "",
        date: findOne.date || "",
        time: findOne.time || "",
        duration: findOne.duration || 60,

        securityKey: findOne.securityKey || "",
        status: findOne.status || "scheduled",
      });
    }
  }, [findOne]);

  // ✅ Handle input changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "duration" ? Number(value) : value,
    }));
  };

  // ✅ Add / Remove student emails dynamically
  //   const handleAddStudent = () => {
  //     setFormData({ ...formData, students: [...formData.students, ""] });
  //   };

//   const handleStudentChange = (index: number, value: string) => {
//     const updated = [...formData.students];
//     updated[index] = value;
//     setFormData({ ...formData, students: updated });
//   };

  const removeStudent = (index: number) => {
    const updated = [...formData.students];
    updated.splice(index, 1);
    setFormData({ ...formData });
  };

  // ✅ Submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await createClassSchedule(formData).unwrap();
    router.push("/dashboard/class-schedule");
  };

  console.log(formData, "formdata");
  return (
    <div
      className="container py-5"
      style={{ marginLeft: "240px", marginTop: "50px" }}
    >
      <div className="card p-4 shadow w-75 mx-auto">
        <h4 className="mb-4 fw-bold">Create Class Schedule</h4>

        <form onSubmit={handleSubmit} className="row">
          {/* Course */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-medium">Course</label>
            <select
              className="form-select"
              name="course"
              value={formData.course}
              onChange={handleChange}
            >
              <option value="">Select Course</option>

              {courses?.map((course: any) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          {/* Instructor */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-medium">Instructor</label>
            <select
              className="form-select"
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
            >
              <option value="">Select Instructor</option>

              {user?.data?.map((instructor: any) =>
                instructor?.role?.id === 3 ? (
                  <option key={instructor.id} value={instructor.id}>
                    {`${instructor.firstName || ""} ${
                      instructor.lastName || ""
                    }`.trim()}
                  </option>
                ) : null
              )}
            </select>
          </div>

          {/* Date */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-medium">Date</label>
            <input
              type="date"
              className="form-control"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          {/* Time */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-medium">Time</label>
            <input
              type="time"
              className="form-control"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>

          {/* Duration */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-medium">Duration (minutes)</label>
            <input
              type="number"
              className="form-control"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </div>

          {/* Google Meet Link */}
          {/* <div className="col-md-6 mb-3">
            <label className="form-label fw-medium">Google Meet Link</label>
            <input
              type="text"
              className="form-control"
              name="googleMeetLink"
              placeholder="https://meet.google.com/..."
              value={formData.googleMeetLink}
              onChange={handleChange}
            />
          </div> */}

          {/* Security Key */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-medium">Security Key</label>
            <input
              type="text"
              className="form-control"
              name="securityKey"
              placeholder="Enter Security Key"
              value={formData.securityKey}
              onChange={handleChange}
            />
          </div>

          {/* Status */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-medium">Status</label>
            <select
              className="form-select"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Students */}
          {/* <div className="col-md-12 mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="form-label fw-medium mb-0">Students</label>
              <button
                type="button"
                className="btn btn-sm btn-outline-success"
                onClick={handleAddStudent}
              >
                + Add Student
              </button>

              {user?.data?.map((instructor: any) =>
                instructor?.role?.id !== 3 ? (
                  <option key={instructor.id} value={instructor.id}>
                    {`${instructor.firstName || ""} ${
                      instructor.lastName || ""
                    }`.trim()}
                  </option>
                ) : null
              )}

              <select
                className="form-select"
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
              >
                <option value="">Select Instructor</option>

                {user?.data?.map((instructor: any) =>
                  instructor?.role?.id === 3 ? (
                    <option key={instructor.id} value={instructor.id}>
                      {`${instructor.firstName || ""} ${
                        instructor.lastName || ""
                      }`.trim()}
                    </option>
                  ) : null
                )}
              </select>
            </div>

            {formData.students.map((student, i) => (
              <div key={i} className="d-flex align-items-center mb-2 gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter student email or ID"
                  value={student}
                  onChange={(e) => handleStudentChange(i, e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => removeStudent(i)}
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div> */}

          <div className="col-md-6 mb-3">
            <label className="form-label fw-medium">Student</label>
            <select
              className="form-select"
              name="students"
              value={formData.students}
              onChange={handleChange}
            >
              <option value="">Select Student</option>

              {user?.data?.map((instructor: any) =>
                instructor?.role?.id !== 3 ? (
                  <option key={instructor.id} value={instructor.id}>
                    {`${instructor.firstName || ""} ${
                      instructor.lastName || ""
                    }`.trim()}
                  </option>
                ) : null
              )}
            </select>
          </div>

          {/* Submit */}
          <div className="col-md-12 mt-3 text-end border-top pt-3">
            <button
              type="submit"
              className="btn btn-primary fw-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2"></i> Creating...
                </>
              ) : (
                <>
                  <i className="fas fa-save me-2"></i> Create Schedule
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
