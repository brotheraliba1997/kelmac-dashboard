"use client";
import EnrollmentComponent from "@/app/components/enrollment-components/create-enrollment-component";
import {
  useGetEnrollmentByIdQuery,
  useUpdateEnrollmentMutation,
} from "@/app/redux/services/enrollmentApi";
import { useGetUsersQuery } from "@/app/redux/services/userApi";
import { useGetAllCoursesQuery } from "@/app/redux/services/courseApi";
import { useParams } from "next/navigation";

export default function EditEnrollment() {
  const { id } = useParams();

  const { data: findOne } = useGetEnrollmentByIdQuery(id as string);
  const [updateEnrollment, { isLoading, isSuccess }] =
    useUpdateEnrollmentMutation();

  const { data: usersData } = useGetUsersQuery({});
  const { data: coursesData } = useGetAllCoursesQuery({});

  // Handle different response structures
  const users = (usersData as any)?.data || usersData || [];
  const courses = (coursesData as any)?.data || coursesData || [];

  return (
    <EnrollmentComponent
      updateEnrollment={updateEnrollment}
      findOne={findOne}
      id={id as string}
      isLoading={isLoading}
      users={users}
      courses={courses}
      offers={[]} // TODO: Add offers API when available
    />
  );
}
