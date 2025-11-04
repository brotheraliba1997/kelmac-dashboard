"use client";
import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import DynamicForm, {
  DynamicFormConfig,
} from "../../components/shared/DynamicForm";
import { FaUser, FaBook, FaPercent, FaCalendar } from "react-icons/fa";
import { useGetUsersQuery } from "../../redux/services/userApi";
import { useGetAllCoursesQuery } from "../../redux/services/courseApi";
import {
  useCreateEnrollmentMutation,
  useUpdateEnrollmentMutation,
  useGetEnrollmentByIdQuery,
} from "../../redux/services/enrollmentApi";

interface DynamicEnrollmentFormProps {
  mode?: "create" | "edit";
  enrollmentId?: string;
}

export default function DynamicEnrollmentForm({
  mode = "create",
  enrollmentId,
}: DynamicEnrollmentFormProps) {
  const router = useRouter();
  const isEditMode = mode === "edit";

  // API hooks
  const [createEnrollment, { isLoading: isCreating }] =
    useCreateEnrollmentMutation();
  const [updateEnrollment, { isLoading: isUpdating }] =
    useUpdateEnrollmentMutation();

  // Fetch enrollment data for edit mode
  const {
    data: enrollmentData,
    error: enrollmentError,
    isLoading: enrollmentLoading,
  } = useGetEnrollmentByIdQuery(enrollmentId as string, {
    skip: !isEditMode || !enrollmentId,
  });

  // Fetch users with role filter 2 (students)
  const {
    data: usersData,
    error: usersError,
    isLoading: usersLoading,
  } = useGetUsersQuery({ role: 2 });

  // Debug: Let's also try without filter to see all users
  console.log("Users API Query Params:", { role: 2 });
  console.log("Raw Users Data:", usersData);
  console.log("Users Error:", usersError);

  // Fetch all courses
  const {
    data: coursesData,
    error: coursesError,
    isLoading: coursesLoading,
  } = useGetAllCoursesQuery({});

  // Process enrollment data for edit mode
  const processedEnrollmentData = useMemo(() => {
    if (!isEditMode || !enrollmentData) return {};

    const enrollment = enrollmentData as any; // Type assertion for API response
    return {
      user: enrollment?.user?.id || enrollment?.user,
      course: enrollment?.course?.id || enrollment?.course,
      progress: enrollment?.progress || 0,
      status: enrollment?.status || "active",
      completionDate: enrollment?.completionDate
        ? new Date(enrollment.completionDate).toISOString().split("T")[0]
        : "",
      notes: enrollment?.notes || "",
      sendNotification: false, // Default for edit mode
    };
  }, [isEditMode, enrollmentData]);

  // Process users data - handle different response structures
  const users = useMemo(() => {
    if (!usersData) return [];
    return Array.isArray(usersData)
      ? usersData
      : (usersData as any)?.data || (usersData as any)?.users || [];
  }, [usersData]);

  // Process courses data - handle different response structures
  const courses = useMemo(() => {
    if (!coursesData) return [];
    return Array.isArray(coursesData)
      ? coursesData
      : (coursesData as any)?.data || (coursesData as any)?.courses || [];
  }, [coursesData]);

  // Create user options for the select field
  const userOptions = useMemo(() => {
    return users.map((user: any) => ({
      value: user.id || user._id,
      label: `${user.firstName || "Unknown"} ${user.lastName || ""} (${
        user.email
      })`.trim(),
    }));
  }, [users]);

  // Create course options for the select field
  const courseOptions = useMemo(() => {
    return courses.map((course: any) => ({
      value: course.id || course._id,
      label: `${course.title} - $${course.price || 0}`,
    }));
  }, [courses]);

  // Dynamic form configuration for enrollment with API data
  const enrollmentFormConfig: DynamicFormConfig = useMemo(
    () => ({
      title: isEditMode ? "Edit Enrollment" : "Create Enrollment",
      description: isEditMode
        ? "Update enrollment details"
        : "Enroll a student in a course",
      submitText: isEditMode ? "Update Enrollment" : "Create Enrollment",
      cancelText: "Cancel",
      layout: "vertical",
      columns: 2,
      showProgress: !isEditMode, // Only show progress for create mode
      fields: [
        {
          name: "user",
          label: "Student",
          type: "select",
          placeholder: usersLoading
            ? "Loading students..."
            : "Select a student",
          validation: {
            required: true,
          },
          options: userOptions,
          disabled: usersLoading || !!usersError || isEditMode, // Disable in edit mode
        },
        {
          name: "course",
          label: "Course",
          type: "select",
          placeholder: coursesLoading
            ? "Loading courses..."
            : "Select a course",
          validation: {
            required: true,
          },
          options: courseOptions,
          disabled: coursesLoading || !!coursesError || isEditMode, // Disable in edit mode
        },
        {
          name: "progress",
          label: "Initial Progress (%)",
          type: "range",
          defaultValue: 0,
          validation: {
            min: 0,
            max: 100,
          },
        },
        {
          name: "status",
          label: "Status",
          type: "radio",
          defaultValue: "active",
          options: [
            { value: "active", label: "Active" },
            { value: "completed", label: "Completed" },
            { value: "cancelled", label: "Cancelled" },
          ],
          validation: {
            required: true,
          },
        },
        {
          name: "completionDate",
          label: "Completion Date",
          type: "date",
          dependency: {
            field: "status",
            value: "completed",
            show: true,
          },
          validation: {
            custom: (value, formData) => {
              if (formData?.status === "completed" && !value) {
                return "Completion date is required for completed enrollments";
              }
              return null;
            },
          },
        },
        {
          name: "notes",
          label: "Additional Notes",
          type: "textarea",
          placeholder: "Any additional notes about this enrollment",
          validation: {
            maxLength: 500,
          },
        },
        {
          name: "sendNotification",
          label: "Send notification email to student",
          type: "checkbox",
          defaultValue: true,
          description: "Student will receive an enrollment confirmation email",
        },
      ],
    }),
    [
      isEditMode,
      userOptions,
      courseOptions,
      usersLoading,
      coursesLoading,
      usersError,
      coursesError,
    ]
  );

  const handleSubmit = async (data: Record<string, any>) => {
    console.log(
      `${isEditMode ? "Updating" : "Creating"} enrollment with data:`,
      data
    );

    try {
      const enrollmentData = {
        user: data.user,
        course: data.course,
        progress: Number(data.progress) || 0,
        status: data.status || "active",
        completionDate: data.completionDate || undefined,
        notes: data.notes || undefined,
      };

      if (isEditMode && enrollmentId) {
        await updateEnrollment({
          id: enrollmentId,
          data: enrollmentData,
        }).unwrap();
        alert("Enrollment updated successfully!");
      } else {
        await createEnrollment(enrollmentData).unwrap();
        alert("Enrollment created successfully!");
      }

      router.push("/dashboard/courses/enrollments");
    } catch (error: any) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} enrollment:`,
        error
      );

      // Handle different error formats
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        `Failed to ${
          isEditMode ? "update" : "create"
        } enrollment. Please try again.`;
      alert(errorMessage);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // Show loading state
  if (usersLoading || coursesLoading || (isEditMode && enrollmentLoading)) {
    return (
      <div className="page-wrapper" style={{ minHeight: "100vh" }}>
        <div className="content container-fluid">
          <div className="row justify-content-center">
            <div className="col-xl-10">
              <div className="card">
                <div className="card-body">
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: "300px" }}
                  >
                    <div className="text-center">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-3 text-muted">
                        Loading{" "}
                        {isEditMode && enrollmentLoading
                          ? "enrollment data"
                          : usersLoading && coursesLoading
                          ? "students and courses"
                          : usersLoading
                          ? "students"
                          : "courses"}
                        ...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (usersError || coursesError || (isEditMode && enrollmentError)) {
    return (
      <div className="page-wrapper" style={{ minHeight: "100vh" }}>
        <div className="content container-fluid">
          <div className="row justify-content-center">
            <div className="col-xl-10">
              <div className="card">
                <div className="card-body">
                  <div className="alert alert-danger">
                    <h4 className="alert-heading">Error Loading Data</h4>
                    {!!enrollmentError && isEditMode && (
                      <p className="mb-2">
                        <strong>Enrollment Error:</strong> Failed to load
                        enrollment data
                      </p>
                    )}
                    {!!usersError && (
                      <p className="mb-2">
                        <strong>Students Error:</strong> Failed to load students
                      </p>
                    )}
                    {!!coursesError && (
                      <p className="mb-0">
                        <strong>Courses Error:</strong> Failed to load courses
                      </p>
                    )}
                    <hr />
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => window.location.reload()}
                    >
                      Retry
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{ minHeight: "100vh" }}>
      <div className="content container-fluid">
        <div className="row justify-content-center">
          <div className="col-xl-10">
            <div className="card">
              <div className="card-body">
                <DynamicForm
                  config={enrollmentFormConfig}
                  initialData={isEditMode ? processedEnrollmentData : {}}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                  loading={isCreating || isUpdating}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
