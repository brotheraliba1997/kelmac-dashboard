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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={filterValues[filter.key] || ""}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
          />
        );

      case "text":
        return (
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}
    >
      {/* Search and Filters Bar */}
      {(searchable || filters.length > 0) && (
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Search Input */}
            {searchable && searchKeys.length > 0 && (
              <div className="w-full md:w-96">
                <div className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent">
                  <FaSearch className="text-gray-400" />
                  <input
                    type="text"
                    className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-500"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      className="text-gray-400 hover:text-gray-600 text-lg"
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
              <div className="flex gap-2">
                <button
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors ${
                    showFilters
                      ? "bg-primary-50 border-primary-300 text-primary-600"
                      : "border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FaFilter />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
                {activeFiltersCount > 0 && (
                  <button
                    className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors text-sm"
                    onClick={clearFilters}
                  >
                    Clear All
                  </button>
                )}
              </div>
            )}

            {/* Page Size Selector */}
            {pagination?.onPageSizeChange && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 font-medium">
                  Show:
                </label>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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
      )}
      {/* Filters Panel */}
      {showFilters && filters.length > 0 && (
        <div className="p-4 md:p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filters.map((filter) => (
              <div key={filter.key}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {filter.label}
                </label>
                {renderFilterInput(filter)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Count */}
      {(searchTerm || activeFiltersCount > 0) && !loading && (
        <div className="px-4 md:px-6 pt-4">
          <small className="text-gray-600">
            Found {filteredData.length} result
            {filteredData.length !== 1 ? "s" : ""}
            {searchTerm && ` for "${searchTerm}"`}
          </small>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 md:px-6 py-3 text-left text-sm font-semibold text-gray-700 ${
                    column.className || ""
                  } ${
                    column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && (
                      <span className="text-gray-400 text-xs">
                        {sortConfig?.key === column.key
                          ? sortConfig.direction === "asc"
                            ? "↑"
                            : "↓"
                          : "↕"}
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
                <td
                  colSpan={columns.length}
                  className="px-4 md:px-6 py-12 text-center"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-8 h-8 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin"></div>
                    <p className="mt-3 text-gray-600 text-sm">
                      Loading data...
                    </p>
                  </div>
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr
                  key={index}
                  onClick={() => onRowClick?.(item, index)}
                  className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                    onRowClick ? "cursor-pointer" : ""
                  } ${rowClassName?.(item, index) || ""}`}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-4 md:px-6 py-4 text-sm text-gray-900 ${
                        column.className || ""
                      }`}
                    >
                      {column.render
                        ? column.render(item, index)
                        : getNestedValue(item, column.key)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 md:px-6 py-12 text-center"
                >
                  <div className="text-gray-500">
                    <div className="text-5xl mb-3">📭</div>
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
        <div className="p-4 md:p-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
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
            <nav className="flex items-center gap-1">
              {/* First Page */}
              <button
                onClick={() => pagination.onPageChange(1)}
                disabled={pagination.currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="First Page"
              >
                <FaChevronLeft className="w-4 h-4 mr-1 inline" />
              </button>

              {/* Previous Page */}
              <button
                onClick={() =>
                  pagination.onPageChange(pagination.currentPage - 1)
                }
                disabled={pagination.currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Previous Page"
              >
                <FaChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Numbers */}
              <div className="flex gap-1">
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
                      <button
                        key={i}
                        onClick={() => pagination.onPageChange(i)}
                        className={`w-10 h-10 rounded-lg border transition-colors ${
                          i === pagination.currentPage
                            ? "bg-primary-600 text-white border-primary-600"
                            : "border-gray-300 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {i}
                      </button>
                    );
                  }
                  return pages;
                })()}
              </div>

              {/* Next Page */}
              <button
                onClick={() =>
                  pagination.onPageChange(pagination.currentPage + 1)
                }
                disabled={pagination.currentPage === pagination.totalPages}
                className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Next Page"
              >
                <FaChevronRight className="w-4 h-4" />
              </button>

              {/* Last Page */}
              <button
                onClick={() => pagination.onPageChange(pagination.totalPages)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Last Page"
              >
                <FaChevronRight className="w-4 h-4 mr-1 inline" />
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
