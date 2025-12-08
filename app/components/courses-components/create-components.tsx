"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useReducer,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  FaBook,
  FaUser,
  FaTag,
  FaImage,
  FaVideo,
  FaGlobe,
  FaDollarSign,
  FaQuestionCircle,
  FaClock,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
} from "react-icons/fa";

// Redux imports
import {
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useGetCourseByIdQuery,
} from "@/app/redux/services/courseApi";
import { useGetUsersQuery } from "@/app/redux/services/userApi";
import { useGetCategoriesQuery } from "@/app/redux/services/categoryApi";

// Components
import DynamicForm from "@/app/components/shared/DynamicForm";
import { DynamicFormConfig } from "@/app/components/shared/DynamicForm";

// Enums and types
enum SkillLevelEnum {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
  ALL_LEVELS = "ALL_LEVELS",
}

enum CurrencyEnum {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  NGN = "NGN",
}

enum SessionTypeEnum {
  LECTURE = "LECTURE",
  PRACTICAL = "PRACTICAL",
  DISCUSSION = "DISCUSSION",
  WORKSHOP = "WORKSHOP",
  ASSESSMENT = "ASSESSMENT",
  PROJECT = "PROJECT",
}

// Interface definitions
interface Course {
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
  subcategories?: string[];
  topics?: string[];
  price: number;
  discountedPrice?: number;
  discountPercentage?: number;
  currency: CurrencyEnum;
  snapshot: {
    skillLevel: SkillLevelEnum;
    language: string;
    captionsLanguage?: string;
    certificate: boolean;
    lifetimeAccess: boolean;
    mobileAccess: boolean;
  };
  details: {
    whatYouWillLearn: string[];
    requirements: string[];
    targetAudience: string[];
    features: string[];
  };
  faqs?: FAQ[];
  sessions?: Session[];
  isPublished: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  isNew: boolean;
}

interface FAQ {
  question: string;
  answer: string;
}

interface Session {
  title: string;
  description: string;
  duration: number;
  sessionType: SessionTypeEnum;
  dayGroup?: string;
  startTime?: string;
  endTime?: string;
  isFree: boolean;
  materials?: string[];
  objectives?: string[];
  prerequisites?: string[];
}

interface DynamicCourseFormProps {
  mode?: "create" | "edit";
  courseId?: string;
}

// State management interfaces
interface FormState {
  currentStep: number;
  accumulatedFormData: Record<string, any>;
  faqs: FAQ[];
  sessions: Session[];
  showFaqForm: boolean;
  showSessionForm: boolean;
  editingFaqIndex: number | null;
  editingSessionIndex: number | null;
}

type FormAction =
  | { type: "SET_STEP"; payload: number }
  | { type: "ACCUMULATE_DATA"; payload: Record<string, any> }
  | { type: "SET_FAQS"; payload: FAQ[] }
  | { type: "SET_SESSIONS"; payload: Session[] }
  | { type: "ADD_FAQ"; payload: FAQ }
  | { type: "UPDATE_FAQ"; payload: { index: number; faq: FAQ } }
  | { type: "DELETE_FAQ"; payload: number }
  | { type: "ADD_SESSION"; payload: Session }
  | { type: "UPDATE_SESSION"; payload: { index: number; session: Session } }
  | { type: "DELETE_SESSION"; payload: number }
  | { type: "TOGGLE_FAQ_FORM"; payload: boolean }
  | { type: "TOGGLE_SESSION_FORM"; payload: boolean }
  | { type: "SET_EDITING_FAQ"; payload: number | null }
  | { type: "SET_EDITING_SESSION"; payload: number | null }
  | { type: "RESET_FORM" };

// Initial state
const initialFormState: FormState = {
  currentStep: 1,
  accumulatedFormData: {},
  faqs: [],
  sessions: [],
  showFaqForm: false,
  showSessionForm: false,
  editingFaqIndex: null,
  editingSessionIndex: null,
};

