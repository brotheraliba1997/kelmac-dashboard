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
      className: `form-control ${fieldError ? "is-invalid" : ""} ${
        field.className || ""
      }`,
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
          <div className="d-flex flex-wrap gap-3">
            {field.options?.map((option, index) => (
              <div key={index} className="form-check">
                <input
                  type="radio"
                  id={`${field.name}_${index}`}
                  name={field.name}
                  value={option.value}
                  checked={value === option.value}
                  disabled={isDisabled || option.disabled}
                  className="form-check-input"
                  onChange={(e) => handleChange(field, e.target.value)}
                />
                <label
                  className="form-check-label"
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
            <div className="d-flex flex-wrap gap-3">
              {field.options.map((option, index) => (
                <div key={index} className="form-check">
                  <input
                    type="checkbox"
                    id={`${field.name}_${index}`}
                    value={option.value}
                    checked={
                      Array.isArray(value) && value.includes(option.value)
                    }
                    disabled={isDisabled || option.disabled}
                    className="form-check-input"
                    onChange={(e) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      const newValues = e.target.checked
                        ? [...currentValues, option.value]
                        : currentValues.filter((v) => v !== option.value);
                      handleChange(field, newValues);
                    }}
                  />
                  <label
                    className="form-check-label"
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
            <div className="form-check">
              <input
                type="checkbox"
                id={field.name}
                name={field.name}
                checked={!!value}
                disabled={isDisabled}
                className="form-check-input"
                onChange={(e) => handleChange(field, e.target.checked)}
              />
              <label className="form-check-label" htmlFor={field.name}>
                {field.description || field.label}
              </label>
            </div>
          );
        }

      case "password":
        return (
          <div className="input-group">
            <input
              {...commonProps}
              type={showPassword[field.name] ? "text" : "password"}
              value={value}
              placeholder={field.placeholder}
              onChange={(e) => handleChange(field, e.target.value)}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
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
          <div className="input-group">
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
            <label className="input-group-text" htmlFor={field.name}>
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
            />
            <div className="d-flex justify-content-between text-muted small">
              <span>{field.validation?.min || 0}</span>
              <span className="fw-bold">{value}</span>
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
        return "col-md-6";
      case 3:
        return "col-lg-4";
      case 4:
        return "col-lg-3";
      default:
        return "col-12";
    }
  };

  // Filter visible fields
  const visibleFields = config.fields.filter(isFieldVisible);

  return (
    <div className={`dynamic-form ${className}`}>
      {config.title && (
        <div className="mb-4">
          <h4 className="mb-2">{config.title}</h4>
          {config.description && (
            <p className="text-muted mb-0">{config.description}</p>
          )}
        </div>
      )}

      {config.showProgress && (
        <div className="mb-4">
          <div className="progress" style={{ height: "6px" }}>
            <div
              className="progress-bar bg-primary"
              style={{
                width: `${
                  (Object.keys(formData).filter((key) => formData[key]).length /
                    visibleFields.length) *
                  100
                }%`,
              }}
            />
          </div>
          <small className="text-muted">
            {Object.keys(formData).filter((key) => formData[key]).length} of{" "}
            {visibleFields.length} fields completed
          </small>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div
          className={`row g-3 ${
            config.layout === "inline" ? "align-items-end" : ""
          }`}
        >
          {config.fields.map((field) => {
            if (!isFieldVisible(field)) return null;

            const fieldError = localErrors[field.name] || errors[field.name];

            return (
              <div key={field.name} className={getColumnClass()}>
                {field.type !== "hidden" && field.type !== "checkbox" && (
                  <label
                    htmlFor={field.name}
                    className="form-label d-flex align-items-center"
                  >
                    {field.icon && <span className="me-2">{field.icon}</span>}
                    {field.label}
                    {field.validation?.required && (
                      <span className="text-danger ms-1">*</span>
                    )}
                  </label>
                )}

                {renderField(field)}

                {fieldError && (
                  <div className="invalid-feedback d-block">{fieldError}</div>
                )}

                {field.description && field.type !== "checkbox" && (
                  <div className="form-text">{field.description}</div>
                )}
              </div>
            );
          })}
        </div>

        <div className="row mt-4">
          <div className="col-12">
            <div className="d-flex gap-3 justify-content-end">
              {onCancel && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  <FaTimes className="me-1" />
                  {config.cancelText || "Cancel"}
                </button>
              )}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting || loading}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="spinner-border spinner-border-sm me-2" />
                    Submitting...
                  </>
                ) : (
                  config.submitText || "Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
