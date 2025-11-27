"use client";
import React, { use, useEffect, useState } from "react";
import Table from "@/app/components/table/index";
import Link from "next/link";

import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useGetAllClassSchedulesQuery } from "@/app/redux/services/classScheduleApi";
import { SiGoogleclassroom } from "react-icons/si";

function ClassSchedule() {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useGetAllClassSchedulesQuery({});

  console.log("Class Schedule Data:", data);

  const [pageSize, setPageSize] = useState(5);

  const courses = (data as any)?.data || data || [];
  const totalEntries = courses.length;
  const totalPages = Math.ceil(totalEntries / pageSize);

  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentData = courses.slice(indexOfFirstItem, indexOfLastItem);

  const columns = [
    {
      displayName: "Course",
      displayField: (e: any) => (
        <div className="fw-semibold text-capitalize">
          {e?.course?.title || "—"}
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
            : "—"}
        </div>
      ),
      searchable: true,
    },

    {
      displayName: "Date",
      displayField: (e: any) => (
        <span className="badge bg-light text-dark">{e?.date || "—"}</span>
      ),
      searchable: true,
    },

    {
      displayName: "Time",
      displayField: (e: any) => (
        <span className="badge bg-info text-dark">{e?.time || "—"}</span>
      ),
      searchable: true,
    },

    {
      displayName: "Duration",
      displayField: (e: any) => (
        <span className="badge bg-secondary">{e?.duration || 0} min</span>
      ),
      searchable: false,
    },

    {
      displayName: "Meet Link",
      displayField: (e: any) => (
        <a
          href={e?.googleMeetLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-decoration-none text-primary fw-medium"
        >
          {e?.googleMeetLink ? "Join Meeting" : "—"}
        </a>
      ),
      searchable: false,
    },

    {
      displayName: "Status",
      displayField: (e: any) =>
        e?.status === "scheduled" ? (
          <span className="badge bg-success">Scheduled</span>
        ) : e?.status === "cancelled" ? (
          <span className="badge bg-danger">Cancelled</span>
        ) : (
          <span className="badge bg-warning text-dark">{e?.status || "—"}</span>
        ),
      searchable: true,
    },

    {
      displayName: "Actions",
      displayField: (e: any) => (
        <div className="d-flex gap-3">
          <Link href={`/dashboard/attendance/${e?.id}`}>
            <SiGoogleclassroom
              className="text-primary"
              style={{ cursor: "pointer" }}
              //   onClick={() => handleView?.(e)}
              title="Attendance"
            />
          </Link>

          <FaEye
            className="text-primary"
            style={{ cursor: "pointer" }}
            //   onClick={() => handleView?.(e)}
            title="View"
          />

          <Link href={`/dashboard/class-schedule/${e?.id}`}>
            <FaEdit
              className="text-success"
              style={{ cursor: "pointer" }}
              title="Edit"
            />
          </Link>

          <FaTrash
            className="text-danger"
            style={{ cursor: "pointer" }}
            //   onClick={() => handleDelete?.(e)}
            title="Delete"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="page-wrapper" style={{ minHeight: 730 }}>
      <div className="content container-fluid">
        <div className="row justify-content-center">
          <div className="col-xl-12  col-12">
            <div className="card-header py-3 bg-gradient">
              <div className="row">
                <div className="col">
                  <h4 className="card-title">Class Schedule</h4>
                </div>
                <div className="col-auto">
                  <Link
                    href="/dashboard/class-schedule/create"
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
                    Add Schedule
                  </Link>
                </div>
              </div>
            </div>

            <Table
              title="Class Schedule"
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
  );
}

export default ClassSchedule;
