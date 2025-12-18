"use client";
import React, { useState } from "react";
import DynamicTable, {
  FilterConfig,
  Column,
} from "@/app/components/table/DynamicTableTailwind";
import { useGetEnquiriesQuery } from "@/app/redux/services/enquiriesApi";

interface Enquiry {
  id?: string;
  subject: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  designation?: string;
  enquiryType?: string;
  scheme?: string;
  trainingCategory?: string;
  trainingType?: string;
  trainingDelivery?: string;
  numberOfLearners?: number;
  preferredLearningDate?: string;
  organizationType?: string;
  language?: string;
  certificationsHeld?: string;
  delivery?: string;
  numberOfLocations?: string;
  hoursOfOperation?: string;
  certifiedScope?: string;
  auditingDelivery?: string;
  industry?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
  isActive?: boolean;
  isDeleted?: boolean;
}

// View model to shape/format API data for the table
const toViewModel = (item: any): Enquiry => ({
  id: item.id,
  subject: item.subject,
  name: item.name,
  email: item.email,
  phone: item.phone,
  company: item.company,
  designation: item.designation,
  enquiryType: item.enquiryType,
  scheme: item.scheme,
  trainingCategory: item.trainingCategory,
  trainingType: item.trainingType,
  trainingDelivery: item.trainingDelivery,
  numberOfLearners: item.numberOfLearners,
  preferredLearningDate: item.preferredLearningDate,
  organizationType: item.organizationType,
  language: item.language,
  certificationsHeld: item.certificationsHeld,
  delivery: item.delivery,
  numberOfLocations: item.numberOfLocations,
  hoursOfOperation: item.hoursOfOperation,
  certifiedScope: item.certifiedScope,
  auditingDelivery: item.auditingDelivery,
  industry: item.industry,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
  status: item.status,
  isActive: item.isActive,
  isDeleted: item.isDeleted,
});
export default function EnquiriesPage() {
  const [filters, setFilters] = useState({ search: "", page: 1, limit: 10 });

  const { data, isLoading, error } = useGetEnquiriesQuery(filters);

  const enquiries: Enquiry[] = (data?.data || []).map(toViewModel);
  const totalItems = data?.totalItems || enquiries.length || 0;
  const totalPages =
    data?.totalPages || Math.ceil(totalItems / (filters.limit || 10)) || 1;

  const columns: Column<Enquiry>[] = [
    {
      key: "subject",
      label: "Subject",
      render: (item: Enquiry) => (
        <span className="font-semibold text-gray-900">
          {item.subject || "—"}
        </span>
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (item: Enquiry) => (
        <span className="text-gray-800">{item.name || "—"}</span>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (item: Enquiry) => (
        <a
          href={`mailto:${item.email || ""}`}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          {item.email || "—"}
        </a>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (item: Enquiry) => (
        <span className="text-gray-800">{item.phone || "—"}</span>
      ),
    },
    {
      key: "company",
      label: "Company",
      render: (item: Enquiry) => (
        <span className="text-gray-800">{item.company || "—"}</span>
      ),
    },
    {
      key: "enquiryType",
      label: "Enquiry Type",
      render: (item: Enquiry) => (
        <span className="text-gray-800">{item.enquiryType || "—"}</span>
      ),
    },
    {
      key: "scheme",
      label: "Scheme",
      render: (item: Enquiry) => (
        <span className="text-gray-800">{item.scheme || "—"}</span>
      ),
    },
    {
      key: "trainingCategory",
      label: "Training Category",
      render: (item: Enquiry) => (
        <span className="text-gray-800">{item.trainingCategory || "—"}</span>
      ),
    },
    {
      key: "industry",
      label: "Industry",
      render: (item: Enquiry) => (
        <span className="text-gray-800">{item.industry || "—"}</span>
      ),
    },
    {
      key: "trainingType",
      label: "Training Type",
      render: (item: Enquiry) => (
        <span className="text-gray-800">{item.trainingType || "—"}</span>
      ),
    },
    {
      key: "trainingDelivery",
      label: "Delivery",
      render: (item: Enquiry) => (
        <span className="text-gray-800">
          {item.trainingDelivery || item.delivery || "—"}
        </span>
      ),
    },
    {
      key: "numberOfLearners",
      label: "Learners",
      render: (item: Enquiry) => (
        <span className="text-gray-800">{item.numberOfLearners ?? "—"}</span>
      ),
    },
    {
      key: "preferredLearningDate",
      label: "Preferred Date",
      render: (item: Enquiry) => (
        <span className="text-gray-800">
          {item.preferredLearningDate || "—"}
        </span>
      ),
    },
    {
      key: "organizationType",
      label: "Org Type",
      render: (item: Enquiry) => (
        <span className="text-gray-800">{item.organizationType || "—"}</span>
      ),
    },
    {
      key: "language",
      label: "Language",
      render: (item: Enquiry) => (
        <span className="text-gray-800">{item.language || "—"}</span>
      ),
    },
    {
      key: "certificationsHeld",
      label: "Certifications",
      render: (item: Enquiry) => (
        <span className="text-gray-800">{item.certificationsHeld || "—"}</span>
      ),
    },
    {
      key: "numberOfLocations",
      label: "Locations",
      render: (item: Enquiry) => (
        <span className="text-gray-800">{item.numberOfLocations || "—"}</span>
      ),
    },
    {
      key: "hoursOfOperation",
      label: "Hours",
      render: (item: Enquiry) => (
        <span className="text-gray-800">{item.hoursOfOperation || "—"}</span>
      ),
    },
    {
      key: "certifiedScope",
      label: "Certified Scope",
      render: (item: Enquiry) => (
        <span className="text-gray-800">{item.certifiedScope || "—"}</span>
      ),
    },
    {
      key: "auditingDelivery",
      label: "Auditing Delivery",
      render: (item: Enquiry) => (
        <span className="text-gray-800">{item.auditingDelivery || "—"}</span>
      ),
    },
    {
      key: "designation",
      label: "Designation",
      render: (item: Enquiry) => (
        <span className="text-gray-800">{item.designation || "—"}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item: Enquiry) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
          {item.status || "—"}
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Active",
      render: (item: Enquiry) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.isActive
              ? "bg-green-100 text-green-800"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {item.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (item: Enquiry) => (
        <span className="text-gray-600 text-sm">
          {item.createdAt ? new Date(item.createdAt).toLocaleString() : "—"}
        </span>
      ),
    },
  ];

  const filterConfig: FilterConfig[] = [
    {
      key: "search",
      label: "Search",
      type: "text",
      placeholder: "Search enquiries...",
    },
  ];

  const handleFilterChange = (next: Record<string, unknown>) => {
    const keys = Object.keys(next);
    const shouldResetPage = keys.some((k) => k !== "page" && k !== "limit");
    setFilters((prev) => ({
      ...prev,
      ...next,
      page: shouldResetPage ? 1 : (next.page as number) || prev.page,
      limit: (next.limit as number) || prev.limit,
    }));
  };

  return (
    <div className="page-wrapper" style={{ minHeight: 730 }}>
      <div className="content container-fluid">
        <DynamicTable
          data={enquiries as any}
          columns={columns as any}
          loading={isLoading}
          pageTitle="Enquiries"
          error={error ? "Failed to load enquiries" : null}
          filters={filterConfig}
          onFilterChange={handleFilterChange}
          pagination={{
            total: totalItems,
            currentPage: filters.page,
            totalPages,
            pageSize: filters.limit,
            onPageChange: (p) => setFilters((prev) => ({ ...prev, page: p })),
            onPageSizeChange: (size) =>
              setFilters((prev) => ({ ...prev, limit: size, page: 1 })),
            pageSizeOptions: [5, 10, 20, 50],
          }}
        />
      </div>
    </div>
  );
}
