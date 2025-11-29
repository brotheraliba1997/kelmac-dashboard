"use client";

import DynamicForm, {
  DynamicFormConfig,
} from "@/app/components/shared/DynamicForm";
import { useCreateUserMutation } from "@/app/redux/services/userApi";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const roleOptions = [
  { value: 1, label: "Admin" },
  { value: 2, label: "Student" },
  { value: 3, label: "Instructor" },
  { value: 4, label: "Corporate" },
  { value: 5, label: "Finance" },
];

const statusOptions = [
  { value: 1, label: "Active" },
  { value: 2, label: "Pending" },
  { value: 3, label: "Blocked" },
];

const userFormConfig: DynamicFormConfig = {
  title: "Create User",
  submitText: "Submit",
  columns: 3,
  fields: [
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      placeholder: "Enter first name",
      validation: { required: true },
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
      placeholder: "Enter last name",
      validation: { required: true },
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter email",
      validation: { required: true },
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter password",
      validation: { required: true, minLength: 6 },
    },
    {
      name: "company",
      label: "Company",
      type: "text",
      placeholder: "Enter company name",
      validation: { required: true },
    },
    {
      name: "country",
      label: "Country",
      type: "text",
      placeholder: "Enter country",
      validation: { required: true },
    },
    {
      name: "emailAddress",
      label: "Email Address",
      type: "email",
      placeholder: "Enter email address",
      validation: { required: true },
    },
    {
      name: "industry",
      label: "Industry",
      type: "text",
      placeholder: "Enter industry",
      validation: { required: true },
    },
    {
      name: "jobTitle",
      label: "Job Title",
      type: "text",
      placeholder: "Enter job title",
      validation: { required: true },
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
      type: "number",
      placeholder: "Enter phone number",
      validation: { required: true, minLength: 7 },
    },
    {
      name: "role",
      label: "Role",
      type: "select",
      options: roleOptions,
      placeholder: "Select role",
      validation: { required: true },
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: statusOptions,
      placeholder: "Select status",
      validation: { required: true },
    },
    {
      name: "provider",
      label: "Provider",
      type: "select",
      options: [
        { value: "email", label: "Email" },
        { value: "google", label: "Google" },
        { value: "facebook", label: "Facebook" },
      ],
      placeholder: "Select provider",
      validation: { required: true },
    },
    {
      name: "socialId",
      label: "Social ID",
      type: "text",
      placeholder: "Social ID (optional)",
    },
  ],
};

export default function CreateUserForm() {
  const router = useRouter();
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState<Record<string, any>>({});

  const handleSubmit = async (data: Record<string, any>) => {
    setMessage("");
    // Convert role/status to object form for API
    const payload = {
      ...data,
      role: { id: Number(data.role) },
      status: { id: Number(data.status) },
      phoneNumber: Number(data.phoneNumber),
    };
    try {
      await createUser(payload).unwrap();
      setMessage("✅ User created successfully!");
      router.push("/dashboard/users");
    } catch (error: any) {
      setMessage(`❌ ${error?.data?.message || "Failed to create user"}`);
    }
  };

  // onChange handler for DynamicForm
  const handleFormChange = (newFormData: Record<string, any>) => {
    setFormState(newFormData);
  };

  return (
    <div className="page-wrapper" style={{ minHeight: 730 }}>
      <div className="content container-fluid">
        <div className="row justify-content-center">
          <div className="col-lg-12 col-md-12">
            <div className="card shadow border-0">
              <div className="card-body">
                <DynamicForm
                  config={userFormConfig}
                  onSubmit={handleSubmit}
                  loading={isLoading}
                  initialData={formState}
                  onChange={handleFormChange}
                />
                {message && (
                  <div
                    className={`alert mt-3 ${
                      message.includes("✅") ? "alert-success" : "alert-danger"
                    }`}
                  >
                    {message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
