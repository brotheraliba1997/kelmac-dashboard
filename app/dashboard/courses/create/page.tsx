"use client";
import Coursescomponents from "@/app/components/courses-components/create-components";
import {
  useCreateCourseMutation,
  useGetCourseByIdQuery,
} from "@/app/redux/services/courseApi";
import { useGetUsersQuery } from "@/app/redux/services/userApi";
import { GetUserRoleName } from "@/app/utils/getUserRoleName";
import { useRouter } from "next/navigation";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

export default function CreateCourse({ findOne }: { findOne?: any }) {
  const [createCourse, { isLoading, isSuccess, isError }] =
    useCreateCourseMutation();
  const { data, error } = useGetUsersQuery({});

  return <Coursescomponents createCourse={createCourse} isLoading={isLoading} data={data} />;
}
