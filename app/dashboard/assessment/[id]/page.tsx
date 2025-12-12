"use client";
import React, { useState, Suspense } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/redux/store";
import DynamicTable from "@/app/components/table/DynamicTableTailwind";
import ImageUploader from "@/app/components/shared/ImageUploader";
import {
  useGetPassFailCheckAssignmentQuery,
  useApproveCertificateMutation,
} from "@/app/redux/services/attendanceApi";
import { useGetClassScheduleByIdQuery } from "@/app/redux/services/classScheduleApi";
import { usePermissions } from "@/app/hooks/usePermissions";

function AssessmentPageContent() {
  const { isOperator, isAdmin } = usePermissions();
  const searchParams = useSearchParams();
  const params = useParams();
  const id = params?.id as string;

  // Optional query params to identify a specific timeblock
  const startDateParam = searchParams.get("startDate");
  const startTimeParam = searchParams.get("startTime");

  // Fetch class schedule by route id (classScheduleId)
  const {
    data: classScheduleData,
    isLoading: isLoadingSchedule,
    error: scheduleError,
  } = useGetClassScheduleByIdQuery(id, { skip: !id });
  const classSchedule = (classScheduleData as any)?.data || classScheduleData;
  const courseSessions = classSchedule?.course?.sessions || [];

  // Derive courseId
  const derivedCourseId: string =
    classSchedule?.course?.id || classSchedule?.course?._id || "";

  // Derive sessionId: prefer classSchedule.sessionId; else find via startDate/startTime; else fallback when single session
  let derivedSessionId: string = classSchedule?.sessionId || "";
  if (
    !derivedSessionId &&
    startDateParam &&
    startTimeParam &&
    courseSessions?.length > 0
  ) {
    for (const session of courseSessions) {
      const timeBlocks = session?.timeBlocks || [];
      const match = timeBlocks.find(
        (tb: any) =>
          tb?.startDate === startDateParam && tb?.startTime === startTimeParam
      );
      if (match) {
        derivedSessionId = session?.id || session?._id || "";
        break;
      }
    }
  }
  if (!derivedSessionId && courseSessions?.length === 1) {
    const only = courseSessions[0];
    derivedSessionId = only?.id || only?._id || "";
  }

  const canQuery = Boolean(id && derivedCourseId && derivedSessionId);

  const { data, isLoading, error, refetch } =
    useGetPassFailCheckAssignmentQuery(
      {
        classScheduleId: id,
        courseId: derivedCourseId,
        sessionId: derivedSessionId,
      },
      { skip: !canQuery }
    );

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // State for approval modal
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [approvalAction, setApprovalAction] = useState<
    "approve" | "reject" | null
  >(null);
  const [certificateUrl, setCertificateUrl] = useState("");
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [certificatePreview, setCertificatePreview] = useState<string | null>(
    null
  );
  const [notesInput, setNotesInput] = useState("");

  // Get operator ID from Redux auth
  const operatorId =
    (useSelector((state: RootState) => state?.auth?.user?.id) as string) || "";

  // Mutation for approving/rejecting certificates
  const [approveCertificate, { isLoading: isApprovingCertificate }] =
    useApproveCertificateMutation();

  const results = data?.results || [];

  const filters = [
    {
      key: "result",
      label: "Result",
      type: "select" as const,
      options: [
        { value: "PASS", label: "PASS" },
        { value: "FAIL", label: "FAIL" },
      ],
    },
    {
      key: "certificateIssued",
      label: "Certificate",
      type: "select" as const,
      options: [
        { value: "true", label: "Issued" },
        { value: "false", label: "Not Issued" },
      ],
    },
  ];

  const columns = [
    {
      key: "studentName",
      label: "Student",
      render: (item: any) => (
        <div className="flex flex-col">
          <span className="text-gray-900 font-medium">
            {item.studentName || "—"}
          </span>
        </div>
      ),
    },
    { key: "totalClasses", label: "Classes" },
    { key: "presentCount", label: "Present" },
    { key: "absentCount", label: "Absent" },
    {
      key: "result",
      label: "Result",
      render: (item: any) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.result === "PASS"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.result || "—"}
        </span>
      ),
    },
    {
      key: "certificateIssued",
      label: "Certificate",
      render: (item: any) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.certificateIssued
              ? "bg-indigo-100 text-indigo-800"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {item.certificateIssued ? "Issued" : "Not Issued"}
        </span>
      ),
    },
    {
      key: "certificateId",
      label: "Certificate ID",
      render: (item: any) => (
        <span className="text-gray-700 font-mono text-sm">
          {item.certificateId || "—"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: any) =>
        isOperator || isAdmin ? (
          <button
            type="button"
            onClick={() => {
              setSelectedRecord(item);
              setIsApprovalModalOpen(true);
            }}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Approve/Reject
          </button>
        ) : null,
    },
  ];

  const totalEntries = results.length;
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;
  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentData = results.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="page-wrapper" style={{ minHeight: 730 }}>
      <div className="content container-fluid">
        <div className="page-header mb-4">
          <h3 className="text-2xl font-bold text-gray-900">
            Pass/Fail Assessment
          </h3>
          <p className="text-sm text-gray-500">
            Check pass/fail status for a session and issuance of certificates.
          </p>
        </div>

        {canQuery && (
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">
                {data?.totalStudents ?? "—"}
              </p>
            </div>
            <div className="bg-white border border-green-200 rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-500">Passed</p>
              <p className="text-2xl font-bold text-green-700">
                {data?.passedStudents ?? "—"}
              </p>
            </div>
            <div className="bg-white border border-red-200 rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-500">Failed</p>
              <p className="text-2xl font-bold text-red-700">
                {data?.failedStudents ?? "—"}
              </p>
            </div>
          </div>
        )}

        {/* Table */}
        <DynamicTable
          data={currentData}
          columns={columns as any}
          loading={(isLoading || isLoadingSchedule) && canQuery}
          pageTitle="Assessment Results"
          error={
            error || scheduleError ? "Failed to load assessment results" : null
          }
          searchable
          searchPlaceholder="Search by student, ID, certificate..."
          searchKeys={["studentName", "studentId", "certificateId"]}
          filters={filters as any}
          pagination={{
            total: results.length,
            currentPage: page,
            totalPages,
            pageSize,
            onPageChange: setPage,
            onPageSizeChange: setPageSize,
            pageSizeOptions: [5, 10, 20, 50],
          }}
          emptyMessage={
            canQuery ? "No results found" : "Enter IDs above and fetch results"
          }
        />

        {/* Approval Modal */}
        {isApprovalModalOpen && selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Approve/Reject Certificate
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setIsApprovalModalOpen(false);
                    setSelectedRecord(null);
                    setApprovalAction(null);
                    setCertificateUrl("");
                    setCertificatePreview(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Record Details */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Student</p>
                <p className="font-semibold text-gray-900">
                  {selectedRecord.studentName}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedRecord.studentId}
                </p>
                <div className="flex gap-4 mt-4">
                  <div>
                    <p className="text-xs text-gray-500">Result</p>
                    <p
                      className={`font-semibold ${
                        selectedRecord.result === "PASS"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {selectedRecord.result}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Attendance</p>
                    <p className="font-semibold text-gray-900">
                      {selectedRecord.presentCount}/
                      {selectedRecord.totalClasses}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Selection */}
              <div className="mb-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setApprovalAction("approve")}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    approvalAction === "approve"
                      ? "bg-green-600 text-white"
                      : "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                  }`}
                >
                  ✓ Approve
                </button>
                <button
                  type="button"
                  onClick={() => setApprovalAction("reject")}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    approvalAction === "reject"
                      ? "bg-red-600 text-white"
                      : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                  }`}
                >
                  ✕ Reject
                </button>
              </div>

              {/* Form Fields */}
              {approvalAction && (
                <div className="space-y-4 mb-6">
                  {approvalAction === "approve" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Certificate Upload
                        </label>
                        <ImageUploader
                          accept=".pdf,image/*"
                          label="Upload Certificate"
                          helperText="PDF, PNG, JPG, JPEG up to 5MB"
                          preview={certificatePreview}
                          onFileSelect={(file: File) => {
                            setCertificateFile(file);
                            setCertificatePreview(
                              file.type.startsWith("image/")
                                ? URL.createObjectURL(file)
                                : null
                            );
                          }}
                          onFileRemove={() => {
                            setCertificateFile(null);
                            setCertificateUrl("");
                            setCertificatePreview(null);
                          }}
                          autoUpload
                          uploadUrl={`${process.env.NEXT_PUBLIC_API_BASE_URL}/files/upload`}
                          onUploadSuccess={(url: string) => {
                            setCertificateUrl(url);
                            setCertificatePreview((prev) => prev || url);
                          }}
                          onUploadError={() => {
                            setCertificateUrl("");
                            setCertificatePreview(null);
                          }}
                        />
                        {certificateFile && (
                          <p className="text-xs text-gray-600 mt-1">
                            Selected: {certificateFile.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Certificate URL (required for approval)
                        </label>
                        <input
                          type="url"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="URL from upload or paste manually"
                          value={certificateUrl}
                          onChange={(e) => setCertificateUrl(e.target.value)}
                          required
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                      placeholder="Add any notes about this decision..."
                      value={notesInput}
                      onChange={(e) => setNotesInput(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsApprovalModalOpen(false);
                    setSelectedRecord(null);
                    setApprovalAction(null);
                    setCertificateUrl("");
                    setCertificateFile(null);
                    setCertificatePreview(null);
                    setNotesInput("");
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (!approvalAction || !operatorId) return;
                    if (approvalAction === "approve" && !certificateUrl) {
                      alert("Certificate URL is required to approve.");
                      return;
                    }
                    try {
                      await approveCertificate({
                        recordId: selectedRecord.id,
                        approve: approvalAction === "approve",
                        notes: notesInput || undefined,
                        certificateUrl:
                          approvalAction === "approve"
                            ? certificateUrl
                            : undefined,
                        operatorId: operatorId,
                      }).unwrap();
                      // Close modal and reset
                      setIsApprovalModalOpen(false);
                      setSelectedRecord(null);
                      setApprovalAction(null);
                      setCertificateUrl("");
                      setCertificateFile(null);
                      setNotesInput("");
                      // Refetch results
                      refetch();
                    } catch (err) {
                      console.error("Approval failed:", err);
                      alert("Failed to approve/reject certificate");
                    }
                  }}
                  disabled={
                    !approvalAction ||
                    isApprovingCertificate ||
                    (approvalAction === "approve" && !certificateUrl)
                  }
                  className={`px-4 py-2 text-white rounded-lg font-medium transition-colors ${
                    approvalAction === "approve"
                      ? "bg-green-600 hover:bg-green-700 disabled:bg-green-400"
                      : "bg-red-600 hover:bg-red-700 disabled:bg-red-400"
                  } disabled:cursor-not-allowed`}
                >
                  {isApprovingCertificate
                    ? "Submitting..."
                    : approvalAction === "approve"
                    ? "Approve Certificate"
                    : "Reject Certificate"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AssessmentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
        </div>
      }
    >
      <AssessmentPageContent />
    </Suspense>
  );
}
