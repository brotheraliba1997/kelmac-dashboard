"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import DynamicForm, {
  DynamicFormConfig,
  FieldType,
} from "../shared/DynamicForm";
import {
  FaBook,
  FaUser,
  FaTag,
  FaDollarSign,
  FaCalendar,
  FaClock,
  FaVideo,
  FaImage,
  FaGlobe,
  FaQuestionCircle,
  FaPlus,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";
import { useGetUsersQuery } from "../../redux/services/userApi";
import { useGetLocationsQuery } from "../../redux/services/locationApi";
import SearchableSelect from "../shared/SearchableSelect";
import {
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useGetCourseByIdQuery,
} from "../../redux/services/courseApi";
import { useGetCategoriesQuery } from "../../redux/services/categoryApi";

// ===== TYPES =====
export interface Course {
  id?: string;
  title: string;
  slug?: string;
  subtitle?: string;
  description: string;
  instructor: string;
  overview?: string;
  thumbnailUrl?: string;
  previewVideoUrl?: string;
  category: string;
  subcategories: string[];
  topics: string[];
  skillLevel: SkillLevelEnum;
  language: string;
  captionsLanguage?: string;
  certificate: boolean;
  lifetimeAccess: boolean;
  mobileAccess: boolean;
  price: number;
  discountedPrice?: number;
  discountPercentage?: number;
  currency: CurrencyEnum;
  whatYouWillLearn: string[];
  requirements: string[];
  targetAudience: string[];
  features: string[];
  faqs: FAQ[];
  sessions: Session[];
  isPublished: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  isNew: boolean;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Session {
  id?: string;
  seatsLeft: number;
  instructor: string;
  order?: number;
  location?: string; // now always an id or value from select
  mode: SessionModeEnum;
  type: SessionTypeEnum;
  timeBlocks: TimeBlock[];
}

export interface TimeBlock {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  timeZone: string;
}

export enum SessionTypeEnum {
  FULL_WEEK = "Full Week",
  SPLIT_WEEK = "Split Week",
  WEEKEND = "Weekend",
  EVENING = "Evening",
}
export enum SessionModeEnum {
  ONLINE = "online",
  IN_PERSON = "in-person",
}

export enum SkillLevelEnum {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate",
  ADVANCED = "Advanced",
  ALL_LEVELS = "All Levels",
}

export enum CurrencyEnum {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  INR = "INR",
}

interface DynamicCourseFormProps {
  mode?: "create" | "edit";
  courseId?: string;
}

// ===== VALIDATION UTILITIES =====
const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

const processArrayField = (data: string | string[]): string[] => {
  if (Array.isArray(data)) return data;
  if (typeof data === "string") {
    return data
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }
  return [];
};

const validatePrice = (price: any): string | null => {
  if (price === undefined || price === null || price === "") {
    return "Price is required";
  }
  const numPrice = Number(price);
  if (isNaN(numPrice)) {
    return "Price must be a valid number";
  }
  if (numPrice < 0) {
    return "Price must not be less than 0";
  }
  return null;
};

const validateDiscountedPrice = (
  discountedPrice: any,
  price: number
): string | null => {
  if (!discountedPrice) return null; // Optional field

  const numDiscountedPrice = Number(discountedPrice);
  if (isNaN(numDiscountedPrice)) {
    return "Discounted price must be a valid number";
  }
  if (numDiscountedPrice < 0) {
    return "Discounted price must not be less than 0";
  }
  if (numDiscountedPrice > price) {
    return "Discounted price must not be greater than regular price";
  }
  return null;
};

const validateDiscountPercentage = (discountPercentage: any): string | null => {
  if (!discountPercentage) return null; // Optional field

  const numDiscountPercentage = Number(discountPercentage);
  if (isNaN(numDiscountPercentage)) {
    return "Discount percentage must be a valid number";
  }
  if (numDiscountPercentage < 0) {
    return "Discount percentage must not be less than 0";
  }
  if (numDiscountPercentage > 100) {
    return "Discount percentage must not be greater than 100";
  }
  return null;
};

const validateFormData = (
  data: Record<string, any>,
  faqs: FAQ[],
  sessions: Session[]
): string[] => {
  const errors: string[] = [];

  // Required fields validation
  if (!data.title?.trim()) errors.push("Course title is required");
  if (!data.description?.trim()) errors.push("Course description is required");
  // Instructor validation removed as per requirements
  if (!data.category || !isValidObjectId(data.category)) {
    errors.push("Valid category must be selected");
  }
  if (!data.whatYouWillLearn?.trim()) {
    errors.push("Learning objectives are required");
  }

  // Price validation
  const priceError = validatePrice(data.price);
  if (priceError) errors.push(priceError);

  // Discounted price validation
  const discountedPriceError = validateDiscountedPrice(
    data.discountedPrice,
    Number(data.price)
  );
  if (discountedPriceError) errors.push(discountedPriceError);

  // Discount percentage validation
  const discountPercentageError = validateDiscountPercentage(
    data.discountPercentage
  );
  if (discountPercentageError) errors.push(discountPercentageError);

  // Array fields validation
  if (
    data.subcategories &&
    !Array.isArray(processArrayField(data.subcategories))
  ) {
    errors.push("Subcategories must be an array");
  }
  if (data.topics && !Array.isArray(processArrayField(data.topics))) {
    errors.push("Topics must be an array");
  }

  // FAQ validation
  const validFaqs = faqs.filter(
    (faq) => faq.question?.trim() && faq.answer?.trim()
  );
  if (faqs.length > 0 && validFaqs.length === 0) {
    errors.push(
      "If adding FAQs, at least one complete FAQ (question and answer) is required"
    );
  }

  // Sessions validation
  sessions.forEach((session, index) => {
    if (
      !Object.values(SessionTypeEnum).includes(session.type as SessionTypeEnum)
    ) {
      errors.push(
        `Session ${index + 1}: Type must be one of: ${Object.values(
          SessionTypeEnum
        ).join(", ")}`
      );
    }
  });

  return errors;
};

// ===== FORM COMPONENTS =====
const FaqForm = React.memo<{
  initialData?: FAQ;
  onSave: (data: FAQ) => void;
  onCancel: () => void;
}>(({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<FAQ>({
    question: initialData?.question || "",
    answer: initialData?.answer || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.question.trim()) newErrors.question = "Question is required";
    if (!formData.answer.trim()) newErrors.answer = "Answer is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="question"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Question <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.question ? "border-red-500" : "border-gray-300"
          }`}
          id="question"
          name="question"
          value={formData.question}
          onChange={handleChange}
          placeholder="Enter the question"
        />
        {errors.question && (
          <p className="mt-1 text-sm text-red-600">{errors.question}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="answer"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Answer <span className="text-red-500">*</span>
        </label>
        <textarea
          className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.answer ? "border-red-500" : "border-gray-300"
          }`}
          id="answer"
          name="answer"
          rows={4}
          value={formData.answer}
          onChange={handleChange}
          placeholder="Enter the answer"
        />
        {errors.answer && (
          <p className="mt-1 text-sm text-red-600">{errors.answer}</p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={onCancel}
        >
          <FaTimes className="w-4 h-4 mr-2" />
          Previous
        </button>
        <button
          type="submit"
          className="flex-1 px-6 py-2.5 text-sm font-semibold text-white bg-secondary rounded-lg hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:ring-offset-2 transition-all duration-200"
        >
          {initialData ? "Update FAQ" : "Add FAQ"}
        </button>
      </div>
    </form>
  );
});

FaqForm.displayName = "FaqForm";

const TimeBlockForm = React.memo<{
  initialData?: TimeBlock;
  onSave: (data: TimeBlock) => void;
  onCancel: () => void;
}>(({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<TimeBlock>({
    ...DEFAULT_TIME_BLOCK,
    ...initialData,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            End Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="startTime"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Start Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label
            htmlFor="endTime"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            End Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            id="endTime"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="timeZone"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Time Zone <span className="text-red-500">*</span>
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          id="timeZone"
          name="timeZone"
          value={formData.timeZone}
          onChange={handleChange}
          required
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={onCancel}
        >
          <FaTimes className="w-4 h-4 mr-2" />
          Previous
        </button>
        <button
          type="submit"
          className="flex-1 px-6 py-2.5 text-sm font-semibold text-white bg-secondary rounded-lg hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:ring-offset-2 transition-all duration-200"
        >
          {initialData ? "Update Time Block" : "Add Time Block"}
        </button>
      </div>
    </form>
  );
});

TimeBlockForm.displayName = "TimeBlockForm";

const SessionForm = React.memo<{
  initialData?: Session;
  onSave: (data: Session) => void;
  onCancel: () => void;
}>(({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Session>({
    seatsLeft: initialData?.seatsLeft ?? 1,
    instructor: initialData?.instructor || "",
    mode: initialData?.mode || SessionModeEnum.ONLINE,
    type: initialData?.type || SessionTypeEnum.FULL_WEEK,
    timeBlocks: initialData?.timeBlocks || [],
    order: initialData?.order || 0,
    location: initialData?.location || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showTimeBlockForm, setShowTimeBlockForm] = useState(false);
  const [editingTimeBlockIndex, setEditingTimeBlockIndex] = useState<
    number | null
  >(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const finalValue = type === "number" ? Number(value) : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Removed title and description validation
    const seatsValue = Number(formData.seatsLeft);
    if (Number.isNaN(seatsValue)) {
      newErrors.seatsLeft = "Seats available is required";
    } else if (seatsValue <= 0) {
      newErrors.seatsLeft = "Seats available must be greater than 0";
    }
    if (
      !Object.values(SessionTypeEnum).includes(formData.type as SessionTypeEnum)
    ) {
      newErrors.type = `Type must be one of: ${Object.values(
        SessionTypeEnum
      ).join(", ")}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTimeBlockSave = (timeBlock: TimeBlock) => {
    if (editingTimeBlockIndex !== null) {
      const updatedTimeBlocks = [...formData.timeBlocks];
      updatedTimeBlocks[editingTimeBlockIndex] = timeBlock;
      setFormData((prev) => ({ ...prev, timeBlocks: updatedTimeBlocks }));
    } else {
      setFormData((prev) => ({
        ...prev,
        timeBlocks: [...prev.timeBlocks, timeBlock],
      }));
    }
    setShowTimeBlockForm(false);
    setEditingTimeBlockIndex(null);
  };

  const handleTimeBlockEdit = (index: number) => {
    setEditingTimeBlockIndex(index);
    setShowTimeBlockForm(true);
  };

  const handleTimeBlockDelete = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      timeBlocks: prev.timeBlocks.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (formData.timeBlocks.length === 0) {
      toast.error("At least one time block is required");
      return;
    }

    // Validate location: require a MongoDB id if provided
    if (formData.location && !isValidObjectId(String(formData.location))) {
      toast.error(
        "Selected location is missing an id. Please select another location."
      );
      return;
    }

    const sessionData = {
      ...formData,
      location: formData.location || undefined,
      seatsLeft: Number(formData.seatsLeft) || 0,
    };

    onSave(sessionData);
  };

  // Pagination state for location
  const [locationSearch, setLocationSearch] = useState("");
  const [locationPage, setLocationPage] = useState(1);

  // Pagination state for instructor
  const [instructorSearch, setInstructorSearch] = useState("");
  const [instructorPage, setInstructorPage] = useState(1);

  // Fetch instructors (role: 3 = instructor)
  const { data: usersData, isLoading: usersLoading } = useGetUsersQuery({
    role: 3,
    search: instructorSearch,
    page: instructorPage,
    limit: 10,
  });

  const instructorOptions = React.useMemo(() => {
    if (!usersData) return [];
    const data = Array.isArray((usersData as any).data)
      ? (usersData as any).data
      : Array.isArray(usersData)
      ? usersData
      : (usersData as any).users || [];
    return data.map((instructor: any) => ({
      value: instructor.id,
      label: `${instructor.firstName} ${instructor.lastName} (${instructor.email})`,
    }));
  }, [usersData]);

  // Fetch locations
  const { data: locationsData, isLoading: locationsLoading } =
    useGetLocationsQuery({
      search: locationSearch,
      page: locationPage,
      limit: 10,
    });

  const locationOptions = React.useMemo(() => {
    if (!locationsData?.data) return [];
    return locationsData.data.map((loc: any) => ({
      value: loc._id || loc.id || loc.countryCode,
      label: `${loc.country} (${loc.countryCode})${
        loc._id || loc.id ? "" : " — id missing"
      }`,
      disabled: !(loc._id || loc.id),
    }));
  }, [locationsData]);

  const handleLocationSearch = (search: string, page: number) => {
    setLocationSearch(search);
    setLocationPage(page);
  };

  const handleInstructorSearch = (search: string, page: number) => {
    setInstructorSearch(search);
    setInstructorPage(page);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Instructor Select with Search */}
        <SearchableSelect
          label="Instructor"
          value={formData.instructor}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, instructor: String(value) }))
          }
          onSearch={handleInstructorSearch}
          options={instructorOptions}
          placeholder="Search and select instructor..."
          loading={usersLoading}
          hasMore={(usersData as any)?.hasNextPage || false}
          currentPage={(usersData as any)?.currentPage || 1}
          totalPages={(usersData as any)?.totalPages || 1}
          className="mb-4"
        />
        {/* Location Select with Search */}
        <SearchableSelect
          label="Location (Optional)"
          value={formData.location || ""}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              location: String(value) || undefined,
            }))
          }
          onSearch={handleLocationSearch}
          options={locationOptions}
          placeholder="Search and select location..."
          loading={locationsLoading}
          hasMore={locationsData?.hasNextPage || false}
          currentPage={locationsData?.currentPage || 1}
          totalPages={locationsData?.totalPages || 1}
          className="mb-4"
        />

        {/* Mode Select Dropdown */}
        <div>
          <label className="block font-medium mb-1">
            Mode <span className="text-red-500">*</span>
          </label>
          <select
            name="mode"
            value={formData.mode}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            {Object.values(SessionModeEnum).map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="seatsLeft"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Seats Limit <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.seatsLeft ? "border-red-500" : "border-gray-300"
            }`}
            id="seatsLeft"
            name="seatsLeft"
            value={formData.seatsLeft}
            onChange={handleChange}
            min="0"
            required
          />
          {errors.seatsLeft && (
            <p className="mt-1 text-sm text-red-600">{errors.seatsLeft}</p>
          )}
        </div>

        {/* Removed description field */}

        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Session Type <span className="text-red-500">*</span>
          </label>
          <select
            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.type ? "border-red-500" : "border-gray-300"
            }`}
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            {Object.values(SessionTypeEnum).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type}</p>
          )}
        </div>

        {/* Time Blocks Management */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                Time Blocks
              </h4>
              <p className="text-sm text-gray-600">
                Schedule when this session will occur
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:ring-offset-2"
              onClick={() => setShowTimeBlockForm(true)}
            >
              <FaPlus className="w-4 h-4 mr-1" />
              Add Time Block
            </button>
          </div>

          {formData.timeBlocks.length === 0 ? (
            <div className="text-center py-8">
              <FaClock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No time blocks added yet</p>
              <p className="text-gray-400 text-xs mt-1">
                Add at least one time block to schedule this session
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {formData.timeBlocks.map((timeBlock, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Block {index + 1}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">
                            Date:
                          </span>{" "}
                          <span className="text-gray-600">
                            {timeBlock.startDate} to {timeBlock.endDate}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Time:
                          </span>{" "}
                          <span className="text-gray-600">
                            {timeBlock.startTime} - {timeBlock.endTime}
                          </span>
                        </div>
                        <div className="md:col-span-2">
                          <span className="font-medium text-gray-700">
                            Timezone:
                          </span>{" "}
                          <span className="text-gray-600">
                            {timeBlock.timeZone}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-1 ml-4">
                      <button
                        type="button"
                        className="inline-flex items-center p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={() => handleTimeBlockEdit(index)}
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        onClick={() => handleTimeBlockDelete(index)}
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={onCancel}
          >
            <FaTimes className="w-4 h-4 mr-2" />
            Previous
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-2.5 text-sm font-semibold text-white bg-secondary rounded-lg hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:ring-offset-2 transition-all duration-200"
          >
            {initialData ? "Update Session" : "Add Session"}
          </button>
        </div>
      </form>

      {/* Time Block Form Modal */}
      {showTimeBlockForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingTimeBlockIndex !== null
                  ? "Edit Time Block"
                  : "Add Time Block"}
              </h3>
            </div>
            <div className="p-6">
              <TimeBlockForm
                initialData={
                  editingTimeBlockIndex !== null
                    ? formData.timeBlocks[editingTimeBlockIndex]
                    : undefined
                }
                onSave={handleTimeBlockSave}
                onCancel={() => {
                  setShowTimeBlockForm(false);
                  setEditingTimeBlockIndex(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

SessionForm.displayName = "SessionForm";

// ===== CONSTANTS =====
const TIMEZONES = [
  "Eastern Time (GMT-5)",
  "Central Time (GMT-6)",
  "Pacific Time (GMT-8)",
  "GMT",
  "UTC",
];

const DEFAULT_TIME_BLOCK: TimeBlock = {
  startDate: "",
  endDate: "",
  startTime: "09:00",
  endTime: "16:00",
  timeZone: "Eastern Time (GMT-5)",
};

// ===== STEP PROGRESS COMPONENT =====
const StepProgress = React.memo<{
  currentStep: number;
  totalSteps: number;
  steps: { number: number; title: string; icon: React.ReactNode }[];
}>(({ currentStep, totalSteps, steps }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Course {currentStep === totalSteps ? "Details" : "Creation"}
        </h2>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      <div className="relative">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200">
          <div
            className="absolute top-0 left-0 h-0.5 bg-primary-600 transition-all duration-300"
            style={{
              width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
            }}
          />
        </div>

        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;

            return (
              <div key={step.number} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isCompleted
                      ? "bg-primary-600 border-primary-600 text-white"
                      : isCurrent
                      ? "border-primary-600 bg-white text-primary-600"
                      : "border-gray-300 bg-white text-gray-400"
                  }`}
                >
                  {isCompleted ? (
                    <FaCheckCircle className="w-4 h-4" />
                  ) : (
                    step.icon
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium text-center max-w-20 ${
                    isCurrent ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

StepProgress.displayName = "StepProgress";

// ===== MAIN COMPONENT =====
export default function DynamicCourseForm({
  mode = "create",
  courseId,
}: DynamicCourseFormProps) {
  const router = useRouter();
  const isEditMode = mode === "edit";

  const totalSteps = 7;
  const formStorageKey = `course_form_${mode}_${courseId || "new"}`;

  const [currentStep, setCurrentStep] = useState(1);
  const [accumulatedFormData, setAccumulatedFormData] = useState<
    Record<string, any>
  >(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(formStorageKey);
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  const [sessions, setSessions] = useState<Session[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`${formStorageKey}_sessions`);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [faqs, setFaqs] = useState<FAQ[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`${formStorageKey}_faqs`);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [showFaqForm, setShowFaqForm] = useState(false);
  const [editingSessionIndex, setEditingSessionIndex] = useState<number | null>(
    null
  );
  const [editingFaqIndex, setEditingFaqIndex] = useState<number | null>(null);

  // Progress steps configuration
  const progressSteps = [
    { number: 1, title: "Basic Info", icon: <FaBook className="w-3 h-3" /> },
    { number: 2, title: "Content", icon: <FaImage className="w-3 h-3" /> },
    { number: 3, title: "Metadata", icon: <FaGlobe className="w-3 h-3" /> },
    { number: 4, title: "Pricing", icon: <FaDollarSign className="w-3 h-3" /> },
    { number: 5, title: "FAQ", icon: <FaQuestionCircle className="w-3 h-3" /> },
    { number: 6, title: "Sessions", icon: <FaClock className="w-3 h-3" /> },
    {
      number: 7,
      title: "Details",
      icon: <FaCheckCircle className="w-3 h-3" />,
    },
  ];

  // API hooks
  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();

  // Fetch course data for edit mode
  const {
    data: courseData,
    error: courseError,
    isLoading: courseLoading,
  } = useGetCourseByIdQuery(courseId as string, {
    skip: !isEditMode || !courseId,
  });

  // Fetch categories (only needed for form options)
  const { data: categoriesData } = useGetCategoriesQuery({ isActive: true });

  // Process data for forms
  const categories = useMemo(() => {
    if (!categoriesData) return [];
    return Array.isArray(categoriesData)
      ? categoriesData
      : (categoriesData as any)?.data ||
          (categoriesData as any)?.categories ||
          [];
  }, [categoriesData]);

  // Memoize empty instructor options to avoid recreating on every render
  const emptyInstructorOptions = useMemo(
    () => [{ value: "", label: "-- Select an Instructor --", disabled: true }],
    []
  );

  const categoryOptions = useMemo(
    () =>
      categories.map((category: any) => ({
        value: category.id || category._id || category.slug,
        label: category.name || category.title,
      })),
    [categories]
  );

  // Initialize form data for edit mode
  const processedCourseData = useMemo(() => {
    if (!isEditMode || !courseData) return {} as Record<string, any>;
    const course = courseData as any;

    return {
      title: course?.title || "",
      slug: course?.slug || "",
      subtitle: course?.subtitle || "",
      description: course?.description || "",
      // instructor: course?.instructor?.id || course?.instructor,
      overview: course?.overview || "",
      thumbnailUrl: course?.thumbnailUrl || "",
      previewVideoUrl: course?.previewVideoUrl || "",
      category: course?.category?.id || course?.category || "",
      subcategories: course?.subcategories || [],
      topics: course?.topics || [],
      skillLevel: course?.snapshot?.skillLevel || SkillLevelEnum.ALL_LEVELS,
      language: course?.snapshot?.language || "English",
      captionsLanguage: course?.snapshot?.captionsLanguage || "",
      certificate: course?.snapshot?.certificate !== false,
      lifetimeAccess: course?.snapshot?.lifetimeAccess !== false,
      mobileAccess: course?.snapshot?.mobileAccess !== false,
      price: course?.price || 0,
      discountedPrice: course?.discountedPrice || "",
      discountPercentage: course?.discountPercentage || "",
      currency: course?.currency || CurrencyEnum.USD,
      whatYouWillLearn: course?.details?.whatYouWillLearn?.join("\n") || "",
      requirements: course?.details?.requirements?.join("\n") || "",
      targetAudience: course?.details?.targetAudience?.join("\n") || "",
      features: course?.details?.features?.join("\n") || "",
      isPublished: course?.isPublished || false,
      isFeatured: course?.isFeatured || false,
      isBestseller: course?.isBestseller || false,
      isNew: course?.isNew || false,
    };
  }, [isEditMode, courseData]);

  // Initialize sessions and FAQs from course data
  useEffect(() => {
    if (isEditMode && courseData) {
      const course = courseData as any;
      if (course?.sessions)
        setSessions(
          course.sessions.map((s: any, index: number) => ({
            ...s,
            instructor: s.instructor?.id || s.instructor,
            location: s.location?.id || s.location,
          }))
        );
      if (course?.faqs) setFaqs(course.faqs);
    }
  }, [isEditMode, courseData]);

  // Persist form data to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(formStorageKey, JSON.stringify(accumulatedFormData));
    }
  }, [accumulatedFormData, formStorageKey]);

  // Persist sessions to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        `${formStorageKey}_sessions`,
        JSON.stringify(sessions)
      );
    }
  }, [sessions, formStorageKey]);

  // Persist FAQs to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`${formStorageKey}_faqs`, JSON.stringify(faqs));
    }
  }, [faqs, formStorageKey]);

  // Session management
  const handleSessionSave = useCallback(
    (sessionData: Session) => {
      setSessions((prevSessions) => {
        if (editingSessionIndex !== null) {
          const updatedSessions = [...prevSessions];
          updatedSessions[editingSessionIndex] = {
            ...sessionData,
            order: editingSessionIndex,
          };
          return updatedSessions;
        } else {
          return [
            ...prevSessions,
            { ...sessionData, order: prevSessions.length },
          ];
        }
      });
      setShowSessionForm(false);
      setEditingSessionIndex(null);
    },
    [editingSessionIndex]
  );

  const handleSessionEdit = useCallback((index: number) => {
    setEditingSessionIndex(index);
    setShowSessionForm(true);
  }, []);

  const handleSessionDelete = useCallback((index: number) => {
    if (confirm("Are you sure you want to delete this session?")) {
      setSessions((prev) => prev.filter((_, i) => i !== index));
    }
  }, []);

  // FAQ management
  const handleFaqSave = useCallback(
    (faqData: FAQ) => {
      setFaqs((prevFaqs) => {
        if (editingFaqIndex !== null) {
          const updatedFaqs = [...prevFaqs];
          updatedFaqs[editingFaqIndex] = faqData;
          return updatedFaqs;
        } else {
          return [...prevFaqs, faqData];
        }
      });
      setShowFaqForm(false);
      setEditingFaqIndex(null);
    },
    [editingFaqIndex]
  );

  const handleFaqEdit = useCallback((index: number) => {
    setEditingFaqIndex(index);
    setShowFaqForm(true);
  }, []);

  const handleFaqDelete = useCallback((index: number) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      setFaqs((prev) => prev.filter((_, i) => i !== index));
    }
  }, []);

  // Form configuration with validation
  const getFormConfig = (step: number): DynamicFormConfig => {
    const baseConfig = {
      layout: "vertical" as const,
      columns: 2,
      showProgress: !isEditMode,
    };

    const stepConfigs = {
      1: {
        ...baseConfig,
        title: "Course Basic Information",
        description: "Enter the fundamental details about your course",
        submitText: "Next: Content & Media",
        cancelText: "Cancel",
        fields: [
          {
            name: "title",
            label: "Course Title",
            type: "text" as FieldType,
            validation: { required: true },
            icon: <FaBook />,
          },
          {
            name: "slug",
            label: "Course Slug",
            type: "text" as FieldType,
            description: "URL-friendly version (auto-generated if empty)",
          },
          {
            name: "subtitle",
            label: "Subtitle",
            type: "text" as FieldType,
            description: "Brief description that appears in listings",
          },
          {
            name: "category",
            label: "Category",
            type: "select" as FieldType,
            validation: { required: true },
            options: categoryOptions,
            icon: <FaTag />,
          },
          {
            name: "description",
            label: "Course Description",
            type: "textarea" as FieldType,
            validation: { required: true },
            description: "Detailed overview of what students will learn",
          },
        ],
      },
      2: {
        ...baseConfig,
        title: "Course Content & Media",
        description: "Add engaging media and content details",
        submitText: "Next: Metadata",
        cancelText: "Previous",
        fields: [
          {
            name: "overview",
            label: "Course Overview",
            type: "textarea" as FieldType,
            description: "Comprehensive overview of course content",
          },
          {
            name: "thumbnailUrl",
            label: "Thumbnail URL",
            type: "text" as FieldType,
            icon: <FaImage />,
            description: "Course preview image",
          },
          {
            name: "previewVideoUrl",
            label: "Preview Video URL",
            type: "text" as FieldType,
            icon: <FaVideo />,
            description: "Course introduction video",
          },
          {
            name: "subcategories",
            label: "Subcategories",
            type: "text" as FieldType,
            description: "Comma-separated subcategories",
            validation: {
              custom: (value: string) => {
                if (value && !Array.isArray(processArrayField(value))) {
                  return "Subcategories must be an array";
                }
                return null;
              },
            },
          },
          {
            name: "topics",
            label: "Course Topics",
            type: "text" as FieldType,
            description: "Comma-separated topics covered",
            validation: {
              custom: (value: string) => {
                if (value && !Array.isArray(processArrayField(value))) {
                  return "Topics must be an array";
                }
                return null;
              },
            },
          },
        ],
      },
      3: {
        ...baseConfig,
        title: "Course Metadata",
        description: "Set course requirements and accessibility",
        submitText: "Next: Pricing",
        cancelText: "Previous",
        fields: [
          {
            name: "skillLevel",
            label: "Skill Level",
            type: "select" as FieldType,
            validation: { required: true },
            options: Object.values(SkillLevelEnum).map((level) => ({
              value: level,
              label: level,
            })),
          },
          {
            name: "language",
            label: "Course Language",
            type: "text" as FieldType,
            validation: { required: true },
            icon: <FaGlobe />,
          },
          {
            name: "captionsLanguage",
            label: "Captions Language",
            type: "text" as FieldType,
          },
          {
            name: "certificate",
            label: "Certificate Available",
            type: "checkbox" as FieldType,
            defaultValue: true,
          },
          {
            name: "lifetimeAccess",
            label: "Lifetime Access",
            type: "checkbox" as FieldType,
            defaultValue: true,
          },
          {
            name: "mobileAccess",
            label: "Mobile Access",
            type: "checkbox" as FieldType,
            defaultValue: true,
          },
        ],
      },
      4: {
        ...baseConfig,
        title: "Pricing & Publication",
        description: "Set pricing and publication settings",
        submitText: "Next: FAQ",
        cancelText: "Previous",
        fields: [
          {
            name: "price",
            label: "Course Price",
            type: "number" as FieldType,
            validation: {
              required: true,
              custom: validatePrice,
            },
            icon: <FaDollarSign />,
            description: "Must be a number greater than or equal to 0",
          },
          {
            name: "currency",
            label: "Currency",
            type: "select" as FieldType,
            validation: { required: true },
            options: Object.values(CurrencyEnum).map((currency) => ({
              value: currency,
              label: currency,
            })),
          },
          {
            name: "discountedPrice",
            label: "Discounted Price",
            type: "number" as FieldType,
            validation: {
              custom: (value: any, formData: any) =>
                validateDiscountedPrice(value, Number(formData.price)),
            },
            description: "Must be less than or equal to regular price",
          },
          {
            name: "discountPercentage",
            label: "Discount Percentage",
            type: "number" as FieldType,
            validation: {
              custom: validateDiscountPercentage,
            },
            description: "Must be between 0 and 100",
          },
          {
            name: "isPublished",
            label: "Publish Course",
            type: "checkbox" as FieldType,
          },
          {
            name: "isFeatured",
            label: "Featured Course",
            type: "checkbox" as FieldType,
          },
          {
            name: "isBestseller",
            label: "Bestseller",
            type: "checkbox" as FieldType,
          },
          {
            name: "isNew",
            label: "New Course",
            type: "checkbox" as FieldType,
          },
        ],
      },
      5: {
        ...baseConfig,
        title: "FAQ Management",
        description: "Add frequently asked questions",
        submitText: "Next: Sessions",
        cancelText: "Previous",
        fields: [
          {
            name: "faqManagement",
            label: "Frequently Asked Questions",
            type: "text" as FieldType,
          },
        ],
      },
      6: {
        ...baseConfig,
        title: "Course Sessions",
        description: "Structure your course with sessions and schedules",
        submitText: "Next: Final Details",
        cancelText: "Previous",
        fields: [
          {
            name: "sessionManagement",
            label: "Course Sessions",
            type: "text" as FieldType,
          },
        ],
      },
      7: {
        ...baseConfig,
        title: "Course Details",
        description: "Finalize learning objectives and requirements",
        submitText: isEditMode ? "Update Course" : "Create Course",
        cancelText: "Previous",
        fields: [
          {
            name: "whatYouWillLearn",
            label: "What You Will Learn",
            type: "textarea" as FieldType,
            validation: { required: true },
            description: "One learning objective per line",
          },
          {
            name: "requirements",
            label: "Requirements",
            type: "textarea" as FieldType,
            description: "One requirement per line",
          },
          {
            name: "targetAudience",
            label: "Target Audience",
            type: "textarea" as FieldType,
            description: "One audience segment per line",
          },
          {
            name: "features",
            label: "Course Features",
            type: "textarea" as FieldType,
            description: "One feature per line",
          },
        ],
      },
    };

    return (
      stepConfigs[step as keyof typeof stepConfigs] ?? {
        fields: [],
        title: "",
        description: "",
        submitText: "",
        cancelText: "",
        layout: "vertical",
        columns: 2,
        showProgress: false,
        groupFields: false,
      }
    );
  };

  // Form submission with comprehensive validation
  const handleSubmit = useCallback(
    async (data: Record<string, any>) => {
      // Validate all form data before submission
      const validationErrors = validateFormData(data, faqs, sessions);

      if (validationErrors.length > 0) {
        const errorMessage =
          "Please fix the following errors:\n" + validationErrors.join("\n");
        toast.error(errorMessage);
        return;
      }

      try {
        const processedData = {
          ...data,
          // Process array fields
          subcategories: processArrayField(data.subcategories || []),
          topics: processArrayField(data.topics || []),

          snapshot: {
            skillLevel: data.skillLevel,
            language: data.language,
            captionsLanguage: data.captionsLanguage,
            certificate: data.certificate !== false,
            lifetimeAccess: data.lifetimeAccess !== false,
            mobileAccess: data.mobileAccess !== false,
          },
          details: {
            whatYouWillLearn:
              data.whatYouWillLearn
                ?.split("\n")
                .filter((s: string) => s.trim()) || [],
            requirements:
              data.requirements?.split("\n").filter((s: string) => s.trim()) ||
              [],
            targetAudience:
              data.targetAudience
                ?.split("\n")
                .filter((s: string) => s.trim()) || [],
            features:
              data.features?.split("\n").filter((s: string) => s.trim()) || [],
          },
          faqs: faqs.filter(
            (faq) => faq.question?.trim() && faq.answer?.trim()
          ),
          sessions,

          // Ensure numeric fields are properly formatted
          price: Number(data.price) || 0,
          discountedPrice: data.discountedPrice
            ? Number(data.discountedPrice)
            : undefined,
          discountPercentage: data.discountPercentage
            ? Number(data.discountPercentage)
            : undefined,
        };

        if (isEditMode && courseId) {
          await updateCourse({ id: courseId, data: processedData }).unwrap();
          toast.success("Course updated successfully!");
        } else {
          await createCourse(processedData).unwrap();
          toast.success("Course created successfully!");
        }

        // Clear form data from localStorage on success
        if (typeof window !== "undefined") {
          localStorage.removeItem(formStorageKey);
          localStorage.removeItem(`${formStorageKey}_sessions`);
          localStorage.removeItem(`${formStorageKey}_faqs`);
        }

        router.push("/dashboard/courses");
      } catch (error: any) {
        const errorMessage =
          error?.data?.message ||
          error?.message ||
          `Failed to ${isEditMode ? "update" : "create"} course.`;
        toast.error(errorMessage);
      }
    },
    [
      faqs,
      sessions,
      isEditMode,
      courseId,
      formStorageKey,
      updateCourse,
      createCourse,
      router,
    ]
  );

  const handleStepSubmit = useCallback(
    (data: Record<string, any>) => {
      const updatedFormData = { ...accumulatedFormData, ...data };
      setAccumulatedFormData(updatedFormData);

      if (currentStep === totalSteps) {
        handleSubmit(updatedFormData);
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    },
    [accumulatedFormData, currentStep, totalSteps, handleSubmit]
  );

  const handleCancel = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      // Warn before losing data
      const hasData =
        Object.keys(accumulatedFormData).length > 0 ||
        sessions.length > 0 ||
        faqs.length > 0;
      if (hasData) {
        if (
          confirm("You have unsaved changes. Are you sure you want to go back?")
        ) {
          if (typeof window !== "undefined") {
            localStorage.removeItem(formStorageKey);
            localStorage.removeItem(`${formStorageKey}_sessions`);
            localStorage.removeItem(`${formStorageKey}_faqs`);
          }
          router.back();
        }
      } else {
        router.back();
      }
    }
  }, [
    currentStep,
    router,
    accumulatedFormData,
    sessions,
    faqs,
    formStorageKey,
  ]);

  // Loading state
  if (courseLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Header */}
        <StepProgress
          currentStep={currentStep}
          totalSteps={totalSteps}
          steps={progressSteps}
        />

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* FAQ Management Step */}
          {currentStep === 5 && (
            <div className="p-6">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                    <FaQuestionCircle className="w-6 h-6 text-blue-600 mr-3" />
                    FAQ Management
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Create helpful questions and answers for your course
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-white bg-secondary rounded-lg hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:ring-offset-2 transition-all duration-200"
                  onClick={() => setShowFaqForm(true)}
                >
                  <FaPlus className="w-4 h-4 mr-2" />
                  Add FAQ
                </button>
              </div>

              {faqs.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <FaQuestionCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    No FAQs added yet
                  </h4>
                  <p className="text-gray-500 mb-4">
                    Help students by adding frequently asked questions
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-white bg-secondary rounded-lg hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:ring-offset-2 transition-all duration-200"
                    onClick={() => setShowFaqForm(true)}
                  >
                    <FaPlus className="w-4 h-4 mr-2" />
                    Create Your First FAQ
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg border border-gray-200 p-6"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-start space-x-3">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-medium shrink-0 mt-0.5">
                              Q
                            </span>
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                {faq.question}
                              </h4>
                              <div className="flex items-start space-x-3">
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 text-sm font-medium shrink-0">
                                  A
                                </span>
                                <p className="text-gray-700 leading-relaxed">
                                  {faq.answer}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            type="button"
                            className="inline-flex items-center p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={() => handleFaqEdit(index)}
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                            onClick={() => handleFaqDelete(index)}
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showFaqForm && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-gray-200">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {editingFaqIndex !== null ? "Edit FAQ" : "Add New FAQ"}
                      </h3>
                    </div>
                    <div className="p-6">
                      <FaqForm
                        initialData={
                          editingFaqIndex !== null
                            ? faqs[editingFaqIndex]
                            : undefined
                        }
                        onSave={handleFaqSave}
                        onCancel={() => {
                          setShowFaqForm(false);
                          setEditingFaqIndex(null);
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={handleCancel}
                >
                  <FaTimes className="w-4 h-4 mr-2" />
                  Previous
                </button>
                <button
                  type="button"
                  className="flex-1 px-6 py-2.5 text-sm font-semibold text-white bg-secondary rounded-lg hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:ring-offset-2 transition-all duration-200"
                  onClick={() => handleStepSubmit({})}
                >
                  Next: Sessions
                </button>
              </div>
            </div>
          )}

          {/* Sessions Management Step */}
          {currentStep === 6 && (
            <div className="p-6">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                    <FaClock className="w-6 h-6 text-blue-600 mr-3" />
                    Course Sessions ({sessions.length})
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Structure your course content with organized sessions and
                    schedules
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-white bg-secondary rounded-lg hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:ring-offset-2 transition-all duration-200"
                  onClick={() => setShowSessionForm(true)}
                >
                  <FaPlus className="w-4 h-4 mr-2" />
                  Add Session
                </button>
              </div>

              {sessions.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <FaClock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    No sessions created yet
                  </h4>
                  <p className="text-gray-500 mb-4">
                    Start building your course by adding structured learning
                    sessions
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={() => setShowSessionForm(true)}
                  >
                    <FaPlus className="w-4 h-4 mr-2" />
                    Create Your First Session
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {sessions.map((session, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                Session {index + 1}
                              </span>
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 capitalize">
                                {session.type}
                              </span>
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                {session.seatsLeft} seats
                              </span>
                            </div>
                            <h4 className="text-xl font-semibold text-gray-900 mb-2">
                              {/* Removed session.title (no longer exists) */}
                            </h4>
                            <p className="text-gray-600 mb-4">
                              {/* Removed session.description (no longer exists) */}
                            </p>

                            {session.timeBlocks.length > 0 && (
                              <div className="mt-4">
                                <h5 className="text-sm font-medium text-gray-700 mb-2">
                                  Schedule:
                                </h5>
                                <div className="grid gap-2">
                                  {session.timeBlocks.map(
                                    (timeBlock, blockIndex) => (
                                      <div
                                        key={blockIndex}
                                        className="flex items-center space-x-4 text-sm text-gray-600 bg-gray-50 rounded-lg p-3"
                                      >
                                        <FaCalendar className="w-4 h-4 text-gray-400" />
                                        <span>
                                          {timeBlock.startDate} to{" "}
                                          {timeBlock.endDate}
                                        </span>
                                        <FaClock className="w-4 h-4 text-gray-400" />
                                        <span>
                                          {timeBlock.startTime} -{" "}
                                          {timeBlock.endTime}
                                        </span>
                                        <span className="text-gray-500">
                                          ({timeBlock.timeZone})
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              type="button"
                              className="inline-flex items-center p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                              onClick={() => handleSessionEdit(index)}
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                              onClick={() => handleSessionDelete(index)}
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showSessionForm && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-gray-200">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {editingSessionIndex !== null
                          ? "Edit Session"
                          : "Add New Session"}
                      </h3>
                    </div>
                    <div className="p-6">
                      <SessionForm
                        initialData={
                          editingSessionIndex !== null
                            ? sessions[editingSessionIndex]
                            : undefined
                        }
                        onSave={handleSessionSave}
                        onCancel={() => {
                          setShowSessionForm(false);
                          setEditingSessionIndex(null);
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={handleCancel}
                >
                  <FaTimes className="w-4 h-4 mr-2" />
                  Previous
                </button>
                <button
                  type="button"
                  className="flex-1 px-6 py-2.5 text-sm font-semibold text-white bg-secondary rounded-lg hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:ring-offset-2 transition-all duration-200"
                  onClick={() => handleStepSubmit({})}
                >
                  Next: Final Details
                </button>
              </div>
            </div>
          )}

          {/* Regular Form Steps */}
          {![5, 6].includes(currentStep) && (
            <div className="p-6">
              <DynamicForm
                config={getFormConfig(currentStep)}
                initialData={
                  isEditMode && currentStep === 1
                    ? processedCourseData
                    : accumulatedFormData
                }
                onSubmit={handleStepSubmit}
                onCancel={handleCancel}
                loading={isCreating || isUpdating}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
