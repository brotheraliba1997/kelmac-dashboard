"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaSpinner, FaChevronDown, FaTimes } from "react-icons/fa";

export interface SearchableSelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SearchableSelectProps {
  value: string | number;
  onChange: (value: string | number) => void;
  onSearch?: (searchTerm: string, page: number) => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  label?: string;
  loading?: boolean;
  hasMore?: boolean;
  currentPage?: number;
  totalPages?: number;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export default function SearchableSelect({
  value,
  onChange,
  onSearch,
  options,
  placeholder = "Search and select...",
  label,
  loading = false,
  hasMore = false,
  currentPage = 1,
  totalPages = 1,
  error,
  disabled = false,
  required = false,
  className = "",
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Find selected option
  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle search with debounce
  useEffect(() => {
    if (!onSearch) return;

    const timer = setTimeout(() => {
      onSearch(searchTerm, page);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, page, onSearch]);

  const handleSelect = (optionValue: string | number) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
    setPage(1);
  };

  const handleClear = () => {
    onChange("");
    setSearchTerm("");
    setPage(1);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  const filteredOptions = onSearch
    ? options // Server-side filtering
    : options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      ); // Client-side filtering

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div ref={dropdownRef} className="relative">
        {/* Select Input */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full px-3 py-2 text-left border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error ? "border-red-500" : "border-gray-300"
          } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
        >
          <div className="flex items-center justify-between">
            <span
              className={selectedOption ? "text-gray-900" : "text-gray-400"}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <div className="flex items-center space-x-2">
              {value && !disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              )}
              <FaChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  isOpen ? "transform rotate-180" : ""
                }`}
              />
            </div>
          </div>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
            {/* Search Input */}
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Options List */}
            <div className="overflow-y-auto max-h-60">
              {loading && page === 1 ? (
                <div className="flex items-center justify-center py-8">
                  <FaSpinner className="w-6 h-6 text-blue-600 animate-spin" />
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  No options found
                </div>
              ) : (
                <>
                  {filteredOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      disabled={option.disabled}
                      className={`w-full px-4 py-2 text-left hover:bg-blue-50 ${
                        option.value === value
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "text-gray-900"
                      } ${
                        option.disabled
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}

                  {/* Load More Button */}
                  {hasMore && (
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      disabled={loading}
                      className="w-full px-4 py-3 text-center text-blue-600 hover:bg-blue-50 border-t border-gray-200 font-medium"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <FaSpinner className="w-4 h-4 animate-spin mr-2" />
                          Loading...
                        </div>
                      ) : (
                        `Load More (Page ${page} of ${totalPages})`
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
