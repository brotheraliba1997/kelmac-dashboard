"use client";

import { useState } from "react";
import { useGetPaymentsQuery } from "@/app/redux/services/PaymentAPI";
import { toast } from "react-toastify";
import { FaEye, FaFileInvoice } from "react-icons/fa";
import DynamicTable, {
  Column,
  FilterConfig,
} from "@/app/components/table/DynamicTableTailwind";

export default function StripePaymentsTab() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch Stripe payments
  const {
    data: paymentsData,
    isLoading: paymentsLoading,
    error: paymentsError,
  } = useGetPaymentsQuery({
    page: currentPage,
    limit,
    ...(statusFilter ? { status: statusFilter } : {}),
  });

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
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

  // Stripe Payments Table Columns
  const paymentsColumns: Column<any>[] = [
    {
      key: "stripePaymentIntentId",
      label: "Payment ID",
      sortable: true,
      render: (payment) => (
        <span className="text-blue-600 font-medium">
          #{payment.stripePaymentIntentId?.slice(-8) || payment._id?.slice(-8)}
        </span>
      ),
    },
    {
      key: "userId",
      label: "Customer",
      sortable: true,
      render: (payment) => (
        <div className="flex items-center">
          <img
            className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-gray-200"
            src={payment.userId?.avatar || "/default-avatar.png"}
            alt="User"
          />
          <div>
            <div className="font-semibold text-gray-900">
              {payment.userId?.firstName} {payment.userId?.lastName}
            </div>
            <div className="text-sm text-gray-500">{payment.userId?.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "courseId.title",
      label: "Course",
      sortable: true,
      render: (payment) => payment.courseId?.title || "N/A",
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (payment) => (
        <span className="font-semibold text-gray-900">
          {formatCurrency(payment.amount, payment.currency)}
        </span>
      ),
    },
    {
      key: "paymentMethod",
      label: "Method",
      sortable: true,
      render: (payment) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 uppercase">
          {payment.paymentMethod}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (payment) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase ${
            payment.status === "completed" || payment.status === "succeeded"
              ? "bg-green-100 text-green-800"
              : payment.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : payment.status === "failed"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {payment.status}
        </span>
      ),
    },
    {
      key: "paidAt",
      label: "Paid Date",
      sortable: true,
      render: (payment) => (
        <span className="text-gray-900">
          {payment.paidAt
            ? formatDate(payment.paidAt)
            : formatDate(payment.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (payment) => (
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 text-sm font-medium transition-colors"
            title="View Details"
            onClick={() => {
              toast.info("View details functionality coming soon!");
            }}
          >
            <FaEye />
          </button>
          {payment.receiptUrl && (
            <a
              href={payment.receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 border border-green-600 text-green-600 rounded-md hover:bg-green-50 text-sm font-medium transition-colors"
              title="View Receipt"
            >
              <FaFileInvoice />
            </a>
          )}
        </div>
      ),
    },
  ];

  // Filters for Stripe Payments
  const paymentsFilters: FilterConfig[] = [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "", label: "All Statuses" },
        { value: "pending", label: "Pending" },
        { value: "completed", label: "Completed" },
        { value: "succeeded", label: "Succeeded" },
        { value: "failed", label: "Failed" },
        { value: "refunded", label: "Refunded" },
      ],
    },
  ];

  // Handle filter changes for Payments
  const handlePaymentsFilterChange = (filters: Record<string, any>) => {
    setStatusFilter(filters.status || "");
    setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
    <DynamicTable
      data={paymentsData?.data || []}
      columns={paymentsColumns}
      loading={paymentsLoading}
      error={paymentsError ? "Error loading payments. Please try again." : null}
      searchable={true}
      searchPlaceholder="Search by payment ID, customer, or course..."
      searchKeys={[
        "stripePaymentIntentId",
        "_id",
        "userId.firstName",
        "userId.lastName",
        "userId.email",
        "courseId.title",
        "paymentMethod",
      ]}
      filters={paymentsFilters}
      onFilterChange={handlePaymentsFilterChange}
      pagination={
        paymentsData?.pagination
          ? {
              total: paymentsData.pagination.total,
              currentPage: currentPage,
              totalPages: paymentsData.pagination.totalPages,
              pageSize: limit,
              onPageChange: setCurrentPage,
              onPageSizeChange: setLimit,
              pageSizeOptions: [10, 20, 50, 100],
            }
          : undefined
      }
      emptyMessage="No payments found"
    />
  );
}
