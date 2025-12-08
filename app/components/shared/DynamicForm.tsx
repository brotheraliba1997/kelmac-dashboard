"use client";
import React, { useState, useEffect } from "react";
import {
  FaSpinner,
  FaEye,
  FaEyeSlash,
  FaCalendar,
  FaUpload,
  FaTimes,
} from "react-icons/fa";

// Field types supported by the dynamic form
export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "textarea"
  | "select"
  | "multiselect"
  | "radio"
  | "checkbox"
  | "date"
  | "datetime-local"
  | "file"
  | "url"
  | "tel"
  | "range"
  | "color"
  | "hidden";

// Option for select, radio, and checkbox fields
export interface FieldOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

// Validation rule interface
export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any, formData?: Record<string, any>) => string | null;
}

// Individual field configuration
export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  defaultValue?: any;
  options?: FieldOption[];
  validation?: ValidationRule;
  disabled?: boolean;
  readonly?: boolean;
  className?: string;
  description?: string;
  icon?: React.ReactNode;
  dependency?: {
    field: string;
    value: any;
    show?: boolean; // true = show when matches, false = hide when matches
  };
  onChange?: (value: any, formData: Record<string, any>) => void;
}

// Form configuration
export interface DynamicFormConfig {
  fields: FormField[];
  title?: string;
  description?: string;
  submitText?: string;
  cancelText?: string;
  layout?: "vertical" | "horizontal" | "inline";
  columns?: number; // Grid columns (1-4)
  showProgress?: boolean;
  groupFields?: boolean;
}

// Component props
export interface DynamicFormProps {
  config: DynamicFormConfig;
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void> | void;
  onCancel?: () => void;
  loading?: boolean;
  errors?: Record<string, string>;
  className?: string;
}

