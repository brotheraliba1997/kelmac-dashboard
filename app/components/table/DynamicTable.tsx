"use client";

import React, { useState, useMemo } from "react";
import {
  FaSearch,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: "select" | "date" | "daterange" | "text";
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface DynamicTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  error?: string | null;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: string[]; // Keys to search in
  filters?: FilterConfig[];
  pagination?: {
    total: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    pageSizeOptions?: number[];
  };
  onRowClick?: (item: T, index: number) => void;
  emptyMessage?: string;
  className?: string;
  rowClassName?: (item: T, index: number) => string;
}

export default function DynamicTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  error = null,
  searchable = true,
  searchPlaceholder = "Search...",
  searchKeys = [],
  filters = [],
  pagination,
  onRowClick,
  emptyMessage = "No data found",
  className = "",
  rowClassName,
}: DynamicTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [showFilters, setShowFilters] = useState(false);

  // Handle sorting
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Get nested value from object
  const getNestedValue = (obj: any, path: string): any => {
    return path.split(".").reduce((acc, part) => acc?.[part], obj);
  };

  // Filter data based on search term
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search filter
    if (searchTerm && searchKeys.length > 0) {
      result = result.filter((item) =>
        searchKeys.some((key) => {
          const value = getNestedValue(item, key);
          return value
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply custom filters
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value) {
        result = result.filter((item) => {
          const itemValue = getNestedValue(item, key);
          if (Array.isArray(value)) {
            // For date range
            const [start, end] = value;
            const itemDate = new Date(itemValue);
            return itemDate >= new Date(start) && itemDate <= new Date(end);
          }
          return itemValue?.toString().toLowerCase() === value.toLowerCase();
        });
      }
    });

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = getNestedValue(a, sortConfig.key);
        const bValue = getNestedValue(b, sortConfig.key);

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, searchKeys, filterValues, sortConfig]);

  // Handle filter change
  const handleFilterChange = (key: string, value: any) => {
    setFilterValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilterValues({});
    setSearchTerm("");
  };

  // Render filter input based on type
  const renderFilterInput = (filter: FilterConfig) => {
    switch (filter.type) {
      case "select":
        return (
          <select
            className="form-select form-select-sm"
            value={filterValues[filter.key] || ""}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
          >
            <option value="">All</option>
            {filter.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "date":
        return (
          <input
            type="date"
            className="form-control form-control-sm"
            value={filterValues[filter.key] || ""}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
          />
        );

      case "text":
        return (
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder={filter.placeholder || `Filter by ${filter.label}`}
            value={filterValues[filter.key] || ""}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
          />
        );

      default:
        return null;
    }
  };

  // Calculate active filters count
  const activeFiltersCount = Object.values(filterValues).filter(
    (v) => v && v !== ""
  ).length;

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className={`dynamic-table-container ${className}`}>
      {/* Search and Filters Bar */}
      {(searchable || filters.length > 0) && (
        <div className="row mb-3">
          <div className="col-md-12">
            <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap">
              {/* Search Input */}
              {searchable && searchKeys.length > 0 && (
                <div className="grow" style={{ maxWidth: "400px" }}>
                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <FaSearch className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={searchPlaceholder}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setSearchTerm("")}
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Filter Toggle Button */}
              {filters.length > 0 && (
                <div className="d-flex gap-2">
                  <button
                    className={`btn btn-outline-primary position-relative ${
                      showFilters ? "active" : ""
                    }`}
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <FaFilter className="me-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>
                  {activeFiltersCount > 0 && (
                    <button
                      className="btn btn-outline-secondary"
                      onClick={clearFilters}
                    >
                      Clear All
                    </button>
                  )}
                </div>
              )}

              {/* Page Size Selector */}
              {pagination?.onPageSizeChange && (
                <div className="d-flex align-items-center gap-2">
                  <label className="mb-0 text-nowrap">Show:</label>
                  <select
                    className="form-select form-select-sm"
                    style={{ width: "auto" }}
                    value={pagination.pageSize}
                    onChange={(e) =>
                      pagination.onPageSizeChange?.(Number(e.target.value))
                    }
                  >
                    {(pagination.pageSizeOptions || [10, 20, 50, 100]).map(
                      (size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && filters.length > 0 && (
        <div className="card mb-3">
          <div className="card-body">
            <div className="row g-3">
              {filters.map((filter) => (
                <div key={filter.key} className="col-md-3 col-sm-6">
                  <label className="form-label small fw-bold">
                    {filter.label}
                  </label>
                  {renderFilterInput(filter)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      {(searchTerm || activeFiltersCount > 0) && !loading && (
        <div className="mb-2">
          <small className="text-muted">
            Found {filteredData.length} result
            {filteredData.length !== 1 ? "s" : ""}
            {searchTerm && ` for "${searchTerm}"`}
          </small>
        </div>
      )}

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-hover table-center mb-0">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`${column.className || ""} ${
                    column.sortable ? "cursor-pointer user-select-none" : ""
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="d-flex align-items-center gap-2">
                    {column.label}
                    {column.sortable && (
                      <span className="text-muted">
                        {sortConfig?.key === column.key ? (
                          sortConfig.direction === "asc" ? (
                            <i className="bi bi-arrow-up"></i>
                          ) : (
                            <i className="bi bi-arrow-down"></i>
                          )
                        ) : (
                          <i className="bi bi-arrow-down-up"></i>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">Loading data...</p>
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr
                  key={index}
                  onClick={() => onRowClick?.(item, index)}
                  className={`${onRowClick ? "cursor-pointer" : ""} ${
                    rowClassName?.(item, index) || ""
                  }`}
                >
                  {columns.map((column) => (
                    <td key={column.key} className={column.className || ""}>
                      {column.render
                        ? column.render(item, index)
                        : getNestedValue(item, column.key)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-5">
                  <div className="text-muted">
                    <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                    {emptyMessage}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && !loading && (
        <div className="row mt-3">
          <div className="col-md-12">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div className="text-muted">
                Showing{" "}
                {Math.min(
                  (pagination.currentPage - 1) * pagination.pageSize + 1,
                  pagination.total
                )}{" "}
                to{" "}
                {Math.min(
                  pagination.currentPage * pagination.pageSize,
                  pagination.total
                )}{" "}
                of {pagination.total} entries
              </div>
              <nav>
                <ul className="pagination mb-0">
                  {/* First Page */}
                  <li
                    className={`page-item ${
                      pagination.currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => pagination.onPageChange(1)}
                      disabled={pagination.currentPage === 1}
                    >
                      <i className="bi bi-chevron-double-left"></i>
                    </button>
                  </li>

                  {/* Previous Page */}
                  <li
                    className={`page-item ${
                      pagination.currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() =>
                        pagination.onPageChange(pagination.currentPage - 1)
                      }
                      disabled={pagination.currentPage === 1}
                    >
                      <FaChevronLeft />
                    </button>
                  </li>

                  {/* Page Numbers */}
                  {(() => {
                    const pages = [];
                    const maxVisible = 5;
                    let start = Math.max(
                      1,
                      pagination.currentPage - Math.floor(maxVisible / 2)
                    );
                    let end = Math.min(
                      pagination.totalPages,
                      start + maxVisible - 1
                    );

                    if (end - start + 1 < maxVisible) {
                      start = Math.max(1, end - maxVisible + 1);
                    }

                    for (let i = start; i <= end; i++) {
                      pages.push(
                        <li
                          key={i}
                          className={`page-item ${
                            i === pagination.currentPage ? "active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => pagination.onPageChange(i)}
                          >
                            {i}
                          </button>
                        </li>
                      );
                    }
                    return pages;
                  })()}

                  {/* Next Page */}
                  <li
                    className={`page-item ${
                      pagination.currentPage === pagination.totalPages
                        ? "disabled"
                        : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() =>
                        pagination.onPageChange(pagination.currentPage + 1)
                      }
                      disabled={
                        pagination.currentPage === pagination.totalPages
                      }
                    >
                      <FaChevronRight />
                    </button>
                  </li>

                  {/* Last Page */}
                  <li
                    className={`page-item ${
                      pagination.currentPage === pagination.totalPages
                        ? "disabled"
                        : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() =>
                        pagination.onPageChange(pagination.totalPages)
                      }
                      disabled={
                        pagination.currentPage === pagination.totalPages
                      }
                    >
                      <i className="bi bi-chevron-double-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// CSS for cursor pointer
const styles = `
  .cursor-pointer {
    cursor: pointer;
  }
  
  .cursor-pointer:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
  
  .user-select-none {
    user-select: none;
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
