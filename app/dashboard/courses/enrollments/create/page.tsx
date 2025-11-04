"use client";
import EnrollmentComponent from "@/app/components/enrollment-components/create-enrollment-component";
import { useCreateEnrollmentMutation } from "@/app/redux/services/enrollmentApi";
import { useGetUsersQuery } from "@/app/redux/services/userApi";
import { useGetAllCoursesQuery } from "@/app/redux/services/courseApi";

export default function CreateEnrollment() {
  const [createEnrollment, { isLoading, isSuccess, isError }] =
    useCreateEnrollmentMutation();

  const { data: usersData } = useGetUsersQuery({});
  const { data: coursesData } = useGetAllCoursesQuery({});

  // Handle different response structures
  const users = (usersData as any)?.data || usersData || [];
  const courses = (coursesData as any)?.data || coursesData || [];

  return (
    <EnrollmentComponent
      createEnrollment={createEnrollment}
      isLoading={isLoading}
      users={users}
      courses={courses}
      offers={[]} // TODO: Add offers API when available
    />
  );
}
