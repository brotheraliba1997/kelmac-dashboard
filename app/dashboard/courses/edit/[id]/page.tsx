"use client";
import React from "react";
import { useParams } from "next/navigation";
import DynamicCourseForm from "../../../../components/courses-components/dynamic-course-form";

export default function EditCoursePage() {
  const { id } = useParams();

  return <DynamicCourseForm mode="edit" courseId={id as string} />;
}
