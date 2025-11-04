"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaTimes,
  FaSpinner,
  FaUser,
  FaBook,
  FaPercent,
  FaCalendar,
} from "react-icons/fa";

// Define interfaces for type safety
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface Course {
  id: string;
  title: string;
  instructor: {
    firstName: string;
    lastName: string;
  };
  price: number;
}

interface Offer {
  id: string;
  title: string;
  discountPercentage: number;
}

interface EnrollmentFormData {
  user: string;
  course: string;
  payment?: string;
  offer?: string;
  progress: number;
  status: "active" | "completed" | "cancelled";
  completionDate?: string;
}

interface EnrollmentFormErrors {
  user?: string;
  course?: string;
  payment?: string;
  offer?: string;
  progress?: string;
  status?: string;
  completionDate?: string;
}

interface EnrollmentComponentProps {
  createEnrollment?: any;
  updateEnrollment?: any;
  findOne?: any;
  isLoading?: boolean;
  users?: User[];
  courses?: Course[];
  offers?: Offer[];
  id?: string;
}

export default function EnrollmentComponent({
  createEnrollment,
  updateEnrollment,
  findOne,
  isLoading = false,
  users = [],
  courses = [],
  offers = [],
  id,
}: EnrollmentComponentProps) {
  const router = useRouter();
  const isEditMode = !!findOne && !!id;

  const [formData, setFormData] = useState<EnrollmentFormData>({
    user: "",
    course: "",
    payment: "",
    offer: "",
    progress: 0,
    status: "active",
    completionDate: "",
  });

  const [errors, setErrors] = useState<EnrollmentFormErrors>({});
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Initialize form data for edit mode
  useEffect(() => {
    if (isEditMode && findOne) {
      setFormData({
        user: findOne.user?.id || "",
        course: findOne.course?.id || "",
        payment: findOne.payment?.id || "",
        offer: findOne.offer?.id || "",
        progress: findOne.progress || 0,
        status: findOne.status || "active",
        completionDate: findOne.completionDate
          ? new Date(findOne.completionDate).toISOString().split("T")[0]
          : "",
      });
      setSelectedCourse(findOne.course || null);
    }
  }, [isEditMode, findOne]);

  // Filter users to show only students
  useEffect(() => {
    const studentUsers = users.filter(
      (user) => user.role === "student" || user.role === "user"
    );
    setFilteredUsers(studentUsers);
  }, [users]);

  // Update selected course when course changes
  useEffect(() => {
    if (formData.course) {
      const course = courses.find((c) => c.id === formData.course);
      setSelectedCourse(course || null);
    }
  }, [formData.course, courses]);

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: EnrollmentFormErrors = {};

    // Required field validations
    if (!formData.user) {
      newErrors.user = "Student is required";
    }

    if (!formData.course) {
      newErrors.course = "Course is required";
    }

    // Progress validation
    if (formData.progress < 0 || formData.progress > 100) {
      newErrors.progress = "Progress must be between 0 and 100";
    }

    // Status-specific validations
    if (formData.status === "completed") {
      if (!formData.completionDate) {
        newErrors.completionDate =
          "Completion date is required for completed enrollments";
      }
      if (formData.progress < 100) {
        newErrors.progress = "Progress must be 100% for completed enrollments";
      }
    }

    if (formData.completionDate && formData.status !== "completed") {
      newErrors.completionDate =
        "Completion date can only be set for completed enrollments";
    }

    // Date validation
    if (formData.completionDate) {
      const completionDate = new Date(formData.completionDate);
      const today = new Date();
      if (completionDate > today) {
        newErrors.completionDate = "Completion date cannot be in the future";
      }
    }

    // Business logic validation
    if (formData.status === "cancelled" && formData.progress > 0) {
      if (
        !confirm(
          "Are you sure you want to cancel an enrollment with progress? This action may affect the student's record."
        )
      ) {
        return false;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    let processedValue: string | number = value;

    // Special handling for progress
    if (name === "progress") {
      processedValue = Math.min(100, Math.max(0, Number(value)));
    }

    // Auto-set completion date when status changes to completed
    if (
      name === "status" &&
      value === "completed" &&
      !formData.completionDate
    ) {
      setFormData((prev) => ({
        ...prev,
        status: value as "completed",
        completionDate: new Date().toISOString().split("T")[0],
        progress: prev.progress === 0 ? 100 : prev.progress,
      }));
    } else if (name === "status" && value !== "completed") {
      setFormData((prev) => ({
        ...prev,
        status: value as "active" | "cancelled",
        completionDate: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: processedValue,
      }));
    }

    // Clear error when user starts typing
    if (errors[name as keyof EnrollmentFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const submitData = {
        ...formData,
        progress: Number(formData.progress),
        completionDate: formData.completionDate || undefined,
      };

      if (isEditMode && updateEnrollment) {
        await updateEnrollment({
          id,
          data: submitData,
        }).unwrap();
      } else if (createEnrollment) {
        await createEnrollment(submitData).unwrap();
      }

      router.push("/dashboard/courses/enrollments");
    } catch (error: any) {
      console.error("Error submitting enrollment:", error);
      // Handle API errors
      if (error.data?.message) {
        alert(`Error: ${error.data.message}`);
      } else {
        alert("An error occurred while saving the enrollment");
      }
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return "bg-danger";
    if (progress < 70) return "bg-warning";
    return "bg-success";
  };

  return (
    <div className="page-wrapper" style={{ minHeight: "100vh" }}>
      <div className="content container-fluid">
        <div className="row justify-content-center">
          <div className="col-xl-10 col-12">
            <div className="card">
              <div className="card-header py-3 bg-gradient">
                <div className="row align-items-center">
                  <div className="col">
                    <h4 className="card-title mb-0">
                      {isEditMode ? "Edit Enrollment" : "Create New Enrollment"}
                    </h4>
                    <p className="text-muted mb-0 mt-1">
                      {isEditMode
                        ? "Update enrollment details and progress"
                        : "Enroll a student in a course"}
                    </p>
                  </div>
                  <div className="col-auto">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => router.back()}
                    >
                      <FaTimes className="me-1" />
                      Cancel
                    </button>
                  </div>
                </div>
              </div>

              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    {/* Student Selection */}
                    <div className="col-md-6">
                      <label className="form-label d-flex align-items-center">
                        <FaUser className="me-2 text-primary" />
                        Student *
                      </label>
                      <select
                        name="user"
                        className={`form-select ${
                          errors.user ? "is-invalid" : ""
                        }`}
                        value={formData.user}
                        onChange={handleInputChange}
                        disabled={isEditMode} // Don't allow changing student in edit mode
                      >
                        <option value="">Select a student</option>
                        {filteredUsers.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.firstName} {user.lastName} ({user.email})
                          </option>
                        ))}
                      </select>
                      {errors.user && (
                        <div className="invalid-feedback">{errors.user}</div>
                      )}
                    </div>

                    {/* Course Selection */}
                    <div className="col-md-6">
                      <label className="form-label d-flex align-items-center">
                        <FaBook className="me-2 text-success" />
                        Course *
                      </label>
                      <select
                        name="course"
                        className={`form-select ${
                          errors.course ? "is-invalid" : ""
                        }`}
                        value={formData.course}
                        onChange={handleInputChange}
                        disabled={isEditMode} // Don't allow changing course in edit mode
                      >
                        <option value="">Select a course</option>
                        {courses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.title} - ${course.price}
                          </option>
                        ))}
                      </select>
                      {errors.course && (
                        <div className="invalid-feedback">{errors.course}</div>
                      )}
                      {selectedCourse && (
                        <div className="mt-2 p-2 bg-light rounded">
                          <small className="text-muted">
                            <strong>Instructor:</strong>{" "}
                            {selectedCourse.instructor?.firstName}{" "}
                            {selectedCourse.instructor?.lastName}
                          </small>
                        </div>
                      )}
                    </div>

                    {/* Progress */}
                    <div className="col-md-6">
                      <label className="form-label d-flex align-items-center">
                        <FaPercent className="me-2 text-info" />
                        Progress (%)
                      </label>
                      <input
                        type="number"
                        name="progress"
                        className={`form-control ${
                          errors.progress ? "is-invalid" : ""
                        }`}
                        value={formData.progress}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        placeholder="Enter progress percentage"
                      />
                      {errors.progress && (
                        <div className="invalid-feedback">
                          {errors.progress}
                        </div>
                      )}
                      <div className="mt-2">
                        <div className="progress" style={{ height: "8px" }}>
                          <div
                            className={`progress-bar ${getProgressColor(
                              formData.progress
                            )}`}
                            role="progressbar"
                            style={{ width: `${formData.progress}%` }}
                          />
                        </div>
                        <small className="text-muted">
                          {formData.progress}% completed
                        </small>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-md-6">
                      <label className="form-label">Status</label>
                      <select
                        name="status"
                        className="form-select"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    {/* Completion Date */}
                    {formData.status === "completed" && (
                      <div className="col-md-6">
                        <label className="form-label d-flex align-items-center">
                          <FaCalendar className="me-2 text-warning" />
                          Completion Date *
                        </label>
                        <input
                          type="date"
                          name="completionDate"
                          className={`form-control ${
                            errors.completionDate ? "is-invalid" : ""
                          }`}
                          value={formData.completionDate}
                          onChange={handleInputChange}
                        />
                        {errors.completionDate && (
                          <div className="invalid-feedback">
                            {errors.completionDate}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Offer Selection */}
                    <div className="col-md-6">
                      <label className="form-label">Special Offer</label>
                      <select
                        name="offer"
                        className="form-select"
                        value={formData.offer}
                        onChange={handleInputChange}
                      >
                        <option value="">No special offer</option>
                        {offers.map((offer) => (
                          <option key={offer.id} value={offer.id}>
                            {offer.title} ({offer.discountPercentage}% off)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="row mt-4">
                    <div className="col-12">
                      <div className="d-flex gap-3 justify-content-end">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => router.back()}
                          disabled={isLoading}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <FaSpinner className="spinner-border spinner-border-sm me-2" />
                              {isEditMode ? "Updating..." : "Creating..."}
                            </>
                          ) : (
                            <>
                              {isEditMode
                                ? "Update Enrollment"
                                : "Create Enrollment"}
                            </>
                          )}
                        </button>
                      </div>
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
