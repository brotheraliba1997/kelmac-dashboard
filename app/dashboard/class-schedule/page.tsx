"use client";
import React, { useState } from "react";
import DynamicTable from "@/app/components/table/DynamicTableTailwind";
import Link from "next/link";

import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useGetAllClassSchedulesQuery } from "@/app/redux/services/classScheduleApi";
import { SiGoogleclassroom } from "react-icons/si";

function ClassSchedule() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, error } = useGetAllClassSchedulesQuery();

  const schedules = (data as any)?.data || data || [];
  const totalEntries = schedules.length;
  const totalPages = Math.ceil(totalEntries / pageSize);

  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentData = schedules.slice(indexOfFirstItem, indexOfLastItem);

  const columns = [
    {
      key: "course",
      label: "Course",
      render: (item: any) => (
        <div className="font-semibold text-gray-900 capitalize">
          {item?.course?.title || "—"}
        </div>
      ),
    },
    {
      key: "instructor",
      label: "Instructor",
      render: (item: any) => (
        <div className="text-primary-600 font-medium">
          {item?.instructor?.firstName
            ? `${item.instructor.firstName} ${item.instructor.lastName}`
            : "—"}
        </div>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (item: any) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {item?.date || "—"}
        </span>
      ),
    },
    {
      key: "time",
      label: "Time",
      render: (item: any) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
          {item?.time || "—"}
        </span>
      ),
    },
    {
      key: "duration",
      label: "Duration",
      render: (item: any) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500 text-white">
          {item?.duration || 0} min
        </span>
      ),
    },
    {
      key: "googleMeetLink",
      label: "Meet Link",
      render: (item: any) => (
        <a
          href={item?.googleMeetLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 hover:text-primary-700 font-medium underline"
        >
          {item?.googleMeetLink ? "Join Meeting" : "—"}
        </a>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item: any) => {
        let bgColor = "bg-gray-500";
        if (item?.status === "scheduled") bgColor = "bg-green-500";
        else if (item?.status === "cancelled") bgColor = "bg-red-500";
        else if (item?.status === "completed") bgColor = "bg-blue-500";

        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} text-white`}
          >
            {item?.status?.charAt(0).toUpperCase() + item?.status?.slice(1) ||
              "—"}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: any) => (
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/attendance/${item?.id}`} title="Attendance">
            <SiGoogleclassroom className="text-primary-600 hover:text-primary-700 cursor-pointer text-lg" />
          </Link>
          <button
            title="View"
            className="text-primary-600 hover:text-primary-700"
          >
            <FaEye className="text-lg" />
          </button>
          <Link href={`/dashboard/class-schedule/${item?.id}`} title="Edit">
            <FaEdit className="text-green-600 hover:text-green-700 cursor-pointer text-lg" />
          </Link>
          <button title="Delete" className="text-red-600 hover:text-red-700">
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
          data={currentData}
          columns={columns}
          loading={isLoading}
          pageTitle="Class Schedule"
          error={error ? "Failed to load schedules" : null}
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
          addButtonLabel="Add Schedule"
        />
      </div>
    </div>
  );
}

export default ClassSchedule;
