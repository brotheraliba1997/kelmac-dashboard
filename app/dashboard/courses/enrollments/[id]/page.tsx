"use client";
import DynamicEnrollmentForm from "@/app/components/enrollment-components/dynamic-enrollment-form";
import { useParams } from "next/navigation";

export default function EditEnrollment() {
  const { id } = useParams();

  return <DynamicEnrollmentForm mode="edit" enrollmentId={id as string} />;
}