export default function DynamicForm({
  config,
  initialData = {},
  onSubmit,
  onCancel,
  loading = false,
  errors = {},
  className = "",
}: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data with default values
  useEffect(() => {
    const defaultData = { ...initialData };
    config.fields.forEach((field) => {
      if (field.defaultValue !== undefined && !(field.name in defaultData)) {
        defaultData[field.name] = field.defaultValue;
      }
    });
    setFormData(defaultData);
  }, [config.fields, initialData]);

  // Validation function
  const validateField = (field: FormField, value: any): string | null => {
    const rules = field.validation;
    if (!rules) return null;

    // Required validation
    if (
      rules.required &&
      (!value || (Array.isArray(value) && value.length === 0))
    ) {
      return `${field.label} is required`;
    }

    // Skip other validations if value is empty and not required
    if (!value && !rules.required) return null;

    // Length validations
    if (rules.minLength && value.length < rules.minLength) {
      return `${field.label} must be at least ${rules.minLength} characters`;
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      return `${field.label} must not exceed ${rules.maxLength} characters`;
    }

    // Number validations
    if (field.type === "number" || field.type === "range") {
      const numValue = Number(value);
      if (rules.min !== undefined && numValue < rules.min) {
        return `${field.label} must be at least ${rules.min}`;
      }
      if (rules.max !== undefined && numValue > rules.max) {
        return `${field.label} must not exceed ${rules.max}`;
      }
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      return `${field.label} format is invalid`;
    }

    // Custom validation
    if (rules.custom) {
      return rules.custom(value, formData);
    }

    return null;
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    config.fields.forEach((field) => {
      if (isFieldVisible(field)) {
        const error = validateField(field, formData[field.name]);
        if (error) {
          newErrors[field.name] = error;
        }
      }
    });

    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if field should be visible based on dependencies
  const isFieldVisible = (field: FormField): boolean => {
    if (!field.dependency) return true;

    const dependencyValue = formData[field.dependency.field];
    const matches = dependencyValue === field.dependency.value;

    return field.dependency.show ? matches : !matches;
  };

  // Handle input changes
  const handleChange = (field: FormField, value: any) => {
    const newFormData = { ...formData, [field.name]: value };
    setFormData(newFormData);

    // Clear field error
    if (localErrors[field.name] || errors[field.name]) {
      setLocalErrors((prev) => ({ ...prev, [field.name]: "" }));
    }

    // Call field-specific onChange if provided
    if (field.onChange) {
      field.onChange(value, newFormData);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render field based on type
  const renderField = (field: FormField) => {
    if (!isFieldVisible(field)) return null;

    const value = formData[field.name] || "";
    const fieldError = localErrors[field.name] || errors[field.name];
    const isDisabled = field.disabled || loading || isSubmitting;

    const commonProps = {
      id: field.name,
      name: field.name,
      disabled: isDisabled,
      readOnly: field.readonly,
      className: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
        fieldError
          ? "border-danger-500 focus:ring-danger-500"
          : "border-gray-300"
      } ${field.className || ""}`,
    };

    switch (field.type) {
      case "hidden":
        return (
          <input
            key={field.name}
            type="hidden"
            name={field.name}
            value={value}
          />
        );

      case "textarea":
        return (
          <textarea
            {...commonProps}
            value={value}
            placeholder={field.placeholder}
            onChange={(e) => handleChange(field, e.target.value)}
            rows={4}
          />
        );

      case "select":
        return (
          <select
            {...commonProps}
            value={value}
            onChange={(e) => handleChange(field, e.target.value)}
          >
            <option value="">
              {field.placeholder || `Select ${field.label}`}
            </option>
            {field.options?.map((option, index) => (
              <option
                key={index}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
        );

      case "multiselect":
        return (
          <select
            {...commonProps}
            multiple
            value={Array.isArray(value) ? value : []}
            onChange={(e) => {
              const selectedValues = Array.from(
                e.target.selectedOptions,
                (option) => option.value
              );
              handleChange(field, selectedValues);
            }}
            size={Math.min(field.options?.length || 5, 5)}
          >
            {field.options?.map((option, index) => (
              <option
                key={index}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
        );

      case "radio":
        return (
          <div className="flex flex-wrap gap-3">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  id={`${field.name}_${index}`}
                  name={field.name}
                  value={option.value}
                  checked={value === option.value}
                  disabled={isDisabled || option.disabled}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500 disabled:opacity-50"
                  onChange={(e) => handleChange(field, e.target.value)}
                />
                <label
                  className="ml-2 text-sm text-gray-700"
                  htmlFor={`${field.name}_${index}`}
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      case "checkbox":
        if (field.options) {
          // Multiple checkboxes
          return (
            <div className="flex flex-wrap gap-3">
              {field.options.map((option, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`${field.name}_${index}`}
                    value={option.value}
                    checked={
                      Array.isArray(value) && value.includes(option.value)
                    }
                    disabled={isDisabled || option.disabled}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 disabled:opacity-50"
                    onChange={(e) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      const newValues = e.target.checked
                        ? [...currentValues, option.value]
                        : currentValues.filter((v) => v !== option.value);
                      handleChange(field, newValues);
                    }}
                  />
                  <label
                    className="ml-2 text-sm text-gray-700"
                    htmlFor={`${field.name}_${index}`}
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          );
        } else {
          // Single checkbox
          return (
            <div className="flex items-center">
              <input
                type="checkbox"
                id={field.name}
                name={field.name}
                checked={!!value}
                disabled={isDisabled}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 disabled:opacity-50"
                onChange={(e) => handleChange(field, e.target.checked)}
              />
              <label
                className="ml-2 text-sm text-gray-700"
                htmlFor={field.name}
              >
                {field.description || field.label}
              </label>
            </div>
          );
        }

      case "password":
        return (
          <div className="flex">
            <input
              {...commonProps}
              type={showPassword[field.name] ? "text" : "password"}
              value={value}
              placeholder={field.placeholder}
              onChange={(e) => handleChange(field, e.target.value)}
              className="flex-1 px-3 py-2 border border-r-0 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
            />
            <button
              type="button"
              className="px-3 py-2 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={() =>
                setShowPassword((prev) => ({
                  ...prev,
                  [field.name]: !prev[field.name],
                }))
              }
            >
              {showPassword[field.name] ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        );

      case "file":
        return (
          <div className="flex">
            <input
              {...commonProps}
              type="file"
              onChange={(e) => handleChange(field, e.target.files?.[0] || null)}
              accept={
                field.validation?.pattern
                  ? field.validation.pattern.source
                  : undefined
              }
            />
            <label
              className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 cursor-pointer"
              htmlFor={field.name}
            >
              <FaUpload />
            </label>
          </div>
        );

      case "range":
        return (
          <div>
            <input
              {...commonProps}
              type="range"
              value={value}
              min={field.validation?.min || 0}
              max={field.validation?.max || 100}
              onChange={(e) => handleChange(field, e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-gray-500 text-sm mt-1">
              <span>{field.validation?.min || 0}</span>
              <span className="font-bold text-gray-900">{value}</span>
              <span>{field.validation?.max || 100}</span>
            </div>
          </div>
        );

      default:
        return (
          <input
            {...commonProps}
            type={field.type}
            value={value}
            placeholder={field.placeholder}
            onChange={(e) => handleChange(field, e.target.value)}
            min={field.type === "number" ? field.validation?.min : undefined}
            max={field.type === "number" ? field.validation?.max : undefined}
          />
        );
    }
  };

  // Get grid column class
  const getColumnClass = () => {
    const columns = config.columns || 1;
    switch (columns) {
      case 2:
        return "md:w-1/2";
      case 3:
        return "lg:w-1/3";
      case 4:
        return "lg:w-1/4";
      default:
        return "w-full";
    }
  };

  // Filter visible fields
  const visibleFields = config.fields.filter(isFieldVisible);

  return (
    <div className={`dynamic-form ${className}`}>
      {config.title && (
        <div className="mb-4">
          <h4 className="text-xl font-semibold mb-2">{config.title}</h4>
          {config.description && (
            <p className="text-gray-600 mb-0">{config.description}</p>
          )}
        </div>
      )}

      {config.showProgress && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-primary-600 h-1.5 rounded-full transition-all duration-300"
              style={{
                width: `${
                  (Object.keys(formData).filter((key) => formData[key]).length /
                    visibleFields.length) *
                  100
                }%`,
              }}
            />
          </div>
          <small className="text-gray-500 text-sm mt-1">
            {Object.keys(formData).filter((key) => formData[key]).length} of{" "}
            {visibleFields.length} fields completed
          </small>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div
          className={`flex flex-wrap -mx-2 ${
            config.layout === "inline" ? "items-end" : ""
          }`}
        >
          {config.fields.map((field) => {
            if (!isFieldVisible(field)) return null;

            const fieldError = localErrors[field.name] || errors[field.name];

            return (
              <div key={field.name} className={`px-2 mb-4 ${getColumnClass()}`}>
                {field.type !== "hidden" && field.type !== "checkbox" && (
                  <label
                    htmlFor={field.name}
                    className="flex items-center text-sm font-medium text-gray-700 mb-1"
                  >
                    {field.icon && <span className="mr-2">{field.icon}</span>}
                    {field.label}
                    {field.validation?.required && (
                      <span className="text-danger-500 ml-1">*</span>
                    )}
                  </label>
                )}

                {renderField(field)}

                {fieldError && (
                  <div className="text-danger-600 text-sm mt-1">
                    {fieldError}
                  </div>
                )}

                {field.description && field.type !== "checkbox" && (
                  <div className="text-gray-500 text-sm mt-1">
                    {field.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 w-full">
          <div className="flex gap-3 items-center">
            {onCancel && (
              <button
                type="button"
                className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                <FaTimes className="w-4 h-4 mr-2" />
                {config.cancelText || "Previous"}
              </button>
            )}
            <button
              type="submit"
              className="flex-1 px-6 py-2.5 text-sm font-semibold text-white bg-secondary rounded-lg hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              disabled={isSubmitting || loading}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="inline animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                config.submitText || "Submit"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
