"use client";
import React, { useState } from "react";
import DynamicTable, {
  FilterConfig,
} from "@/app/components/table/DynamicTableTailwind";
import Link from "next/link";

import {
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaClipboardCheck,
} from "react-icons/fa";
import { useGetPaginatedClassSchedulesQuery } from "@/app/redux/services/classScheduleApi";
import { SiGoogleclassroom } from "react-icons/si";
import { useRouter } from "next/navigation";

function ClassSchedule() {
  const [tableFilters, setTableFilters] = useState({
    search: undefined,
    startDate: undefined,
    endDate: undefined,
    status: undefined,
    studentId: undefined,
    courseId: undefined,
    instructorId: undefined,
    limit: 10,
    page: 1,
  });

  const { data, isLoading, error } =
    useGetPaginatedClassSchedulesQuery(tableFilters);

  const schedules = (data as any)?.data || (data as any)?.items || data || [];
  const totalEntries = (data as any)?.meta?.total || schedules.length || 0;
  const totalPages = Math.ceil(totalEntries / (tableFilters.limit || 10)) || 1;

  const currentData = schedules; // server paginated

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
        <div className="text-primary-600 font-medium capitalize">
          {item?.course?.sessions.find((x: any) => x.id == item?.sessionId)
            ?.instructor?.firstName
            ? `${
                item?.course?.sessions.find((x: any) => x.id == item?.sessionId)
                  ?.instructor?.firstName
              } ${
                item?.course?.sessions.find((x: any) => x.id == item?.sessionId)
                  ?.instructor?.lastName
              }`
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
          {(() => {
            const classLeftList = Array.isArray(item?.ClassLeftList)
              ? item.ClassLeftList
              : [];
            const allDone =
              classLeftList.length > 0 && classLeftList.every(Boolean);
            if (!allDone)
              return (
                <Link
                  href={`/dashboard/classes/${item?.id}`}
                  title="Attendance"
                  className="inline-flex bg-primary-600 hover:bg-primary-700 items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded text-white"
                >
                  <SiGoogleclassroom className="text-base" />
                  <span>Attendance</span>
                </Link>
              );
            return (
              <Link
                href={`/dashboard/assessment/${item?.id}`}
                title="Assessment"
                className="inline-flex bg-primary-600 hover:bg-primary-700  items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded bg-primary-600 text-white hover:bg-primary-700 shadow-sm"
              >
                <FaClipboardCheck className="text-base" />
                Assessment
              </Link>
            );
          })()}

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

  // Filters configuration similar to courses page
  const scheduleFilters: FilterConfig[] = [
    {
      key: "search",
      label: "Search",
      type: "text",
      placeholder: "Search schedules...",
    },
    { key: "startDate", label: "Start Date", type: "date" },
    { key: "endDate", label: "End Date", type: "date" },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "", label: "All" },
        { value: "scheduled", label: "Scheduled" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
      ],
    },
    {
      key: "studentId",
      label: "Student ID",
      type: "text",
      placeholder: "Student ID",
    },
    {
      key: "courseId",
      label: "Course ID",
      type: "text",
      placeholder: "Course ID",
    },
    {
      key: "instructorId",
      label: "Instructor ID",
      type: "text",
      placeholder: "Instructor ID",
    },
  ];

  const handleFilterChange = (filters: Record<string, unknown>) => {
    const typed = filters as Partial<typeof tableFilters>;
    const keys = Object.keys(filters);
    const shouldResetPage = keys.some((k) => k !== "page" && k !== "limit");
    setTableFilters((prev) => ({
      ...prev,
      ...typed,
      page: shouldResetPage ? 1 : typed.page ?? prev.page,
      limit: typed.limit ?? prev.limit,
    }));
  };
  const router = useRouter();
  return (
    <div className="page-wrapper" style={{ minHeight: 730 }}>
      <div className="content container-fluid">
        <DynamicTable
          data={currentData}
          columns={columns}
          loading={isLoading}
          pageTitle="Class Schedule"
          error={error ? "Failed to load schedules" : null}
          filters={scheduleFilters}
          onFilterChange={handleFilterChange}
          pagination={{
            total: totalEntries,
            currentPage: tableFilters.page,
            totalPages: totalPages,
            pageSize: tableFilters.limit,
            onPageChange: (p: number) =>
              setTableFilters((prev) => ({ ...prev, page: p })),
            onPageSizeChange: (size: number) => {
              setTableFilters((prev) => ({ ...prev, limit: size, page: 1 }));
            },
            pageSizeOptions: [5, 10, 20, 50],
          }}
          onAdd={() => {
            router.push("/dashboard/class-schedule/create");
          }}
          addButtonLabel="Add Schedule"
        />
      </div>
    </div>
  );
}

export default ClassSchedule;
