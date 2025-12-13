"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePermissions } from "@/app/hooks/usePermissions";
import { useParams, useSearchParams } from "next/navigation";
import { useGetClassScheduleByIdQuery } from "@/app/redux/services/classScheduleApi";
import DynamicTable from "@/app/components/table/DynamicTableTailwind";

function ClassDetailPage() {
  const { isInstructor, isOperator, isCorporate, isAdmin } = usePermissions();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Get query parameters for filtering
  const startDateParam = searchParams.get("startDate");
  const startTimeParam = searchParams.get("startTime");

  // Fetch class schedule details
  const {
    data: classScheduleData,
    isLoading: isLoadingSchedule,
    error: scheduleError,
  } = useGetClassScheduleByIdQuery(id, { skip: !id });

  const classSchedule = (classScheduleData as any)?.data || classScheduleData;

  console.log(classSchedule, "classSchedule=>");

  // Get students directly from class schedule
  // Students format: [{ id, email, firstName, lastName }, ...]
  const students = classSchedule?.students || [];

  // Get sessions from course, not directly from classSchedule
  // Sessions are stored in classSchedule.course.sessions
  const courseSessions = classSchedule?.course?.sessions || [];

  // Helper function to find a session by ID in the course sessions
  const findSessionById = (sessionId: string) => {
    if (!sessionId) return null;
    return courseSessions.find(
      (session: any) => session?.id === sessionId || session?._id === sessionId
    );
  };

  // If we have a sessionId in the classSchedule, use that single session
  // Otherwise, use all course sessions
  const sessions = classSchedule?.sessionId
    ? [findSessionById(classSchedule.sessionId)].filter(Boolean)
    : courseSessions;

  // Helper function to calculate duration in hours from startTime and endTime
  const calculateDuration = (startTime: string, endTime: string): string => {
    if (!startTime || !endTime) return "—";

    try {
      const [startHour, startMin] = startTime.split(":").map(Number);
      const [endHour, endMin] = endTime.split(":").map(Number);

      const startTotalMin = startHour * 60 + startMin;
      const endTotalMin = endHour * 60 + endMin;

      let diffMin = endTotalMin - startTotalMin;

      // Handle case where end time is next day
      if (diffMin < 0) {
        diffMin += 24 * 60;
      }

      const hours = Math.floor(diffMin / 60);
      const minutes = diffMin % 60;

      if (minutes === 0) {
        return `${hours}:00 hr`;
      }
      return `${hours}:${minutes} hr`;
    } catch {
      return "—";
    }
  };

  // Get ClassLeftList from classSchedule
  const classLeftList = classSchedule?.ClassLeftList || [];
  const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

  // Helper function to check if attendance button should be disabled
  const isAttendanceDisabled = (
    blockIdx: number,
    endDate?: string,
    endTime?: string
  ) => {
    const now = new Date();
    const currentDate = new Date(now.toISOString().split("T")[0]); // midnight today

    if (!endDate) return true;
    const end = new Date(endDate);

    // Disable before the end date
    if (currentDate < end) return true;

    // Disable after the end date
    if (currentDate > end) return true;

    // If today is the end date and current time is before endTime, disable
    if (currentDate.getTime() === end.getTime() && endTime) {
      const [h, m] = endTime.split(":").map(Number);
      const endDateTime = new Date(end);
      endDateTime.setHours(h || 0, m || 0, 0, 0);
      if (now < endDateTime) return true;
    }

    // Otherwise enabled
    return false;
  };

  // Helper function to get disable reason
  const getDisableReason = (
    blockIdx: number,
    endDate?: string,
    endTime?: string
  ) => {
    const now = new Date();
    const currentDate = new Date(now.toISOString().split("T")[0]);
    const end = endDate ? new Date(endDate) : undefined;

    if (!end) return "Attendance unavailable (invalid dates)";

    if (currentDate < end) return "Not started yet";
    if (currentDate > end) return "Session finished";

    if (currentDate.getTime() === end.getTime() && endTime) {
      const [h, m] = endTime.split(":").map(Number);
      const endDateTime = new Date(end);
      endDateTime.setHours(h || 0, m || 0, 0, 0);
      if (now < endDateTime) return "Available after end time";
    }

    return "";
  };

  // Prepare data for table
  const allTimeBlocks: any[] = [];
  sessions.forEach((session: any, sessionIdx: number) => {
    const timeBlocks = session?.timeBlocks || [];
    timeBlocks.forEach((timeBlock: any, blockIdx: number) => {
      const calculatedDuration = calculateDuration(
        timeBlock?.startTime,
        timeBlock?.endTime
      );

      allTimeBlocks.push({
        id: `${sessionIdx}-${blockIdx}`,
        startDate: timeBlock?.startDate,
        endDate: timeBlock?.endDate,
        startTime: timeBlock?.startTime,
        endTime: timeBlock?.endTime,
        duration: calculatedDuration,
        googleMeetLink:
          classSchedule?.googleMeetLink || session?.googleMeetLink,
        sessionId: session?.id || session?._id,
        blockIdx: blockIdx,
        isAttendanceDisabled: isAttendanceDisabled(
          blockIdx,
          timeBlock?.endDate,
          timeBlock?.endTime
        ),
        disableReason: getDisableReason(
          blockIdx,
          timeBlock?.endDate,
          timeBlock?.endTime
        ),
      });
    });
  });

  // Filter timeblocks based on query parameters
  const filteredTimeBlocks = allTimeBlocks.filter((timeBlock) => {
    if (startDateParam && timeBlock.startDate !== startDateParam) {
      return false;
    }
    if (startTimeParam && timeBlock.startTime !== startTimeParam) {
      return false;
    }
    return true;
  });

  // Use filtered data for display
  const dataToDisplay =
    filteredTimeBlocks.length > 0 ? filteredTimeBlocks : allTimeBlocks;
  const totalEntries = dataToDisplay.length;
  const totalPages = Math.ceil(totalEntries / pageSize);
  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentData = dataToDisplay.slice(indexOfFirstItem, indexOfLastItem);

  const columns = [
    {
      key: "startDate",
      label: "Start Date",
      render: (item: any) => (
        <span className="text-gray-700 font-medium">
          {item.startDate || "—"}
        </span>
      ),
    },
    {
      key: "endDate",
      label: "End Date",
      render: (item: any) => (
        <span className="text-gray-700 font-medium">{item.endDate || "—"}</span>
      ),
    },
    {
      key: "startTime",
      label: "Start Time",
      render: (item: any) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
          {item.startTime || "—"}
        </span>
      ),
    },
    {
      key: "endTime",
      label: "End Time",
      render: (item: any) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
          {item.endTime || "—"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item: any) => {
        const isClassDone =
          item.blockIdx !== undefined && classLeftList[item.blockIdx] === true;
        if (isClassDone) {
          return <span className="text-green-700 font-medium">Completed</span>;
        }
        if (item.isAttendanceDisabled) {
          return (
            <span className="text-gray-600" title={item.disableReason}>
              {item.disableReason || "Unavailable"}
            </span>
          );
        }
        return <span className="text-primary-700 font-medium">Available</span>;
      },
    },
    {
      key: "duration",
      label: "Duration",
      render: (item: any) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500 text-white">
          {item.duration || "—"}
        </span>
      ),
    },
    {
      key: "meetLink",
      label: "Meet Link",
      render: (item: any) => (
        <a
          href={item.googleMeetLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 hover:text-primary-700 font-medium underline"
        >
          {item.googleMeetLink ? "Join Meeting" : "—"}
        </a>
      ),
    },
    {
      key: "attendance",
      label: "Attendance",
      render: (item: any) => {
        const disabled = item.isAttendanceDisabled;
        if (!disabled) {
          const attendanceUrl = `/dashboard/attendance/${id}?startDate=${item.startDate}&startTime=${item.startTime}`;
          return (
            <Link
              href={attendanceUrl}
              className="bg-primary-600 px-4 py-2 rounded hover:bg-primary-700 text-white font-medium"
            >
              Attendance
            </Link>
          );
        } else {
          // If disabled and not class done, show disabled button with tooltip
          const reason = item.disableReason || "Attendance not available";
          return (
            <button
              type="button"
              title={reason}
              aria-label={reason}
              disabled
              className="bg-gray-300 text-gray-600 px-4 py-2 rounded cursor-not-allowed"
            >
              Attendance
            </button>
          );
        }
      },
    },
  ];

  return (
    <div className="page-wrapper" style={{ minHeight: 730 }}>
      <div className="content container-fluid">
        {/* Display filter info if query params are present */}
        {(startDateParam || startTimeParam) && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-semibold text-blue-900">
              Filtered by:{" "}
              {startDateParam && (
                <span className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-800 ml-2">
                  Date: {startDateParam}
                </span>
              )}
              {startTimeParam && (
                <span className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-800 ml-2">
                  Time: {startTimeParam}
                </span>
              )}
            </p>
            {filteredTimeBlocks.length === 0 && (
              <p className="text-sm text-red-600 mt-2">
                No timeblocks found matching the criteria.
              </p>
            )}
          </div>
        )}
        <DynamicTable
          data={currentData}
          columns={columns}
          loading={isLoadingSchedule}
          pageTitle="Session Class Schedule"
          error={scheduleError ? "Failed to load sessions" : null}
          pagination={{
            total: totalEntries,
            currentPage: page,
            totalPages: totalPages,
            pageSize: pageSize,
            onPageChange: setPage,
            onPageSizeChange: setPageSize,
            pageSizeOptions: [5, 10, 20, 50],
          }}
        />
      </div>
    </div>
  );
}

export default ClassDetailPage;
