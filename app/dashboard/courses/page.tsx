"use client";
import MainDashboard from "@/app/components/dashboard--component/MainDashboard-component";
import React, { use, useEffect, useState } from "react";
import Table from "@/app/components/table/index";
import Link from "next/link";
import {
  GetUserRoleName,
  GetUserStatusName,
} from "@/app/utils/getUserRoleName";
import { useGetAllCoursesQuery } from "@/app/redux/services/courseApi";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

export default function CoursesPage() {
  const { data, error } = useGetAllCoursesQuery({});
  console.log("data from courses page==>", data);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  // Handle different API response structures
  const courses = (data as any)?.data || data || [];
  const totalEntries = courses.length;
  const totalPages = Math.ceil(totalEntries / pageSize);

  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentData = courses.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, [page, pageSize]);

  const columns = [
    {
      displayName: "Title",
      displayField: (e: any) => (
        <div className="fw-semibold text-capitalize">{e?.title}</div>
      ),
      searchable: true,
    },

    {
      displayName: "Description",
      displayField: (e: any) => (
        <div className="text-muted text-truncate" style={{ maxWidth: "250px" }}>
          {e?.description || "—"}
        </div>
      ),
      searchable: true,
    },

    {
      displayName: "Instructor",
      displayField: (e: any) => (
        <div className="fw-medium text-primary">
          {e?.instructor?.firstName
            ? `${e.instructor.firstName} ${e.instructor.lastName}`
            : e?.instructor || "—"}
        </div>
      ),
      searchable: true,
    },

    {
      displayName: "Price",
      displayField: (e: any) => (
        <span className="badge bg-info">
          ${Number(e?.price || 0).toFixed(2)}
        </span>
      ),
      searchable: true,
    },

    {
      displayName: "Sessions",
      displayField: (e: any) => (
        <span className="badge bg-secondary">
          {e?.sessions?.length || 0} Sessions
        </span>
      ),
      searchable: false,
    },

    // {
    //   displayName: "Status",
    //   displayField: (e: any) =>
    //     e?.isPublished ? (
    //       <span className="badge bg-success">Published</span>
    //     ) : (
    //       <span className="badge bg-warning text-dark">Draft</span>
    //     ),
    //   searchable: true,
    // },

    {
      displayName: "Actions",
      displayField: (e: any) => (
        <div className="d-flex gap-3">
          <FaEye
            className="text-primary"
            style={{ cursor: "pointer" }}
            // onClick={() => handleView(e)}
            title="View"
          />

          <Link href={`/dashboard/courses/${e?.id}`}>
            <FaEdit
              className="text-success"
              style={{ cursor: "pointer" }}
              // onClick={() => handleEdit(e)}
              title="Edit"
            />
          </Link>
          <FaTrash
            className="text-danger"
            style={{ cursor: "pointer" }}
            // onClick={() => handleDelete(e)}
            title="Delete"
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
            <div className="col-xl-12  col-12">
              <div className="card-header py-3 bg-gradient">
                <div className="row">
                  <div className="col">
                    <h4 className="card-title">Courses List</h4>
                  </div>
                  <div className="col-auto">
                    <Link
                      href="/dashboard/courses/create"
                      className=" btn btn-dark btn-sm"
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
                      Add Courses
                    </Link>
                  </div>
                </div>
              </div>

              <Table
                title="Courses List "
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
