"use client";

import { useState } from "react";
import {
  useGetPurchaseOrdersQuery,
  useUpdatePurchaseOrderMutation,
} from "@/app/redux/services/purchaseOrderApi";
import { toast } from "react-toastify";
import { FaCheck, FaTimes, FaFileInvoice } from "react-icons/fa";
import DynamicTable, {
  Column,
  FilterConfig,
} from "@/app/components/table/DynamicTableTailwind";

export default function PurchaseOrdersTab() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [decisionNotes, setDecisionNotes] = useState("");
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null
  );

  // Fetch Purchase Orders
  const {
    data: purchaseOrdersData,
    isLoading: purchaseOrdersLoading,
    error: purchaseOrdersError,
  } = useGetPurchaseOrdersQuery({
    page: currentPage,
    limit,
    ...(statusFilter ? { status: statusFilter } : {}),
  });

  // Update Purchase Order Mutation
  const [updatePurchaseOrder, { isLoading: isUpdating }] =
    useUpdatePurchaseOrderMutation();

  const handleOpenModal = (order: any, action: "approve" | "reject") => {
    setSelectedOrder(order);
    setActionType(action);
    setDecisionNotes("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setActionType(null);
    setDecisionNotes("");
  };

  const handleSubmitDecision = async () => {
    if (!selectedOrder || !actionType) return;

    try {
      // Get current user ID from localStorage or auth state
      const userId =
        localStorage.getItem("userId") || "675f4aaf2b67a23d4c9f2941";

      await updatePurchaseOrder({
        id: selectedOrder._id,
        status: actionType === "approve" ? "approved" : "rejected",
        reviewedBy: userId,
        reviewedAt: new Date().toISOString(),
        decisionNotes: decisionNotes || undefined,
      }).unwrap();

      toast.success(
        `Purchase order ${
          actionType === "approve" ? "approved" : "rejected"
        } successfully!`
      );
      handleCloseModal();
    } catch (error: any) {
      console.error("Error updating purchase order:", error);
      toast.error(error?.data?.message || "Failed to update purchase order");
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Purchase Orders Table Columns
  const purchaseOrdersColumns: Column<any>[] = [
    {
      key: "poNumber",
      label: "PO Number",
      sortable: true,
      render: (order) => (
        <span className="text-blue-600 font-medium">
          {order.poNumber || `#${order._id?.slice(-8)}`}
        </span>
      ),
    },
    {
      key: "student",
      label: "Student",
      sortable: true,
      render: (order) => (
        <div className="flex items-center">
          <img
            className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-gray-200"
            src={order.student?.avatar || "/default-avatar.png"}
            alt="Student"
          />
          <div>
            <div className="font-semibold text-gray-900">
              {order.student?.firstName} {order.student?.lastName}
            </div>
            <div className="text-sm text-gray-500">{order.student?.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "course.title",
      label: "Course",
      sortable: true,
      render: (order) => (
        <span className="font-semibold text-gray-900">
          {order.course?.title || "N/A"}
        </span>
      ),
    },
    {
      key: "financialContact",
      label: "Financial Contact",
      sortable: true,
      render: (order) => (
        <div>
          <div className="font-medium text-gray-900">
            {order.financialContact?.firstName}{" "}
            {order.financialContact?.lastName}
          </div>
          <div className="text-sm text-gray-500">
            {order.financialContact?.email}
          </div>
        </div>
      ),
    },
    {
      key: "bankSlipUrl",
      label: "Bank Slip",
      render: (order) =>
        order.bankSlipUrl ? (
          <a
            href={order.bankSlipUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50 text-sm font-medium transition-colors"
          >
            <FaFileInvoice className="mr-1.5" />
            View
          </a>
        ) : (
          <span className="text-gray-400">No document</span>
        ),
    },
    {
      key: "submittedAt",
      label: "Submitted",
      sortable: true,
      render: (order) => (
        <span className="text-gray-900">{formatDate(order.submittedAt)}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (order) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase ${
            order.status === "approved"
              ? "bg-green-100 text-green-800"
              : order.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : order.status === "rejected"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {order.status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (order) => (
        <div className="flex gap-2">
          <button
            className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleOpenModal(order, "approve")}
            disabled={isUpdating || order.status !== "pending"}
            title="Approve"
          >
            <FaCheck />
          </button>
          <button
            className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleOpenModal(order, "reject")}
            disabled={isUpdating || order.status !== "pending"}
            title="Reject"
          >
            <FaTimes />
          </button>
        </div>
      ),
    },
  ];

  // Filters for Purchase Orders
  const purchaseOrdersFilters: FilterConfig[] = [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "", label: "All Statuses" },
        { value: "pending", label: "Pending" },
        { value: "approved", label: "Approved" },
        { value: "rejected", label: "Rejected" },
      ],
    },
  ];

  // Handle filter changes for Purchase Orders
  const handlePurchaseOrdersFilterChange = (filters: Record<string, any>) => {
    setStatusFilter(filters.status || "");
    setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
    <>
      <DynamicTable
        data={purchaseOrdersData?.data || []}
        columns={purchaseOrdersColumns}
        loading={purchaseOrdersLoading}
        error={
          purchaseOrdersError
            ? "Error loading purchase orders. Please try again."
            : null
        }
        searchable={true}
        searchPlaceholder="Search by PO number, student, or course..."
        searchKeys={[
          "poNumber",
          "_id",
          "student.firstName",
          "student.lastName",
          "student.email",
          "course.title",
          "financialContact.firstName",
          "financialContact.lastName",
          "financialContact.email",
        ]}
        filters={purchaseOrdersFilters}
        onFilterChange={handlePurchaseOrdersFilterChange}
        pagination={
          purchaseOrdersData?.pagination
            ? {
                total: purchaseOrdersData.pagination.total,
                currentPage: currentPage,
                totalPages: purchaseOrdersData.pagination.totalPages,
                pageSize: limit,
                onPageChange: setCurrentPage,
                onPageSizeChange: setLimit,
                pageSizeOptions: [10, 20, 50, 100],
              }
            : undefined
        }
        emptyMessage="No purchase orders found"
      />

      {/* Modal for Approve/Reject */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {actionType === "approve" ? "Approve" : "Reject"} Purchase Order
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 transition-colors"
                onClick={handleCloseModal}
                disabled={isUpdating}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {selectedOrder && (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">PO Number</p>
                        <p className="font-semibold text-gray-900">
                          {selectedOrder.poNumber ||
                            `#${selectedOrder._id?.slice(-8)}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Submitted Date
                        </p>
                        <p className="font-semibold text-gray-900">
                          {formatDate(selectedOrder.submittedAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Student</p>
                        <p className="font-semibold text-gray-900">
                          {selectedOrder.student?.firstName}{" "}
                          {selectedOrder.student?.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Financial Contact
                        </p>
                        <p className="font-semibold text-gray-900">
                          {selectedOrder.financialContact?.firstName}{" "}
                          {selectedOrder.financialContact?.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Course</p>
                        <p className="font-semibold text-gray-900">
                          {selectedOrder.course?.title}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Bank Slip</p>
                        {selectedOrder.bankSlipUrl ? (
                          <a
                            href={selectedOrder.bankSlipUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View Document
                          </a>
                        ) : (
                          <p className="text-gray-400">No document</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedOrder.decisionNotes && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Previous Decision Notes
                      </p>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {selectedOrder.decisionNotes}
                      </p>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="decisionNotes"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Decision Notes
                      {actionType === "reject" && (
                        <span className="text-red-600 ml-1">*</span>
                      )}
                    </label>
                    <textarea
                      id="decisionNotes"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={4}
                      value={decisionNotes}
                      onChange={(e) => setDecisionNotes(e.target.value)}
                      placeholder={
                        actionType === "approve"
                          ? "Enter approval notes (optional)"
                          : "Enter reason for rejection (required)"
                      }
                      disabled={isUpdating}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleCloseModal}
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center ${
                  actionType === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
                onClick={handleSubmitDecision}
                disabled={
                  isUpdating ||
                  (actionType === "reject" && !decisionNotes.trim())
                }
              >
                {isUpdating ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    {actionType === "approve" ? (
                      <>
                        <FaCheck className="mr-2" />
                        Approve
                      </>
                    ) : (
                      <>
                        <FaTimes className="mr-2" />
                        Reject
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