// Reducer function
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.payload };

    case "ACCUMULATE_DATA":
      return {
        ...state,
        accumulatedFormData: {
          ...state.accumulatedFormData,
          ...action.payload,
        },
      };

    case "SET_FAQS":
      return { ...state, faqs: action.payload };

    case "SET_SESSIONS":
      return { ...state, sessions: action.payload };

    case "ADD_FAQ":
      return {
        ...state,
        faqs: [...state.faqs, action.payload],
        showFaqForm: false,
        editingFaqIndex: null,
      };

    case "UPDATE_FAQ":
      return {
        ...state,
        faqs: state.faqs.map((faq, index) =>
          index === action.payload.index ? action.payload.faq : faq
        ),
        showFaqForm: false,
        editingFaqIndex: null,
      };

    case "DELETE_FAQ":
      return {
        ...state,
        faqs: state.faqs.filter((_, index) => index !== action.payload),
      };

    case "ADD_SESSION":
      return {
        ...state,
        sessions: [...state.sessions, action.payload],
        showSessionForm: false,
        editingSessionIndex: null,
      };

    case "UPDATE_SESSION":
      return {
        ...state,
        sessions: state.sessions.map((session, index) =>
          index === action.payload.index ? action.payload.session : session
        ),
        showSessionForm: false,
        editingSessionIndex: null,
      };

    case "DELETE_SESSION":
      return {
        ...state,
        sessions: state.sessions.filter((_, index) => index !== action.payload),
      };

    case "TOGGLE_FAQ_FORM":
      return {
        ...state,
        showFaqForm: action.payload,
        editingFaqIndex: action.payload ? state.editingFaqIndex : null,
      };

    case "TOGGLE_SESSION_FORM":
      return {
        ...state,
        showSessionForm: action.payload,
        editingSessionIndex: action.payload ? state.editingSessionIndex : null,
      };

    case "SET_EDITING_FAQ":
      return {
        ...state,
        editingFaqIndex: action.payload,
        showFaqForm: true,
      };

    case "SET_EDITING_SESSION":
      return {
        ...state,
        editingSessionIndex: action.payload,
        showSessionForm: true,
      };

    case "RESET_FORM":
      return initialFormState;

    default:
      return state;
  }
}

// ===== UTILITY FUNCTIONS =====
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

const validateFormData = (
  data: Record<string, any>,
  faqs: FAQ[],
  sessions: Session[]
): string[] => {
  const errors: string[] = [];

  if (!data.title?.trim()) errors.push("Course title is required");
  if (!data.description?.trim()) errors.push("Course description is required");
  if (!data.instructor?.trim() || !isValidObjectId(data.instructor)) {
    errors.push("Valid instructor must be selected");
  }
  if (!data.category?.trim() || !isValidObjectId(data.category)) {
    errors.push("Valid category must be selected");
  }
  if (!data.whatYouWillLearn?.trim()) {
    errors.push("Learning objectives are required");
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
  const validSessions = sessions.filter(
    (session) => session.title?.trim() && session.description?.trim()
  );
  if (sessions.length > 0 && validSessions.length === 0) {
    errors.push(
      "If adding sessions, at least one complete session (title and description) is required"
    );
  }

  return errors;
};

// ===== SUB-COMPONENTS =====
interface FaqFormProps {
  initialData?: FAQ;
  onSave: (data: FAQ) => void;
  onCancel: () => void;
}

const FaqForm: React.FC<FaqFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<FAQ>({
    question: initialData?.question || "",
    answer: initialData?.answer || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [errors]
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.question.trim()) newErrors.question = "Question is required";
    if (!formData.answer.trim()) newErrors.answer = "Answer is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (validateForm()) {
        onSave(formData);
      }
    },
    [formData, validateForm, onSave]
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="question" className="form-label">
          Question <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${errors.question ? "is-invalid" : ""}`}
          id="question"
          name="question"
          value={formData.question}
          onChange={handleChange}
          placeholder="Enter the question"
        />
        {errors.question && (
          <div className="invalid-feedback">{errors.question}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="answer" className="form-label">
          Answer <span className="text-danger">*</span>
        </label>
        <textarea
          className={`form-control ${errors.answer ? "is-invalid" : ""}`}
          id="answer"
          name="answer"
          rows={4}
          value={formData.answer}
          onChange={handleChange}
          placeholder="Enter the answer"
        />
        {errors.answer && (
          <div className="invalid-feedback">{errors.answer}</div>
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
        <button type="submit" className="flex-1 px-6 py-2.5 text-sm font-semibold text-white bg-secondary rounded-lg hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:ring-offset-2 transition-all duration-200">
          {initialData ? "Update FAQ" : "Add FAQ"}
        </button>
      </div>
    </form>
  );
};

interface SessionFormProps {
  initialData?: Session;
  onSave: (data: Session) => void;
  onCancel: () => void;
}

const SessionForm: React.FC<SessionFormProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Session>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    duration: initialData?.duration || 60,
    sessionType: initialData?.sessionType || SessionTypeEnum.LECTURE,
    dayGroup: initialData?.dayGroup || "",
    startTime: initialData?.startTime || "",
    endTime: initialData?.endTime || "",
    isFree: initialData?.isFree || false,
    materials: initialData?.materials || [],
    objectives: initialData?.objectives || [],
    prerequisites: initialData?.prerequisites || [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value, type } = e.target;
      const finalValue =
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
      setFormData((prev) => ({ ...prev, [name]: finalValue }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [errors]
  );

  const handleArrayChange = useCallback(
    (
      field: keyof Pick<Session, "materials" | "objectives" | "prerequisites">,
      value: string
    ) => {
      const items = value.split("\n").filter((item) => item.trim());
      setFormData((prev) => ({ ...prev, [field]: items }));
    },
    []
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Session title is required";
    const duration = Number(formData.duration);
    if (!duration || duration <= 0 || !Number.isInteger(duration)) {
      newErrors.duration = "Duration must be a positive integer greater than 0";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (validateForm()) {
        onSave(formData);
      }
    },
    [formData, validateForm, onSave]
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-8">
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Session Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${errors.title ? "is-invalid" : ""}`}
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter session title"
            />
            {errors.title && (
              <div className="invalid-feedback">{errors.title}</div>
            )}
          </div>
        </div>
        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="sessionType" className="form-label">
              Session Type
            </label>
            <select
              className="form-control"
              id="sessionType"
              name="sessionType"
              value={formData.sessionType}
              onChange={handleChange}
            >
              {Object.values(SessionTypeEnum).map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() +
                    type.slice(1).replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          className="form-control"
          id="description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter session description"
        />
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="duration" className="form-label">
              Duration (minutes) <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              className={`form-control ${errors.duration ? "is-invalid" : ""}`}
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              min="1"
              placeholder="90"
            />
            {errors.duration && (
              <div className="invalid-feedback">{errors.duration}</div>
            )}
          </div>
        </div>
        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="startTime" className="form-label">
              Start Time
            </label>
            <input
              type="time"
              className="form-control"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="endTime" className="form-label">
              End Time
            </label>
            <input
              type="time"
              className="form-control"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="mb-3">
            <label htmlFor="dayGroup" className="form-label">
              Day Group
            </label>
            <input
              type="text"
              className="form-control"
              id="dayGroup"
              name="dayGroup"
              value={formData.dayGroup}
              onChange={handleChange}
              placeholder="e.g., Monday/Wednesday, Weekend, etc."
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="mb-3 pt-4">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="isFree"
                name="isFree"
                checked={formData.isFree}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="isFree">
                Free Session
              </label>
            </div>
          </div>
        </div>
      </div>

      {["objectives", "materials", "prerequisites"].map((field) => (
        <div key={field} className="mb-3">
          <label htmlFor={field} className="form-label">
            {field.charAt(0).toUpperCase() + field.slice(1)}
            <small className="text-muted"> (one per line)</small>
          </label>
          <textarea
            className="form-control"
            id={field}
            rows={2}
            value={
              Array.isArray(formData[field as keyof Session])
                ? (formData[field as keyof Session] as string[]).join("\n")
                : ""
            }
            onChange={(e) =>
              handleArrayChange(
                field as keyof Pick<
                  Session,
                  "materials" | "objectives" | "prerequisites"
                >,
                e.target.value
              )
            }
            placeholder={`Enter ${field} (one per line)`}
          />
        </div>
      ))}

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={onCancel}
        >
          <FaTimes className="w-4 h-4 mr-2" />
          Previous
        </button>
        <button type="submit" className="flex-1 px-6 py-2.5 text-sm font-semibold text-white bg-secondary rounded-lg hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:ring-offset-2 transition-all duration-200">
          {initialData ? "Update Session" : "Add Session"}
        </button>
      </div>
    </form>
  );
};

