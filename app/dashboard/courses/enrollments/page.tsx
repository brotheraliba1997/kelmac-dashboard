"use client";
import React, { useState } from "react";
import DynamicTable from "@/app/components/table/DynamicTableTailwind";
import Link from "next/link";
import {
  useGetAllEnrollmentsQuery,
  useUpdateEnrollmentMutation,
  useDeleteEnrollmentMutation,
} from "@/app/redux/services/enrollmentApi";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

// Define types for better type safety
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Instructor {
  firstName: string;
  lastName: string;
}

interface Course {
  id: string;
  title: string;
  instructor: Instructor;
}

interface Enrollment {
  id: string;
  user: User;
  course: Course;
  progress: number;
  status: "active" | "completed" | "cancelled";
  createdAt: string;
  completionDate?: string;
  payment?: string;
  offer?: string;
}

interface EnrollmentApiResponse {
  data: Enrollment[];
  total?: number;
  totalPages?: number;
  page?: number;
  limit?: number;
}

export default function EnrollmentsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { data, error, refetch } = useGetAllEnrollmentsQuery({
    page,
    limit: pageSize,
    search,
    status: statusFilter,
  });

  const [updateEnrollment] = useUpdateEnrollmentMutation();
  const [deleteEnrollment] = useDeleteEnrollmentMutation();

  const apiResponse = data as EnrollmentApiResponse | undefined;
  const enrollments: Enrollment[] =
    apiResponse?.data || (data as Enrollment[]) || [];
  const totalEntries = apiResponse?.total || enrollments.length;
  const totalPages =
    apiResponse?.totalPages || Math.ceil(totalEntries / pageSize);

  const handleStatusUpdate = async (
    enrollmentId: string,
    newStatus: string
  ) => {
    try {
      await updateEnrollment({
        id: enrollmentId,
        data: { status: newStatus },
      }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to update enrollment status:", error);
    }
  };

  const handleDelete = async (enrollmentId: string) => {
    if (window.confirm("Are you sure you want to delete this enrollment?")) {
      try {
        await deleteEnrollment(enrollmentId).unwrap();
        refetch();
      } catch (error) {
        console.error("Failed to delete enrollment:", error);
      }
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="badge bg-primary">Active</span>;
      case "completed":
        return <span className="badge bg-success">Completed</span>;
      case "cancelled":
        return <span className="badge bg-danger">Cancelled</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const columns: any[] = [
    {
      key: "student",
      label: "Student",
      render: (item: Enrollment) => (
        <div>
          <div className="font-semibold text-gray-900 capitalize">
            {item?.user?.firstName} {item?.user?.lastName}
          </div>
          <div className="text-sm text-gray-600">{item?.user?.email}</div>
        </div>
      ),
    },
    {
      key: "course",
      label: "Course",
      render: (item: Enrollment) => (
        <div>
          <div className="font-medium text-primary-600">
            {item?.course?.title}
          </div>
          <div className="text-sm text-gray-600">
            Instructor: {item?.course?.instructor?.firstName}{" "}
            {item?.course?.instructor?.lastName}
          </div>
        </div>
      ),
    },
    {
      key: "progress",
      label: "Progress",
      render: (item: Enrollment) => (
        <div className="w-32">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-500 transition-all"
              style={{ width: `${item?.progress || 0}%` }}
            />
          </div>
          <small className="text-gray-600 text-xs mt-1">
            {item?.progress || 0}%
          </small>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item: Enrollment) => {
        let bgColor = "bg-gray-500";
        let textColor = "text-white";
        if (item?.status === "active") bgColor = "bg-blue-500";
        else if (item?.status === "completed") bgColor = "bg-green-500";
        else if (item?.status === "cancelled") bgColor = "bg-red-500";

        return (
          <select
            value={item?.status || "active"}
            onChange={(e) => handleStatusUpdate(item?.id, e.target.value)}
            className={`px-3 py-1 rounded text-sm font-medium ${bgColor} ${textColor} cursor-pointer hover:opacity-90 transition-opacity`}
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        );
      },
    },
    {
      key: "enrolledDate",
      label: "Enrolled Date",
      render: (item: Enrollment) => (
        <div className="text-sm text-gray-600">
          {item?.createdAt ? formatDate(item.createdAt) : "—"}
        </div>
      ),
    },
    {
      key: "completionDate",
      label: "Completion Date",
      render: (item: Enrollment) => (
        <div className="text-sm text-gray-600">
          {item?.completionDate ? formatDate(item.completionDate) : "—"}
        </div>
      ),
    },
    {
      key: "payment",
      label: "Payment",
      render: (item: Enrollment) => (
        <div>
          {item?.payment ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Paid
            </span>
          ) : item?.offer ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
              Offer
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Free
            </span>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: Enrollment) => (
        <div className="flex items-center gap-3">
          <button
            title="View Details"
            className="text-primary-600 hover:text-primary-700"
          >
            <FaEye className="text-lg" />
          </button>
          <Link
            href={`/dashboard/courses/enrollments/${item?.id}`}
            title="Edit"
          >
            <FaEdit className="text-green-600 hover:text-green-700 cursor-pointer text-lg" />
          </Link>
          <button
            onClick={() => handleDelete(item?.id)}
            title="Delete"
            className="text-red-600 hover:text-red-700"
          >
            <FaTrash className="text-lg" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-wrapper" style={{ minHeight: 730 }}>
      <div className="content container-fluid">
        <DynamicTable
          data={enrollments as any[]}
          columns={columns}
          loading={false}
          pageTitle="Course Enrollments"
          error={error ? "Failed to load enrollments" : null}
          pagination={{
            total: totalEntries,
            currentPage: page,
            totalPages: totalPages,
            pageSize: pageSize,
            onPageChange: setPage,
            onPageSizeChange: setPageSize,
            pageSizeOptions: [5, 10, 20, 50],
          }}
          onAdd={() => {}}
          addButtonLabel="Add Enrollment"
        />
      </div>
    </div>
  );
}
