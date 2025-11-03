"use client";
import {
  useGetCourseByIdQuery,
  useUpdateCourseMutation,
} from "@/app/redux/services/courseApi";
import { useParams } from "next/navigation";
import CreateCourse from "../create/page";
import Coursescomponents from "@/app/components/courses-components/create-components";
import { useGetUsersQuery } from "@/app/redux/services/userApi";

export default function CourseDetail() {
  const { id } = useParams();
  const { data: findOne } = useGetCourseByIdQuery(id);
   const { data, error } = useGetUsersQuery({});
  const [updateCourse, { isLoading, isSuccess }] =
    useUpdateCourseMutation();

  return <Coursescomponents findOne={findOne} createCourse={updateCourse} id={id} isLoading={isLoading} data={data} />;
}
