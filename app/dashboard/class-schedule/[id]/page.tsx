"use client";
import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import DynamicForm, { FormField } from "@/app/components/shared/DynamicForm";
import {
  useGetClassScheduleByIdQuery,
  useUpdateClassScheduleMutation,
} from "@/app/redux/services/classScheduleApi";
import { useGetAllCoursesQuery } from "@/app/redux/services/courseApi";
import { useGetUsersQuery } from "@/app/redux/services/userApi";

export default function EditClassSchedulePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { data: scheduleData, isLoading: loadingSchedule } =
    useGetClassScheduleByIdQuery(id, { skip: !id });
  const { data: coursesData } = useGetAllCoursesQuery<any>({});
  const { data: usersData } = useGetUsersQuery({});

  const schedule = (scheduleData as any)?.data || scheduleData;

  const [updateClassSchedule, { isLoading: isUpdating }] =
    useUpdateClassScheduleMutation();

  const courseOptions = useMemo(
    () =>
      (coursesData?.data || coursesData || []).map((course: any) => ({
        value: course.id || course._id,
        label: course.title,
      })),
    [coursesData]
  );

  const instructorOptions = useMemo(
    () =>
      (usersData?.data || [])
        .filter((u: any) => u?.role?.id === 3)
        .map((u: any) => ({
          value: u.id || u._id,
          label: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
        })),
    [usersData]
  );

  const studentOptions = useMemo(
    () =>
      (usersData?.data || [])
        .filter((u: any) => u?.role?.id !== 3)
        .map((u: any) => ({
          value: u.id || u._id,
          label: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
        })),
    [usersData]
  );

  const fields: FormField[] = [
    {
      name: "course",
      label: "Course",
      type: "select",
      options: courseOptions,
      validation: { required: true },
      placeholder: "Select course",
    },
    {
      name: "instructor",
      label: "Instructor",
      type: "select",
      options: instructorOptions,
      placeholder: "Select instructor",
      validation: { required: true },
    },
    {
      name: "students",
      label: "Student",
      type: "select",
      options: studentOptions,
      placeholder: "Select student",
      validation: { required: true },
    },
    {
      name: "date",
      label: "Date",
      type: "date",
      validation: { required: true },
    },
    {
      name: "time",
      label: "Time",
      type: "text",
      placeholder: "HH:MM",
      validation: { required: true },
    },
    {
      name: "duration",
      label: "Duration (minutes)",
      type: "number",
      defaultValue: 60,
      validation: { required: true, min: 1 },
    },
    {
      name: "securityKey",
      label: "Security Key",
      type: "text",
      placeholder: "Enter security key",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "scheduled", label: "Scheduled" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
      ],
      defaultValue: "scheduled",
    },
  ];

  const initialData = {
    course: schedule?.course?._id || schedule?.course?.id || "",
    instructor: schedule?.instructor?._id || schedule?.instructor?.id || "",
    students: Array.isArray(schedule?.students)
      ? schedule?.students?.[0] || ""
      : schedule?.students || "",
    date: schedule?.date || "",
    time: schedule?.time || "",
    duration: schedule?.duration || 60,
    securityKey: schedule?.securityKey || "",
    status: schedule?.status || "scheduled",
  };

  const handleSubmit = async (payload: Record<string, any>) => {
    await updateClassSchedule({ id, body: payload }).unwrap();
    router.push("/dashboard/class-schedule");
  };

  return (
    <div className="page-wrapper" style={{ minHeight: 730 }}>
      <div className="content container-fluid">
        <DynamicForm
          config={{
            title: "Edit Class Schedule",
            submitText: "Update Schedule",
            fields,
            columns: 2,
          }}
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
          loading={loadingSchedule || isUpdating}
        />
      </div>
    </div>
  );
}
