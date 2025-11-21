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
  searchKeys?: string[];
  filters?: FilterConfig[];
  pageTitle?: string;
  onFilterChange?: (filters: Record<string, any>) => void;
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

export default function DynamicTableTailwind<T extends Record<string, any>>({
  data,
  columns,
  pageTitle,
  loading = false,
  error = null,
  searchable = true,
  searchPlaceholder = "Search...",
  searchKeys = [],
  filters = [],
  onFilterChange,
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
    const newFilters = {
      ...filterValues,
      [key]: value,
    };
    setFilterValues(newFilters);

    // Notify parent component about filter changes
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
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
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filterValues[filter.key] || ""}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
          />
        );

      case "text":
        return (
          <input
            type="text"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      <div
        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
        role="alert"
      >
        <p className="font-medium">Error</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {pageTitle && (
        <div className="page-header mb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            {pageTitle}
          </h1>
        </div>
      )}

      {/* Search and Filters Bar */}
      {(searchable || filters.length > 0) && (
        <div className="mb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Search Input */}
            {searchable && searchKeys.length > 0 && (
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      onClick={() => setSearchTerm("")}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Filter and Page Size Controls */}
            <div className="flex items-center gap-2">
              {/* Filter Toggle Button */}
              {filters.length > 0 && (
                <>
                  <button
                    className={`relative px-4 py-2 rounded-lg border transition-colors ${
                      showFilters
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <FaFilter className="inline mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>
                  {activeFiltersCount > 0 && (
                    <button
                      className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                      onClick={clearFilters}
                    >
                      Clear All
                    </button>
                  )}
                </>
              )}

              {/* Page Size Selector */}
              {pagination?.onPageSizeChange && (
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-700 whitespace-nowrap">
                    Show:
                  </label>
                  <select
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        <div className="mb-4 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filters.map((filter) => (
              <div key={filter.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
        <div className="mb-3">
          <p className="text-sm text-gray-600">
            Found {filteredData.length} result
            {filteredData.length !== 1 ? "s" : ""}
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable
                      ? "cursor-pointer select-none hover:bg-gray-100"
                      : ""
                  } ${column.className || ""}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && (
                      <span className="text-gray-400">
                        {sortConfig?.key === column.key ? (
                          sortConfig.direction === "asc" ? (
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" />
                            </svg>
                          ) : (
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" />
                            </svg>
                          )
                        ) : (
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
                          </svg>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-500">Loading data...</p>
                  </div>
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr
                  key={index}
                  onClick={() => onRowClick?.(item, index)}
                  className={`${
                    onRowClick ? "cursor-pointer hover:bg-gray-50" : ""
                  } transition-colors ${rowClassName?.(item, index) || ""}`}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${
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
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <svg
                      className="w-16 h-16 mb-4 opacity-30"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <p className="text-gray-500">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && !loading && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {Math.min(
                (pagination.currentPage - 1) * pagination.pageSize + 1,
                pagination.total
              )}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(
                pagination.currentPage * pagination.pageSize,
                pagination.total
              )}
            </span>{" "}
            of <span className="font-medium">{pagination.total}</span> results
          </div>
          <nav className="flex items-center gap-1">
            {/* First Page */}
            <button
              onClick={() => pagination.onPageChange(1)}
              disabled={pagination.currentPage === 1}
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Previous Page */}
            <button
              onClick={() =>
                pagination.onPageChange(pagination.currentPage - 1)
              }
              disabled={pagination.currentPage === 1}
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Numbers */}
            {(() => {
              const pages = [];
              const maxVisible = 5;
              let start = Math.max(
                1,
                pagination.currentPage - Math.floor(maxVisible / 2)
              );
              let end = Math.min(pagination.totalPages, start + maxVisible - 1);

              if (end - start + 1 < maxVisible) {
                start = Math.max(1, end - maxVisible + 1);
              }

              for (let i = start; i <= end; i++) {
                pages.push(
                  <button
                    key={i}
                    onClick={() => pagination.onPageChange(i)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      i === pagination.currentPage
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {i}
                  </button>
                );
              }
              return pages;
            })()}

            {/* Next Page */}
            <button
              onClick={() =>
                pagination.onPageChange(pagination.currentPage + 1)
              }
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaChevronRight className="w-4 h-4" />
            </button>

            {/* Last Page */}
            <button
              onClick={() => pagination.onPageChange(pagination.totalPages)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