// ===== MAIN COMPONENT =====
export default function ImprovedDynamicCourseForm({
  mode = "create",
  courseId,
}: DynamicCourseFormProps) {
  const router = useRouter();
  const isEditMode = mode === "edit";
  const totalSteps = 7;

  // State management using useReducer for complex state
  const [state, dispatch] = useReducer(formReducer, initialFormState);

  // API hooks
  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();

  // Data fetching
  const {
    data: courseData,
    error: courseError,
    isLoading: courseLoading,
  } = useGetCourseByIdQuery(courseId as string, {
    skip: !isEditMode || !courseId,
  });

  const {
    data: usersData,
    error: usersError,
    isLoading: usersLoading,
  } = useGetUsersQuery({ role: 3 });

  const {
    data: categoriesData,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useGetCategoriesQuery({ isActive: true });

  // Processed data
  const instructors = useMemo(() => {
    if (!usersData) return [];
    return Array.isArray(usersData)
      ? usersData
      : (usersData as any)?.data || (usersData as any)?.users || [];
  }, [usersData]);

  const categories = useMemo(() => {
    if (!categoriesData) return [];
    return Array.isArray(categoriesData)
      ? categoriesData
      : (categoriesData as any)?.data ||
          (categoriesData as any)?.categories ||
          [];
  }, [categoriesData]);

  const instructorOptions = useMemo(
    () => [
      { value: "", label: "-- Select an Instructor --", disabled: true },
      ...instructors.map((instructor: any) => ({
        value: instructor.id || instructor._id,
        label: `${instructor.firstName || "Unknown"} ${
          instructor.lastName || ""
        } (${instructor.email})`.trim(),
      })),
    ],
    [instructors]
  );

  const categoryOptions = useMemo(
    () =>
      categories.map((category: any) => ({
        value: category.id || category._id || category.slug,
        label: category.name || category.title,
      })),
    [categories]
  );

  const processedCourseData = useMemo(() => {
    if (!isEditMode || !courseData) return {};

    const course = courseData as any;
    return {
      title: course?.title || "",
      slug: course?.slug || "",
      subtitle: course?.subtitle || "",
      description: course?.description || "",
      instructor: course?.instructor?.id || course?.instructor,
      overview: course?.overview || "",
      thumbnailUrl: course?.thumbnailUrl || "",
      previewVideoUrl: course?.previewVideoUrl || "",
      category: course?.category || "",
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

  // Initialize form data in edit mode
  useEffect(() => {
    if (isEditMode && courseData) {
      const course = courseData as any;
      if (course?.sessions) {
        dispatch({ type: "SET_SESSIONS", payload: course.sessions });
      }
      if (course?.faqs) {
        dispatch({ type: "SET_FAQS", payload: course.faqs });
      }
    }
  }, [isEditMode, courseData]);

  // Event handlers
  const handleStepSubmit = useCallback(
    (data: Record<string, any>) => {
      console.log("Step submit data:", data);
      console.log("Current step:", state.currentStep);

      dispatch({ type: "ACCUMULATE_DATA", payload: data });

      if (state.currentStep === totalSteps) {
        handleSubmit({ ...state.accumulatedFormData, ...data });
      } else {
        dispatch({ type: "SET_STEP", payload: state.currentStep + 1 });
      }
    },
    [state.currentStep, state.accumulatedFormData, totalSteps]
  );

  const handleCancel = useCallback(() => {
    if (state.currentStep > 1) {
      dispatch({ type: "SET_STEP", payload: state.currentStep - 1 });
    } else {
      router.back();
    }
  }, [state.currentStep, router]);

  const handleSubmit = useCallback(
    async (data: Record<string, any>) => {
      console.log(
        `${isEditMode ? "Updating" : "Creating"} course with data:`,
        data
      );

      // Validate form data
      const validationErrors = validateFormData(
        data,
        state.faqs,
        state.sessions
      );

      if (validationErrors.length > 0) {
        const errorMessage =
          "Please fix the following errors:\n" + validationErrors.join("\n");
        toast.error(errorMessage);
        console.error("Validation errors:", validationErrors);
        return;
      }

      try {
        // Process the form data
        const processedData = {
          title: data.title.trim(),
          slug:
            data.slug?.trim() ||
            data.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-") ||
            "",
          subtitle: data.subtitle?.trim() || "",
          description: data.description.trim(),
          instructor: data.instructor,
          overview: data.overview?.trim() || "",
          thumbnailUrl: data.thumbnailUrl?.trim() || "",
          previewVideoUrl: data.previewVideoUrl?.trim() || "",
          category: data.category,
          subcategories: processArrayField(data.subcategories),
          topics: processArrayField(data.topics),
          price: Number(data.price) || 0,
          discountedPrice: data.discountedPrice
            ? Number(data.discountedPrice)
            : undefined,
          discountPercentage: data.discountPercentage
            ? Number(data.discountPercentage)
            : undefined,
          currency: data.currency || CurrencyEnum.USD,
          snapshot: {
            skillLevel: data.skillLevel || SkillLevelEnum.ALL_LEVELS,
            language: data.language || "English",
            captionsLanguage: data.captionsLanguage,
            certificate: data.certificate !== false,
            lifetimeAccess: data.lifetimeAccess !== false,
            mobileAccess: data.mobileAccess !== false,
          },
          details: {
            whatYouWillLearn: data.whatYouWillLearn
              ? data.whatYouWillLearn
                  .split("\n")
                  .filter((s: string) => s.trim())
              : [],
            requirements: data.requirements
              ? data.requirements.split("\n").filter((s: string) => s.trim())
              : [],
            targetAudience: data.targetAudience
              ? data.targetAudience.split("\n").filter((s: string) => s.trim())
              : [],
            features: data.features
              ? data.features.split("\n").filter((s: string) => s.trim())
              : [],
          },
          faqs: state.faqs
            .filter((faq) => faq.question?.trim() && faq.answer?.trim())
            .map((faq) => ({
              question: String(faq.question.trim()),
              answer: String(faq.answer.trim()),
            })),
          sessions: state.sessions
            .filter(
              (session) => session.title?.trim() && session.description?.trim()
            )
            .map((session) => ({
              title: String(session.title.trim()),
              description: String(session.description.trim()),
              duration: Number(session.duration) || 0,
              sessionType: session.sessionType || SessionTypeEnum.LECTURE,
              dayGroup: String(session.dayGroup || ""),
              startTime: String(session.startTime || ""),
              endTime: String(session.endTime || ""),
              isFree: Boolean(session.isFree),
              materials: Array.isArray(session.materials)
                ? session.materials
                : [],
              objectives: Array.isArray(session.objectives)
                ? session.objectives
                : [],
              prerequisites: Array.isArray(session.prerequisites)
                ? session.prerequisites
                : [],
            })),
          isPublished: data.isPublished || false,
          isFeatured: data.isFeatured || false,
          isBestseller: data.isBestseller || false,
          isNew: data.isNew || false,
        };

        console.log("Processed data being sent:", processedData);

        if (isEditMode && courseId) {
          await updateCourse({ id: courseId, data: processedData }).unwrap();
          toast.success("Course updated successfully!");
        } else {
          await createCourse(processedData).unwrap();
          toast.success("Course created successfully!");
        }

        router.push("/dashboard/courses");
      } catch (error: any) {
        console.error(
          `Error ${isEditMode ? "updating" : "creating"} course:`,
          error
        );
        const errorMessage =
          error?.data?.message ||
          error?.message ||
          `Failed to ${
            isEditMode ? "update" : "create"
          } course. Please try again.`;
        toast.error(errorMessage);
      }
    },
    [
      isEditMode,
      courseId,
      state.faqs,
      state.sessions,
      createCourse,
      updateCourse,
      router,
    ]
  );

  // Session handlers
  const handleAddSession = useCallback(() => {
    dispatch({ type: "SET_EDITING_SESSION", payload: null });
  }, []);

  const handleEditSession = useCallback((index: number) => {
    dispatch({ type: "SET_EDITING_SESSION", payload: index });
  }, []);

  const handleDeleteSession = useCallback((index: number) => {
    if (confirm("Are you sure you want to delete this session?")) {
      dispatch({ type: "DELETE_SESSION", payload: index });
    }
  }, []);

  const handleSaveSession = useCallback(
    (sessionData: Session) => {
      if (state.editingSessionIndex !== null) {
        dispatch({
          type: "UPDATE_SESSION",
          payload: { index: state.editingSessionIndex, session: sessionData },
        });
      } else {
        dispatch({ type: "ADD_SESSION", payload: sessionData });
      }
    },
    [state.editingSessionIndex]
  );

  // FAQ handlers
  const handleAddFaq = useCallback(() => {
    dispatch({ type: "SET_EDITING_FAQ", payload: null });
  }, []);

  const handleEditFaq = useCallback((index: number) => {
    dispatch({ type: "SET_EDITING_FAQ", payload: index });
  }, []);

  const handleDeleteFaq = useCallback((index: number) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      dispatch({ type: "DELETE_FAQ", payload: index });
    }
  }, []);

  const handleSaveFaq = useCallback(
    (faqData: FAQ) => {
      if (state.editingFaqIndex !== null) {
        dispatch({
          type: "UPDATE_FAQ",
          payload: { index: state.editingFaqIndex, faq: faqData },
        });
      } else {
        dispatch({ type: "ADD_FAQ", payload: faqData });
      }
    },
    [state.editingFaqIndex]
  );

  // Form configuration
  const getFormConfig = useCallback(
    (step: number): DynamicFormConfig => {
      const baseConfig = {
        layout: "vertical" as const,
        columns: 2,
        showProgress: true,
      };

      switch (step) {
        case 1:
          return {
            ...baseConfig,
            title: `${
              isEditMode ? "Edit" : "Create"
            } Course - Basic Information`,
            description: "Enter the basic course information",
            submitText: "Next Step",
            cancelText: "Cancel",
            fields: [
              {
                name: "title",
                label: "Course Title",
                type: "text",
                placeholder: "Enter course title",
                validation: { required: true, maxLength: 200 },
                icon: <FaBook />,
              },
              {
                name: "slug",
                label: "Course Slug",
                type: "text",
                placeholder: "course-slug (auto-generated if empty)",
                validation: { maxLength: 200 },
                description: "URL-friendly version of the title",
              },
              {
                name: "subtitle",
                label: "Subtitle",
                type: "text",
                placeholder: "Brief subtitle for the course",
                validation: { maxLength: 300 },
              },
              {
                name: "instructor",
                label: "Instructor",
                type: "select",
                placeholder: usersLoading
                  ? "Loading instructors..."
                  : instructorOptions.length > 0
                  ? "Select an instructor"
                  : "No instructors available",
                validation: { required: true },
                options: instructorOptions,
                disabled:
                  usersLoading ||
                  !!usersError ||
                  instructorOptions.length === 0,
                icon: <FaUser />,
              },
              {
                name: "category",
                label: "Category",
                type: "select",
                placeholder: categoriesLoading
                  ? "Loading categories..."
                  : "Select course category",
                validation: { required: true },
                options: categoryOptions,
                disabled: categoriesLoading || !!categoriesError,
                icon: <FaTag />,
              },
              {
                name: "description",
                label: "Course Description",
                type: "textarea",
                placeholder: "Detailed description of the course",
                validation: { required: true, maxLength: 2000 },
              },
            ],
          };

        case 2:
          return {
            ...baseConfig,
            title: "Course Content & Media",
            description: "Add course overview, images, and preview video",
            submitText: "Next Step",
            cancelText: "Previous",
            fields: [
              {
                name: "overview",
                label: "Course Overview",
                type: "textarea",
                placeholder: "Comprehensive overview of the course",
                validation: { maxLength: 3000 },
              },
              {
                name: "thumbnailUrl",
                label: "Thumbnail URL",
                type: "url",
                placeholder: "https://example.com/thumbnail.jpg",
                validation: {
                  pattern: /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i,
                },
                description: "Must be a valid image URL (jpg, png, gif, webp)",
                icon: <FaImage />,
              },
              {
                name: "previewVideoUrl",
                label: "Preview Video URL",
                type: "url",
                placeholder: "https://example.com/preview-video.mp4",
                validation: {
                  pattern:
                    /^https?:\/\/.+\.(mp4|mov|avi|wmv|flv|webm)(\?.*)?$/i,
                },
                description:
                  "Must be a valid video URL (mp4, mov, avi, wmv, flv, webm)",
                icon: <FaVideo />,
              },
              {
                name: "subcategories",
                label: "Subcategories",
                type: "text",
                placeholder: "Enter subcategories (comma-separated)",
                description: "Use commas to separate multiple subcategories",
              },
              {
                name: "topics",
                label: "Course Topics",
                type: "text",
                placeholder: "Enter topics (comma-separated)",
                description: "Use commas to separate multiple topics",
              },
            ],
          };

        case 3:
          return {
            ...baseConfig,
            title: "Course Metadata",
            description: "Set course level, language, and access settings",
            submitText: "Next Step",
            cancelText: "Previous",
            fields: [
              {
                name: "skillLevel",
                label: "Skill Level",
                type: "select",
                validation: { required: true },
                options: Object.values(SkillLevelEnum).map((level) => ({
                  value: level,
                  label: level,
                })),
                defaultValue: SkillLevelEnum.ALL_LEVELS,
              },
              {
                name: "language",
                label: "Course Language",
                type: "text",
                placeholder: "English",
                validation: { required: true },
                defaultValue: "English",
                icon: <FaGlobe />,
              },
              {
                name: "captionsLanguage",
                label: "Captions Language",
                type: "text",
                placeholder: "English",
              },
              {
                name: "certificate",
                label: "Certificate Available",
                type: "checkbox",
                defaultValue: true,
                description:
                  "Students will receive a certificate upon completion",
              },
              {
                name: "lifetimeAccess",
                label: "Lifetime Access",
                type: "checkbox",
                defaultValue: true,
                description: "Students get lifetime access to the course",
              },
              {
                name: "mobileAccess",
                label: "Mobile Access",
                type: "checkbox",
                defaultValue: true,
                description: "Course is accessible on mobile devices",
              },
            ],
          };

        case 4:
          return {
            ...baseConfig,
            title: "Pricing & Publication",
            description: "Set course pricing and publication settings",
            submitText: "Next Step",
            cancelText: "Previous",
            fields: [
              {
                name: "price",
                label: "Course Price",
                type: "number",
                placeholder: "0",
                validation: { required: true, min: 0 },
                icon: <FaDollarSign />,
                defaultValue: 0,
              },
              {
                name: "currency",
                label: "Currency",
                type: "select",
                validation: { required: true },
                options: Object.values(CurrencyEnum).map((currency) => ({
                  value: currency,
                  label: currency,
                })),
                defaultValue: CurrencyEnum.USD,
              },
              {
                name: "discountedPrice",
                label: "Discounted Price",
                type: "number",
                placeholder: "Optional discounted price",
                validation: { min: 0 },
              },
              {
                name: "discountPercentage",
                label: "Discount Percentage",
                type: "number",
                placeholder: "0-100",
                validation: { min: 0, max: 100 },
              },
              {
                name: "isPublished",
                label: "Publish Course",
                type: "checkbox",
                defaultValue: false,
                description: "Make the course visible to students",
              },
              {
                name: "isFeatured",
                label: "Featured Course",
                type: "checkbox",
                defaultValue: false,
                description: "Feature this course on the homepage",
              },
              {
                name: "isBestseller",
                label: "Bestseller",
                type: "checkbox",
                defaultValue: false,
                description: "Mark as bestseller",
              },
              {
                name: "isNew",
                label: "New Course",
                type: "checkbox",
                defaultValue: false,
                description: "Mark as new course",
              },
            ],
          };

        case 7:
          return {
            ...baseConfig,
            title: "Course Details",
            description:
              "Add learning objectives, requirements, and target audience",
            submitText: isEditMode ? "Update Course" : "Create Course",
            cancelText: "Previous",
            fields: [
              {
                name: "whatYouWillLearn",
                label: "What You Will Learn",
                type: "textarea",
                placeholder: "Enter learning objectives (one per line)",
                validation: { required: true },
                description: "Enter each learning objective on a new line",
              },
              {
                name: "requirements",
                label: "Requirements",
                type: "textarea",
                placeholder: "Enter course requirements (one per line)",
                description: "Enter each requirement on a new line",
              },
              {
                name: "targetAudience",
                label: "Target Audience",
                type: "textarea",
                placeholder: "Who is this course for? (one per line)",
                description: "Enter each target audience point on a new line",
              },
              {
                name: "features",
                label: "Course Features",
                type: "textarea",
                placeholder: "Enter course features (one per line)",
                description: "Enter each feature on a new line",
              },
            ],
          };

        default:
          return { ...baseConfig, fields: [] };
      }
    },
    [
      isEditMode,
      usersLoading,
      usersError,
      instructorOptions,
      categoriesLoading,
      categoriesError,
      categoryOptions,
    ]
  );

  // Loading and error states
  if (usersLoading || categoriesLoading || (isEditMode && courseLoading)) {
    return (
      <div className="page-wrapper" style={{ minHeight: "100vh" }}>
        <div className="content container-fluid">
          <div className="row justify-content-center">
            <div className="col-xl-10">
              <div className="card">
                <div className="card-body">
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: "300px" }}
                  >
                    <div className="text-center">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-3 text-muted">
                        Loading{" "}
                        {isEditMode && courseLoading
                          ? "course data"
                          : "form data"}
                        ...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (usersError || categoriesError || (isEditMode && courseError)) {
    return (
      <div className="page-wrapper" style={{ minHeight: "100vh" }}>
        <div className="content container-fluid">
          <div className="row justify-content-center">
            <div className="col-xl-10">
              <div className="card">
                <div className="card-body">
                  <div className="alert alert-danger">
                    <h4 className="alert-heading">Error Loading Data</h4>
                    {isEditMode && <p>Failed to load course data</p>}
                    {usersError && <p>Failed to load instructors</p>}
                    {categoriesError && <p>Failed to load categories</p>}
                    <hr />
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => window.location.reload()}
                    >
                      Retry
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{ minHeight: "100vh" }}>
      <div className="content container-fluid">
        <div className="row justify-content-center">
          <div className="col-xl-10">
            {/* Progress indicator */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">
                    Course {isEditMode ? "Update" : "Creation"} Progress
                  </h5>
                  <span className="badge bg-primary">
                    Step {state.currentStep} of {totalSteps}
                  </span>
                </div>
                <div className="progress" style={{ height: "8px" }}>
                  <div
                    className="progress-bar bg-primary"
                    style={{
                      width: `${(state.currentStep / totalSteps) * 100}%`,
                    }}
                  />
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <small className="text-muted">Basic Info</small>
                  <small className="text-muted">Content</small>
                  <small className="text-muted">Metadata</small>
                  <small className="text-muted">Pricing</small>
                  <small className="text-muted">FAQ</small>
                  <small className="text-muted">Sessions</small>
                  <small className="text-muted">Details</small>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                {/* FAQ Management Interface */}
                {state.currentStep === 5 && (
                  <div className="faq-management">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <h5 className="mb-1">
                          <FaQuestionCircle className="me-2 text-primary" />
                          FAQ Management
                        </h5>
                        <small className="text-muted">
                          Create helpful questions and answers for your course
                        </small>
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary btn-lg"
                        onClick={handleAddFaq}
                      >
                        <FaPlus className="me-2" />
                        Add New FAQ
                      </button>
                    </div>

                    {state.faqs.length === 0 ? (
                      <div className="text-center py-5">
                        <div
                          className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                          style={{ width: "80px", height: "80px" }}
                        >
                          <FaQuestionCircle className="text-muted" size={40} />
                        </div>
                        <h6 className="mb-2">No FAQs added yet</h6>
                        <p className="text-muted mb-4">
                          Help students by adding frequently asked questions
                          about your course
                        </p>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleAddFaq}
                        >
                          <FaPlus className="me-2" />
                          Create Your First FAQ
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <small className="text-muted">
                            {state.faqs.length} FAQ
                            {state.faqs.length !== 1 ? "s" : ""} created
                          </small>
                        </div>
                        <div className="faq-list">
                          {state.faqs.map((faq, index) => (
                            <div
                              key={index}
                              className="card mb-3 border-start border-4 border-primary"
                            >
                              <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start">
                                  <div className="grow">
                                    <div className="d-flex align-items-center mb-2">
                                      <span className="badge bg-primary me-2">
                                        Q{index + 1}
                                      </span>
                                      <h6 className="mb-0 fw-bold">
                                        {faq.question}
                                      </h6>
                                    </div>
                                    <div className="ps-4">
                                      <p className="text-muted mb-0">
                                        {faq.answer}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="btn-group">
                                    <button
                                      type="button"
                                      className="btn btn-outline-primary btn-sm"
                                      onClick={() => handleEditFaq(index)}
                                      title="Edit FAQ"
                                    >
                                      <FaEdit />
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() => handleDeleteFaq(index)}
                                      title="Delete FAQ"
                                    >
                                      <FaTrash />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* FAQ Form */}
                    {state.showFaqForm && (
                      <div className="card mt-4 border-primary">
                        <div className="card-header bg-primary text-white">
                          <h6 className="mb-0">
                            {state.editingFaqIndex !== null
                              ? "Edit FAQ"
                              : "Add New FAQ"}
                          </h6>
                        </div>
                        <div className="card-body">
                          <FaqForm
                            initialData={
                              state.editingFaqIndex !== null
                                ? state.faqs[state.editingFaqIndex]
                                : undefined
                            }
                            onSave={handleSaveFaq}
                            onCancel={() =>
                              dispatch({
                                type: "TOGGLE_FAQ_FORM",
                                payload: false,
                              })
                            }
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 mt-4">
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
                        Next Step
                      </button>
                    </div>
                  <div className="sessions-management">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <h5 className="mb-1">
                          <FaClock className="me-2 text-primary" />
                          Course Sessions ({state.sessions.length})
                        </h5>
                        <small className="text-muted">
                          Structure your course content with organized sessions
                        </small>
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary btn-lg"
                        onClick={handleAddSession}
                      >
                        <FaPlus className="me-2" />
                        Add New Session
                      </button>
                    </div>

                    {state.sessions.length === 0 ? (
                      <div className="text-center py-5">
                        <div
                          className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                          style={{ width: "80px", height: "80px" }}
                        >
                          <FaClock className="text-muted" size={40} />
                        </div>
                        <h6 className="mb-2">No sessions created yet</h6>
                        <p className="text-muted mb-4">
                          Start building your course by adding structured
                          learning sessions
                        </p>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleAddSession}
                        >
                          <FaPlus className="me-2" />
                          Create Your First Session
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <small className="text-muted">
                            Total duration:{" "}
                            {state.sessions.reduce(
                              (total, session) =>
                                total + (Number(session.duration) || 0),
                              0
                            )}{" "}
                            minutes
                          </small>
                        </div>
                        <div className="sessions-list">
                          {state.sessions.map((session, index) => (
                            <div
                              key={index}
                              className="card mb-3 border-start border-4 border-info"
                            >
                              <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start">
                                  <div className="grow">
                                    <div className="d-flex align-items-center mb-2">
                                      <span className="badge bg-info me-2">
                                        Session {index + 1}
                                      </span>
                                      <h6 className="mb-0 fw-bold">
                                        {session.title}
                                      </h6>
                                      <span className="badge bg-secondary ms-2">
                                        {session.sessionType}
                                      </span>
                                      {session.isFree && (
                                        <span className="badge bg-success ms-2">
                                          Free
                                        </span>
                                      )}
                                    </div>
                                    {session.description && (
                                      <p className="text-muted mb-2 ps-3">
                                        {session.description}
                                      </p>
                                    )}
                                    <div className="ps-3">
                                      <div className="row">
                                        <div className="col-md-4">
                                          <small className="text-muted">
                                            <FaClock className="me-1" />
                                            {session.duration} minutes
                                          </small>
                                        </div>
                                        {session.startTime && (
                                          <div className="col-md-4">
                                            <small className="text-muted">
                                              Start: {session.startTime}
                                            </small>
                                          </div>
                                        )}
                                        {session.dayGroup && (
                                          <div className="col-md-4">
                                            <small className="text-muted">
                                              Day: {session.dayGroup}
                                            </small>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="btn-group">
                                    <button
                                      type="button"
                                      className="btn btn-outline-primary btn-sm"
                                      onClick={() => handleEditSession(index)}
                                      title="Edit Session"
                                    >
                                      <FaEdit />
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() => handleDeleteSession(index)}
                                      title="Delete Session"
                                    >
                                      <FaTrash />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Session Form */}
                    {state.showSessionForm && (
                      <div className="card mt-4 border-info">
                        <div className="card-header bg-info text-white">
                          <h6 className="mb-0">
                            {state.editingSessionIndex !== null
                              ? "Edit Session"
                              : "Add New Session"}
                          </h6>
                        </div>
                        <div className="card-body">
                          <SessionForm
                            initialData={
                              state.editingSessionIndex !== null
                                ? state.sessions[state.editingSessionIndex]
                                : undefined
                            }
                            onSave={handleSaveSession}
                            onCancel={() =>
                              dispatch({
                                type: "TOGGLE_SESSION_FORM",
                                payload: false,
                              })
                            }
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 mt-4">
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
                        Next Step
                      </button>
                    </div>
                  </div>
                )}

                {/* Regular Dynamic Form for other steps */}
                {state.currentStep !== 5 && state.currentStep !== 6 && (
                  <DynamicForm
                    config={getFormConfig(state.currentStep)}
                    initialData={isEditMode ? processedCourseData : {}}
                    onSubmit={handleStepSubmit}
                    onCancel={handleCancel}
                    loading={isCreating || isUpdating}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
