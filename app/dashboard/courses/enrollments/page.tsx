"use client";
import MainDashboard from "@/app/components/dashboard--component/MainDashboard-component";
import React, { use, useEffect, useState } from "react";
import Table from "@/app/components/table/index";
import Link from "next/link";
import {
  GetUserRoleName,
  GetUserStatusName,
} from "@/app/utils/getUserRoleName";
import {
  useGetAllEnrollmentsQuery,
  useUpdateEnrollmentMutation,
  useDeleteEnrollmentMutation,
} from "@/app/redux/services/enrollmentApi";
import { FaEye, FaEdit, FaTrash, FaFilter, FaSearch } from "react-icons/fa";

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
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data, error, refetch } = useGetAllEnrollmentsQuery({
    page,
    limit: pageSize,
    search,
    status: statusFilter,
    sortBy,
    sortOrder,
  });

  const [updateEnrollment] = useUpdateEnrollmentMutation();
  const [deleteEnrollment] = useDeleteEnrollmentMutation();

  console.log("data from enrollments page==>", data);

  // Handle both paginated and non-paginated response structures
  const apiResponse = data as EnrollmentApiResponse | undefined;
  const enrollments: Enrollment[] =
    apiResponse?.data || (data as Enrollment[]) || [];
  const totalEntries = apiResponse?.total || enrollments.length;
  const totalPages =
    apiResponse?.totalPages || Math.ceil(totalEntries / pageSize);

  // For client-side pagination if API doesn't provide pagination
  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentData = apiResponse?.total
    ? enrollments
    : enrollments.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, [page, pageSize, search, statusFilter, sortBy, sortOrder]);

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

  const columns = [
    {
      displayName: "Student",
      displayField: (e: Enrollment) => (
        <div className="d-flex align-items-center">
          <div>
            <div className="fw-semibold text-capitalize">
              {e?.user?.firstName} {e?.user?.lastName}
            </div>
            <div className="text-muted small">{e?.user?.email}</div>
          </div>
        </div>
      ),
      searchable: true,
    },

    {
      displayName: "Course",
      displayField: (e: Enrollment) => (
        <div>
          <div className="fw-medium text-primary">{e?.course?.title}</div>
          <div className="text-muted small">
            Instructor: {e?.course?.instructor?.firstName}{" "}
            {e?.course?.instructor?.lastName}
          </div>
        </div>
      ),
      searchable: true,
    },

    {
      displayName: "Progress",
      displayField: (e: Enrollment) => (
        <div>
          <div className="progress" style={{ height: "8px", width: "80px" }}>
            <div
              className="progress-bar bg-info"
              role="progressbar"
              style={{ width: `${e?.progress || 0}%` }}
            />
          </div>
          <small className="text-muted">{e?.progress || 0}%</small>
        </div>
      ),
      searchable: false,
    },

    {
      displayName: "Status",
      displayField: (e: Enrollment) => (
        <select
          className="form-select form-select-sm"
          value={e?.status || "active"}
          onChange={(event) => handleStatusUpdate(e?.id, event.target.value)}
          style={{ width: "120px" }}
        >
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      ),
      searchable: true,
    },

    {
      displayName: "Enrolled Date",
      displayField: (e: Enrollment) => (
        <div className="text-muted small">
          {e?.createdAt ? formatDate(e.createdAt) : "—"}
        </div>
      ),
      searchable: false,
    },

    {
      displayName: "Completion Date",
      displayField: (e: Enrollment) => (
        <div className="text-muted small">
          {e?.completionDate ? formatDate(e.completionDate) : "—"}
        </div>
      ),
      searchable: false,
    },

    {
      displayName: "Payment",
      displayField: (e: Enrollment) => (
        <div>
          {e?.payment ? (
            <span className="badge bg-success">Paid</span>
          ) : e?.offer ? (
            <span className="badge bg-warning">Offer</span>
          ) : (
            <span className="badge bg-secondary">Free</span>
          )}
        </div>
      ),
      searchable: false,
    },

    {
      displayName: "Actions",
      displayField: (e: Enrollment) => (
        <div className="d-flex gap-2">
          <FaEye
            className="text-primary"
            style={{ cursor: "pointer", fontSize: "14px" }}
            title="View Details"
          />
          <Link href={`/dashboard/courses/enrollments/${e?.id}`}>
            <FaEdit
              className="text-success"
              style={{ cursor: "pointer", fontSize: "14px" }}
              title="Edit Enrollment"
            />
          </Link>
          <FaTrash
            className="text-danger"
            style={{ cursor: "pointer", fontSize: "14px" }}
            onClick={() => handleDelete(e?.id)}
            title="Delete Enrollment"
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-wrapper" style={{ minHeight: 730 }}>
        <div className="content container-fluid">
          <div className="row justify-content-center">
            <div className="col-xl-12 col-12">
              <div className="card-header py-3 bg-gradient">
                <div className="row">
                  <div className="col">
                    <h4 className="card-title">Course Enrollments</h4>
                    <p className="text-muted mb-0">
                      Manage student course enrollments
                    </p>
                  </div>
                  <div className="col-auto">
                    <Link
                      href="/dashboard/courses/enrollments/create"
                      className="btn btn-dark btn-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-plus me-2"
                      >
                        <line x1={12} y1={5} x2={12} y2={19} />
                        <line x1={5} y1={12} x2={19} y2={12} />
                      </svg>
                      Add Enrollment
                    </Link>
                  </div>
                </div>
              </div>

              {/* Filters Section */}
              <div className="card-body border-bottom">
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="input-group input-group-sm">
                      <span className="input-group-text">
                        <FaSearch />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search students or courses..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-select form-select-sm"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-select form-select-sm"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="createdAt">Sort by Enrollment Date</option>
                      <option value="progress">Sort by Progress</option>
                      <option value="completionDate">Sort by Completion</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <select
                      className="form-select form-select-sm"
                      value={sortOrder}
                      onChange={(e) =>
                        setSortOrder(e.target.value as "asc" | "desc")
                      }
                    >
                      <option value="desc">Descending</option>
                      <option value="asc">Ascending</option>
                    </select>
                  </div>
                </div>
              </div>

              <Table
                title="Enrollments List"
                columns={columns}
                dataSource={currentData}
                isLoading={isLoading}
                totalPages={totalPages}
                totalEntries={totalEntries}
                page={page}
                setPage={setPage}
                pageSize={pageSize}
                setPageSize={setPageSize}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
