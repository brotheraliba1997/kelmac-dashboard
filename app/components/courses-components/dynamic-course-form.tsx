"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import DynamicForm, { DynamicFormConfig } from "../shared/DynamicForm";
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
  FaUsers,
  FaStar,
  FaList,
  FaQuestionCircle,
  FaPlus,
  FaMinus,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { useGetUsersQuery } from "../../redux/services/userApi";
import {
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useGetCourseByIdQuery,
} from "../../redux/services/courseApi";
import { useGetCategoriesQuery } from "../../redux/services/categoryApi";

// ===== TYPES & INTERFACES =====
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
  timeTable?: ClassDateOption[];
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
  title: string;
  description: string;
  duration: number;
  sessionType: SessionTypeEnum;
  dayGroup?: string;
  startTime?: string;
  endTime?: string;
  isFree: boolean;
  materials: string[];
  objectives: string[];
  prerequisites: string[];
}

export interface ClassDateOption {
  date: Date;
  description?: string; // e.g. "Full Week", "Weekend Per day"
  time?: string; // e.g. "9:00 AM - 4:30 PM (Eastern Time (GMT-5))"
}

export enum SessionTypeEnum {
  LECTURE = "lecture",
  INTRODUCTION = "introduction",
  BREAK = "break",
  LUNCH = "lunch",
  END_OF_DAY = "end_of_day",
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

// ===== STATE MANAGEMENT =====
interface FormState {
  currentStep: number;
  accumulatedFormData: Record<string, any>;
  sessions: Session[];
  faqs: FAQ[];
  timeTable: ClassDateOption[];
  showSessionForm: boolean;
  showFaqForm: boolean;
  showTimeTableForm: boolean;
  editingSessionIndex: number | null;
  editingFaqIndex: number | null;
  editingTimeTableIndex: number | null;
}

type FormAction =
  | { type: "SET_STEP"; payload: number }
  | { type: "ACCUMULATE_DATA"; payload: Record<string, any> }
  | { type: "SET_SESSIONS"; payload: Session[] }
  | { type: "ADD_SESSION"; payload: Session }
  | { type: "UPDATE_SESSION"; payload: { index: number; session: Session } }
  | { type: "DELETE_SESSION"; payload: number }
  | { type: "SET_FAQS"; payload: FAQ[] }
  | { type: "ADD_FAQ"; payload: FAQ }
  | { type: "UPDATE_FAQ"; payload: { index: number; faq: FAQ } }
  | { type: "DELETE_FAQ"; payload: number }
  | { type: "SET_TIMETABLE"; payload: ClassDateOption[] }
  | { type: "ADD_TIMETABLE"; payload: ClassDateOption }
  | {
      type: "UPDATE_TIMETABLE";
      payload: { index: number; timeTable: ClassDateOption };
    }
  | { type: "DELETE_TIMETABLE"; payload: number }
  | { type: "TOGGLE_SESSION_FORM"; payload?: boolean }
  | { type: "TOGGLE_FAQ_FORM"; payload?: boolean }
  | { type: "TOGGLE_TIMETABLE_FORM"; payload?: boolean }
  | { type: "SET_EDITING_SESSION"; payload: number | null }
  | { type: "SET_EDITING_FAQ"; payload: number | null }
  | { type: "SET_EDITING_TIMETABLE"; payload: number | null }
  | { type: "RESET_FORM" };

const initialFormState: FormState = {
  currentStep: 1,
  accumulatedFormData: {},
  sessions: [],
  faqs: [],
  timeTable: [],
  showSessionForm: false,
  showFaqForm: false,
  showTimeTableForm: false,
  editingSessionIndex: null,
  editingFaqIndex: null,
  editingTimeTableIndex: null,
};

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

    case "SET_SESSIONS":
      return { ...state, sessions: action.payload };

    case "ADD_SESSION":
      return {
        ...state,
        sessions: [
          ...state.sessions,
          //   { ...action.payload, order: state.sessions.length },
        ],
        showSessionForm: false,
        editingSessionIndex: null,
      };

    case "UPDATE_SESSION":
      const updatedSessions = [...state.sessions];
      updatedSessions[action.payload.index] = {
        ...action.payload.session,
        // order: action.payload.index,
      };
      return {
        ...state,
        sessions: updatedSessions,
        showSessionForm: false,
        editingSessionIndex: null,
      };

    case "DELETE_SESSION":
      return {
        ...state,
        sessions: state.sessions.filter((_, i) => i !== action.payload),
      };

    case "SET_FAQS":
      return { ...state, faqs: action.payload };

    case "ADD_FAQ":
      return {
        ...state,
        faqs: [...state.faqs, action.payload],
        showFaqForm: false,
        editingFaqIndex: null,
      };

    case "UPDATE_FAQ":
      const updatedFaqs = [...state.faqs];
      updatedFaqs[action.payload.index] = action.payload.faq;
      return {
        ...state,
        faqs: updatedFaqs,
        showFaqForm: false,
        editingFaqIndex: null,
      };

    case "DELETE_FAQ":
      return {
        ...state,
        faqs: state.faqs.filter((_, i) => i !== action.payload),
      };

    case "TOGGLE_SESSION_FORM":
      return {
        ...state,
        showSessionForm: action.payload ?? !state.showSessionForm,
        editingSessionIndex:
          action.payload === false ? null : state.editingSessionIndex,
      };

    case "TOGGLE_FAQ_FORM":
      return {
        ...state,
        showFaqForm: action.payload ?? !state.showFaqForm,
        editingFaqIndex:
          action.payload === false ? null : state.editingFaqIndex,
      };

    case "SET_EDITING_SESSION":
      return {
        ...state,
        editingSessionIndex: action.payload,
        showSessionForm: action.payload !== null,
      };

    case "SET_EDITING_FAQ":
      return {
        ...state,
        editingFaqIndex: action.payload,
        showFaqForm: action.payload !== null,
      };

    case "SET_TIMETABLE":
      return { ...state, timeTable: action.payload };

    case "ADD_TIMETABLE":
      return {
        ...state,
        timeTable: [...state.timeTable, action.payload],
        showTimeTableForm: false,
        editingTimeTableIndex: null,
      };

    case "UPDATE_TIMETABLE":
      const updatedTimeTable = [...state.timeTable];
      updatedTimeTable[action.payload.index] = action.payload.timeTable;
      return {
        ...state,
        timeTable: updatedTimeTable,
        showTimeTableForm: false,
        editingTimeTableIndex: null,
      };

    case "DELETE_TIMETABLE":
      return {
        ...state,
        timeTable: state.timeTable.filter((_, i) => i !== action.payload),
      };

    case "TOGGLE_TIMETABLE_FORM":
      return {
        ...state,
        showTimeTableForm: action.payload ?? !state.showTimeTableForm,
        editingTimeTableIndex:
          action.payload === false ? null : state.editingTimeTableIndex,
      };

    case "SET_EDITING_TIMETABLE":
      return {
        ...state,
        editingTimeTableIndex: action.payload,
        showTimeTableForm: action.payload !== null,
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

// FAQ Form Component
const FaqForm: React.FC<{
  initialData?: { question: string; answer: string };
  onSave: (data: { question: string; answer: string }) => void;
  onCancel: () => void;
}> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    question: initialData?.question || "",
    answer: initialData?.answer || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.question.trim()) {
      newErrors.question = "Question is required";
    }

    if (!formData.answer.trim()) {
      newErrors.answer = "Answer is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

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

      <div className="d-flex justify-content-end gap-2">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {initialData ? "Update FAQ" : "Add FAQ"}
        </button>
      </div>
    </form>
  );
};

// Session Form Component
const SessionForm: React.FC<{
  initialData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const finalValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleArrayChange = (field: string, value: string) => {
    const items = value.split("\n").filter((item) => item.trim());
    setFormData((prev) => ({ ...prev, [field]: items }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Session title is required";
    }

    const duration = Number(formData.duration);
    if (!duration || duration <= 0 || !Number.isInteger(duration)) {
      newErrors.duration = "Duration must be a positive integer greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

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
              <option value={SessionTypeEnum.LECTURE}>Lecture</option>
              <option value={SessionTypeEnum.INTRODUCTION}>Introduction</option>
              <option value={SessionTypeEnum.BREAK}>Break</option>
              <option value={SessionTypeEnum.LUNCH}>Lunch</option>
              <option value={SessionTypeEnum.END_OF_DAY}>End of Day</option>
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

      <div className="mb-3">
        <label htmlFor="objectives" className="form-label">
          Learning Objectives
          <small className="text-muted">(one per line)</small>
        </label>
        <textarea
          className="form-control"
          id="objectives"
          rows={3}
          value={formData.objectives.join("\n")}
          onChange={(e) => handleArrayChange("objectives", e.target.value)}
          placeholder="Understand basic concepts&#10;Apply theoretical knowledge&#10;Develop practical skills"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="materials" className="form-label">
          Required Materials
          <small className="text-muted">(one per line)</small>
        </label>
        <textarea
          className="form-control"
          id="materials"
          rows={2}
          value={formData.materials.join("\n")}
          onChange={(e) => handleArrayChange("materials", e.target.value)}
          placeholder="Laptop with IDE&#10;Textbook Chapter 3&#10;Online resources"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="prerequisites" className="form-label">
          Prerequisites
          <small className="text-muted">(one per line)</small>
        </label>
        <textarea
          className="form-control"
          id="prerequisites"
          rows={2}
          value={formData.prerequisites.join("\n")}
          onChange={(e) => handleArrayChange("prerequisites", e.target.value)}
          placeholder="Complete previous session&#10;Basic programming knowledge"
        />
      </div>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {initialData ? "Update Session" : "Add Session"}
        </button>
      </div>
    </form>
  );
};

// TimeTable Form Component
const TimeTableForm: React.FC<{
  initialData?: ClassDateOption;
  onSave: (data: ClassDateOption) => void;
  onCancel: () => void;
}> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<ClassDateOption>({
    date: initialData?.date || new Date(),
    description: initialData?.description || "",
    time: initialData?.time || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "date") {
      setFormData((prev) => ({ ...prev, [name]: new Date(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  // Format date for input (YYYY-MM-DDTHH:mm)
  const formatDateForInput = (date: Date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="date" className="form-label">
          Date and Time <span className="text-danger">*</span>
        </label>
        <input
          type="datetime-local"
          className={`form-control ${errors.date ? "is-invalid" : ""}`}
          id="date"
          name="date"
          value={formatDateForInput(formData.date)}
          onChange={handleChange}
        />
        {errors.date && <div className="invalid-feedback">{errors.date}</div>}
        <small className="text-muted">Example: 2025-11-06 13:44</small>
      </div>

      <div className="mb-3">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <input
          type="text"
          className="form-control"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="e.g., Full Week, Weekend Per day"
        />
        <small className="text-muted">
          Example: "Full Week", "Weekend Per day"
        </small>
      </div>

      <div className="mb-3">
        <label htmlFor="time" className="form-label">
          Time Schedule
        </label>
        <input
          type="text"
          className="form-control"
          id="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          placeholder="e.g., 9:00 AM - 4:30 PM (Eastern Time (GMT-5))"
        />
        <small className="text-muted">
          Example: "9:00 AM - 4:30 PM (Eastern Time (GMT-5))"
        </small>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {initialData ? "Update Date" : "Add Date"}
        </button>
      </div>
    </form>
  );
};

export default function DynamicCourseForm({
  mode = "create",
  courseId,
}: DynamicCourseFormProps) {
  const router = useRouter();
  const isEditMode = mode === "edit";
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8; // Updated to include TimeTable step
  const [accumulatedFormData, setAccumulatedFormData] = useState<
    Record<string, any>
  >({});
  const [sessions, setSessions] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>(
    []
  );
  const [timeTable, setTimeTable] = useState<ClassDateOption[]>([]);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [showFaqForm, setShowFaqForm] = useState(false);
  const [showTimeTableForm, setShowTimeTableForm] = useState(false);
  const [editingSessionIndex, setEditingSessionIndex] = useState<number | null>(
    null
  );
  const [editingFaqIndex, setEditingFaqIndex] = useState<number | null>(null);
  const [editingTimeTableIndex, setEditingTimeTableIndex] = useState<
    number | null
  >(null);

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

  // Fetch instructors (users with instructor role)
  const {
    data: usersData,
    error: usersError,
    isLoading: usersLoading,
  } = useGetUsersQuery({ role: 3 }); // Assuming role 3 is instructor

  // Fetch categories
  const {
    data: categoriesData,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useGetCategoriesQuery({ isActive: true });

  // Helper function to format sessions for editing
  const formatSessionsForEdit = (sessions: any[]) => {
    return sessions
      .map((session, index) => {
        let sessionText = `SESSION ${index + 1}: ${session.title}`;
        if (session.description)
          sessionText += `\nDESCRIPTION: ${session.description}`;
        if (session.sessionType)
          sessionText += `\nTYPE: ${session.sessionType}`;
        if (session.duration)
          sessionText += `\nDURATION: ${session.duration} minutes`;
        if (session.startTime) sessionText += `\nSTART: ${session.startTime}`;
        if (session.endTime) sessionText += `\nEND: ${session.endTime}`;
        if (session.videoUrl) sessionText += `\nVIDEO: ${session.videoUrl}`;
        if (session.isFree) sessionText += `\nFREE: yes`;
        if (session.dayGroup) sessionText += `\nDAY: ${session.dayGroup}`;
        return sessionText;
      })
      .join("\n\n");
  };

  // Process course data for edit mode
  const processedCourseData = useMemo(() => {
    if (!isEditMode || !courseData) return {};

    const course = courseData as any;
    return {
      // Basic Information
      title: course?.title || "",
      slug: course?.slug || "",
      subtitle: course?.subtitle || "",
      description: course?.description || "",
      instructor: course?.instructor?.id || course?.instructor,
      overview: course?.overview || "",
      thumbnailUrl: course?.thumbnailUrl || "",
      previewVideoUrl: course?.previewVideoUrl || "",

      // Category & Classification
      category: course?.category || "",
      subcategories: course?.subcategories || [],
      topics: course?.topics || [],

      // Course Metadata
      skillLevel: course?.snapshot?.skillLevel || SkillLevelEnum.ALL_LEVELS,
      language: course?.snapshot?.language || "English",
      captionsLanguage: course?.snapshot?.captionsLanguage || "",
      certificate: course?.snapshot?.certificate !== false,
      lifetimeAccess: course?.snapshot?.lifetimeAccess !== false,
      mobileAccess: course?.snapshot?.mobileAccess !== false,

      // Pricing
      price: course?.price || 0,
      discountedPrice: course?.discountedPrice || "",
      discountPercentage: course?.discountPercentage || "",
      currency: course?.currency || CurrencyEnum.USD,

      // Course Details
      whatYouWillLearn: course?.details?.whatYouWillLearn?.join("\n") || "",
      requirements: course?.details?.requirements?.join("\n") || "",
      targetAudience: course?.details?.targetAudience?.join("\n") || "",
      features: course?.details?.features?.join("\n") || "",

      // FAQ
      faqsText:
        course?.faqs
          ?.map((faq: any) => `Q: ${faq.question}\nA: ${faq.answer}`)
          .join("\n\n") || "",

      // Sessions
      sessionsText: course?.sessions
        ? formatSessionsForEdit(course.sessions)
        : "",

      // Publishing & Status
      isPublished: course?.isPublished || false,
      isFeatured: course?.isFeatured || false,
      isBestseller: course?.isBestseller || false,
      isNew: course?.isNew || false,
    };
  }, [isEditMode, courseData]);

  // Initialize sessions, FAQs, and timeTable from course data
  React.useEffect(() => {
    if (isEditMode && courseData) {
      const course = courseData as any;
      if (course?.sessions) {
        setSessions(course.sessions);
      }
      if (course?.faqs) {
        setFaqs(course.faqs);
      }
      if (course?.timeTable) {
        setTimeTable(
          course.timeTable.map((entry: any) => ({
            date: new Date(entry.date),
            description: entry.description || "",
            time: entry.time || "",
          }))
        );
      }
    }
  }, [isEditMode, courseData]);

  // Process users data
  const instructors = useMemo(() => {
    if (!usersData) return [];
    return Array.isArray(usersData)
      ? usersData
      : (usersData as any)?.data || (usersData as any)?.users || [];
  }, [usersData]);

  // Create instructor options
  const instructorOptions = useMemo(() => {
    console.log("Creating instructor options from:", instructors);
    if (instructors.length === 0) {
      console.log("No instructors available");
      return [];
    }

    const options = [
      { value: "", label: "-- Select an Instructor --", disabled: true },
      ...instructors.map((instructor: any) => {
        const value = instructor.id || instructor._id;
        const label = `${instructor.firstName || "Unknown"} ${
          instructor.lastName || ""
        } (${instructor.email})`.trim();
        console.log("Instructor option:", { value, label, instructor });
        return { value, label };
      }),
    ];

    console.log("Generated instructor options:", options);
    return options;
  }, [instructors]); // Process categories data
  const categories = useMemo(() => {
    if (!categoriesData) return [];
    return Array.isArray(categoriesData)
      ? categoriesData
      : (categoriesData as any)?.data ||
          (categoriesData as any)?.categories ||
          [];
  }, [categoriesData]);

  // Create category options
  const categoryOptions = useMemo(() => {
    return categories.map((category: any) => ({
      value: category.id || category._id || category.slug,
      label: category.name || category.title,
    }));
  }, [categories]);

  // Helper function to process FAQ text into array format
  const processFAQsText = (faqText: string) => {
    if (!faqText) return [];

    const faqs: Array<{ question: string; answer: string }> = [];
    const faqPairs = faqText.split("\n\n").filter((pair) => pair.trim());

    faqPairs.forEach((pair) => {
      const lines = pair.split("\n").filter((line) => line.trim());
      let question = "";
      let answer = "";

      lines.forEach((line) => {
        if (line.startsWith("Q:")) {
          question = line.substring(2).trim();
        } else if (line.startsWith("A:")) {
          answer = line.substring(2).trim();
        }
      });

      if (question && answer) {
        faqs.push({ question, answer });
      }
    });

    return faqs;
  };

  // Helper function to process sessions text into array format
  const processSessionsText = (sessionsText: string) => {
    if (!sessionsText) return [];

    const sessions: any[] = [];
    const sessionBlocks = sessionsText
      .split(/SESSION \d+:/i)
      .filter((block) => block.trim());

    sessionBlocks.forEach((block, index) => {
      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line);
      const session: any = {
        title: "",
        order: index,
        duration: 60, // default duration
        sessionType: SessionTypeEnum.LECTURE,
        isFree: false,
        isBreak: false,
        topics: [],
        resources: [],
      };

      // First line should be the title
      if (lines[0]) {
        session.title = lines[0];
      }

      lines.forEach((line) => {
        if (line.startsWith("DESCRIPTION:")) {
          session.description = line.substring(12).trim();
        } else if (line.startsWith("TYPE:")) {
          const type = line.substring(5).trim().toLowerCase();
          if (
            Object.values(SessionTypeEnum).includes(type as SessionTypeEnum)
          ) {
            session.sessionType = type;
          }
        } else if (line.startsWith("DURATION:")) {
          const duration = parseInt(
            line.substring(9).replace("minutes", "").trim()
          );
          if (!isNaN(duration)) session.duration = duration;
        } else if (line.startsWith("START:")) {
          session.startTime = line.substring(6).trim();
        } else if (line.startsWith("END:")) {
          session.endTime = line.substring(4).trim();
        } else if (line.startsWith("VIDEO:")) {
          session.videoUrl = line.substring(6).trim();
        } else if (line.startsWith("FREE:")) {
          session.isFree = line.substring(5).trim().toLowerCase() === "yes";
        } else if (line.startsWith("DAY:")) {
          session.dayGroup = line.substring(4).trim();
        }
      });

      if (session.title) {
        sessions.push(session);
      }
    });

    return sessions;
  };

  // Session management functions
  const addSession = () => {
    setEditingSessionIndex(null);
    setShowSessionForm(true);
  };

  const editSession = (index: number) => {
    setEditingSessionIndex(index);
    setShowSessionForm(true);
  };

  const deleteSession = (index: number) => {
    if (confirm("Are you sure you want to delete this session?")) {
      setSessions(sessions.filter((_, i) => i !== index));
    }
  };

  const saveSession = (sessionData: any) => {
    if (editingSessionIndex !== null) {
      // Edit existing session
      const updatedSessions = [...sessions];
      updatedSessions[editingSessionIndex] = {
        ...sessionData,
        order: editingSessionIndex,
      };
      setSessions(updatedSessions);
    } else {
      // Add new session
      setSessions([...sessions, { ...sessionData, order: sessions.length }]);
    }
    setShowSessionForm(false);
    setEditingSessionIndex(null);
  };

  // FAQ management functions
  const addFaq = () => {
    setEditingFaqIndex(null);
    setShowFaqForm(true);
  };

  const editFaq = (index: number) => {
    setEditingFaqIndex(index);
    setShowFaqForm(true);
  };

  const deleteFaq = (index: number) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      setFaqs(faqs.filter((_, i) => i !== index));
    }
  };

  const saveFaq = (faqData: { question: string; answer: string }) => {
    if (editingFaqIndex !== null) {
      // Edit existing FAQ
      const updatedFaqs = [...faqs];
      updatedFaqs[editingFaqIndex] = faqData;
      setFaqs(updatedFaqs);
    } else {
      // Add new FAQ
      setFaqs([...faqs, faqData]);
    }
    setShowFaqForm(false);
    setEditingFaqIndex(null);
  };

  // TimeTable management functions
  const addTimeTable = () => {
    setEditingTimeTableIndex(null);
    setShowTimeTableForm(true);
  };

  const editTimeTable = (index: number) => {
    setEditingTimeTableIndex(index);
    setShowTimeTableForm(true);
  };

  const deleteTimeTable = (index: number) => {
    if (confirm("Are you sure you want to delete this class date?")) {
      setTimeTable(timeTable.filter((_, i) => i !== index));
    }
  };

  const saveTimeTable = (timeTableData: ClassDateOption) => {
    if (editingTimeTableIndex !== null) {
      // Edit existing timeTable entry
      const updatedTimeTable = [...timeTable];
      updatedTimeTable[editingTimeTableIndex] = timeTableData;
      setTimeTable(updatedTimeTable);
    } else {
      // Add new timeTable entry
      setTimeTable([...timeTable, timeTableData]);
    }
    setShowTimeTableForm(false);
    setEditingTimeTableIndex(null);
  };

  // Dynamic form configuration
  const getFormConfig = (step: number): DynamicFormConfig => {
    const baseConfig = {
      layout: "vertical" as const,
      columns: 2,
      showProgress: !isEditMode,
    };

    switch (step) {
      case 1:
        return {
          ...baseConfig,
          title: `${isEditMode ? "Edit" : "Create"} Course - Basic Information`,
          description: "Enter the basic course information",
          submitText: isEditMode ? "Update Course" : "Next Step",
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
              validation: {
                required: true,
                custom: (value: string) => {
                  console.log(
                    "Validating instructor value:",
                    value,
                    typeof value
                  );
                  if (!value || value.trim() === "") {
                    return "Please select an instructor";
                  }
                  return null;
                },
              },
              options: instructorOptions,
              disabled:
                usersLoading || !!usersError || instructorOptions.length === 0,
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
          submitText: isEditMode ? "Update Course" : "Next Step",
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
                pattern: /^https?:\/\/.+\.(mp4|mov|avi|wmv|flv|webm)(\?.*)?$/i,
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
          submitText: isEditMode ? "Update Course" : "Next Step",
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
          submitText: isEditMode ? "Update Course" : "Next Step",
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

      case 5:
        return {
          ...baseConfig,
          title: "FAQ Management",
          description: "Add frequently asked questions about your course",
          submitText: isEditMode ? "Update Course" : "Next Step",
          cancelText: "Previous",
          fields: [
            {
              name: "faqManagement",
              label: "Frequently Asked Questions",
              type: "text", // We'll render custom content
              placeholder: "",
              validation: {},
              description: "Manage your course FAQs using the interface below.",
            },
          ],
        };

      case 6:
        return {
          ...baseConfig,
          title: "Course Sessions",
          description: "Add course sessions, lectures, and content structure",
          submitText: isEditMode ? "Update Course" : "Next Step",
          cancelText: "Previous",
          fields: [
            {
              name: "sessionManagement",
              label: "Course Sessions",
              type: "text", // We'll render custom content
              placeholder: "",
              validation: {},
              description:
                "Manage your course sessions using the interface below.",
            },
          ],
        };

      case 7:
        return {
          ...baseConfig,
          title: "Class Schedule (TimeTable)",
          description: "Add class dates and schedule options",
          submitText: isEditMode ? "Update Course" : "Next Step",
          cancelText: "Previous",
          fields: [
            {
              name: "timeTableManagement",
              label: "Class Schedule",
              type: "text", // We'll render custom content
              placeholder: "",
              validation: {},
              description:
                "Manage your class schedule using the interface below.",
            },
          ],
        };

      case 8:
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
  };

  const handleSubmit = async (data: Record<string, any>) => {
    console.log(
      `${isEditMode ? "Updating" : "Creating"} course with data:`,
      data
    );

    // Console all form values with focus on instructor and category
    console.log("=== FORM VALUES DEBUG ===");
    console.log("Instructor value:", data.instructor);
    console.log("Category value:", data.category);
    console.log("All form data:", JSON.stringify(data, null, 2));
    console.log("========================");

    // Debug instructor data
    console.log("Instructor field:", {
      value: data.instructor,
      type: typeof data.instructor,
      isValid: data.instructor ? isValidObjectId(data.instructor) : false,
      availableInstructors: instructors.map((i: any) => ({
        id: i.id || i._id,
        name: `${i.firstName} ${i.lastName}`,
      })),
    });

    // Debug category data
    console.log("Category field:", {
      value: data.category,
      type: typeof data.category,
      isValid: data.category ? isValidObjectId(data.category) : false,
      availableCategories: categories?.map((cat: any) => ({
        id: cat._id || cat.id,
        name: cat.name,
      })),
    });

    // Validate required fields before processing
    const validationErrors: string[] = [];

    if (!data.title || data.title.trim() === "") {
      validationErrors.push("Course title is required");
    }

    if (!data.description || data.description.trim() === "") {
      validationErrors.push("Course description is required");
    }

    if (!data.instructor || data.instructor.trim() === "") {
      validationErrors.push("Instructor selection is required");
    } else if (!isValidObjectId(data.instructor)) {
      validationErrors.push("Invalid instructor selected");
    }

    if (!data.category || data.category.trim() === "") {
      validationErrors.push("Course category is required");
    }

    if (!data.whatYouWillLearn || data.whatYouWillLearn.trim() === "") {
      validationErrors.push("Learning objectives are required");
    }

    // FAQ validation - ensure FAQs have both question and answer
    const validFaqs = faqs.filter(
      (faq) => faq.question?.trim() && faq.answer?.trim()
    );
    if (faqs.length > 0 && validFaqs.length === 0) {
      validationErrors.push(
        "If adding FAQs, at least one complete FAQ (question and answer) is required"
      );
    }

    // Sessions validation - ensure sessions have title and description
    const validSessions = sessions.filter(
      (session) => session.title?.trim() && session.description?.trim()
    );
    if (sessions.length > 0 && validSessions.length === 0) {
      validationErrors.push(
        "If adding sessions, at least one complete session (title and description) is required"
      );
    }

    // Show validation errors if any
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
        // Basic Information - ensure all are strings and not empty
        title: data.title.trim(),
        slug:
          data.slug?.trim() ||
          data.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-") ||
          "",
        subtitle: data.subtitle?.trim() || "",
        description: data.description.trim(),
        instructor: data.instructor, // MongoDB ObjectId string
        overview: data.overview?.trim() || "",
        thumbnailUrl: data.thumbnailUrl?.trim() || "",
        previewVideoUrl: data.previewVideoUrl?.trim() || "",

        // Category & Classification - ensure category is string and not empty
        category: data.category, // MongoDB ObjectId string
        subcategories: data.subcategories
          ? Array.isArray(data.subcategories)
            ? data.subcategories
            : data.subcategories
                .split(",")
                .map((s: string) => s.trim())
                .filter((s: string) => s.length > 0)
          : [],
        topics: data.topics
          ? Array.isArray(data.topics)
            ? data.topics
            : data.topics
                .split(",")
                .map((s: string) => s.trim())
                .filter((s: string) => s.length > 0)
          : [],

        // Pricing
        price: Number(data.price) || 0,
        discountedPrice: data.discountedPrice
          ? Number(data.discountedPrice)
          : undefined,
        discountPercentage: data.discountPercentage
          ? Number(data.discountPercentage)
          : undefined,
        currency: data.currency || CurrencyEnum.USD,

        // Course Metadata
        snapshot: {
          skillLevel: data.skillLevel || SkillLevelEnum.ALL_LEVELS,
          language: data.language || "English",
          captionsLanguage: data.captionsLanguage,
          certificate: data.certificate !== false,
          lifetimeAccess: data.lifetimeAccess !== false,
          mobileAccess: data.mobileAccess !== false,
        },

        // Course Details
        details: {
          whatYouWillLearn: data.whatYouWillLearn
            ? data.whatYouWillLearn.split("\n").filter((s: string) => s.trim())
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

        // FAQ Processing - only include valid FAQs
        faqs: faqs
          .filter((faq) => faq.question?.trim() && faq.answer?.trim())
          .map((faq) => ({
            question: String(faq.question.trim()),
            answer: String(faq.answer.trim()),
          })),

        // Sessions Processing - only include valid sessions with required fields
        sessions: sessions
          .filter(
            (session) => session.title?.trim() && session.description?.trim()
          )
          .map((session) => ({
            title: String(session.title.trim()),
            description: String(session.description.trim()),
            duration: Number(session.duration) || 0,
            sessionType:
              session.sessionType === "practical" ||
              session.sessionType === "workshop" ||
              session.sessionType === "seminar" ||
              session.sessionType === "assignment" ||
              session.sessionType === "exam"
                ? "lecture" // Map unsupported types to lecture
                : session.sessionType || SessionTypeEnum.LECTURE,
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

        // TimeTable Processing - include all timeTable entries
        timeTable: timeTable.map((entry) => ({
          date: new Date(entry.date).toISOString(),
          description: entry.description || "",
          time: entry.time || "",
        })),

        // Publishing & Status
        isPublished: data.isPublished || false,
        isFeatured: data.isFeatured || false,
        isBestseller: data.isBestseller || false,
        isNew: data.isNew || false,
      };

      console.log("Processed data being sent:", processedData);

      if (isEditMode && courseId) {
        await updateCourse({
          id: courseId,
          data: processedData,
        }).unwrap();
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
  };

  const handleStepSubmit = (data: Record<string, any>) => {
    console.log("Step submit data:", data);
    console.log("Current step:", currentStep);
    console.log("Accumulated data before:", accumulatedFormData);

    // Accumulate form data from current step
    const updatedFormData = { ...accumulatedFormData, ...data };
    setAccumulatedFormData(updatedFormData);

    console.log("Updated form data:", updatedFormData);

    // Only submit when we reach the final step (step 7)
    if (currentStep === totalSteps) {
      return handleSubmit(updatedFormData);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleCancel = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      router.back();
    }
  };

  // Show loading state
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
                          : usersLoading && categoriesLoading
                          ? "instructors and categories"
                          : usersLoading
                          ? "instructors"
                          : "categories"}
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

  // Show error state
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
                    {!!courseError && isEditMode && (
                      <p className="mb-2">
                        <strong>Course Error:</strong> Failed to load course
                        data
                      </p>
                    )}
                    {!!usersError && (
                      <p className="mb-2">
                        <strong>Instructors Error:</strong> Failed to load
                        instructors
                      </p>
                    )}
                    {!!categoriesError && (
                      <p className="mb-0">
                        <strong>Categories Error:</strong> Failed to load
                        categories
                      </p>
                    )}
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
            {/* Progress indicator for both create and edit modes */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">
                    Course {isEditMode ? "Update" : "Creation"} Progress
                  </h5>
                  <span className="badge bg-primary">
                    Step {currentStep} of {totalSteps}
                  </span>
                </div>
                <div className="progress" style={{ height: "8px" }}>
                  <div
                    className="progress-bar bg-primary"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  />
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <small className="text-muted">Basic Info</small>
                  <small className="text-muted">Content</small>
                  <small className="text-muted">Metadata</small>
                  <small className="text-muted">Pricing</small>
                  <small className="text-muted">FAQ</small>
                  <small className="text-muted">Sessions</small>
                  <small className="text-muted">Schedule</small>
                  <small className="text-muted">Details</small>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                {/* FAQ Management Interface */}
                {currentStep === 5 && (
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
                        onClick={addFaq}
                      >
                        <FaPlus className="me-2" />
                        Add New FAQ
                      </button>
                    </div>

                    {faqs.length === 0 ? (
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
                          onClick={addFaq}
                        >
                          <FaPlus className="me-2" />
                          Create Your First FAQ
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <small className="text-muted">
                            {faqs.length} FAQ{faqs.length !== 1 ? "s" : ""}{" "}
                            created
                          </small>
                        </div>
                        <div className="faq-list">
                          {faqs.map((faq, index) => (
                            <div
                              key={index}
                              className="card mb-3 border-start border-4 border-primary"
                            >
                              <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start">
                                  <div className="flex-grow-1">
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
                                        <strong>Answer:</strong> {faq.answer}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="btn-group">
                                    <button
                                      type="button"
                                      className="btn btn-outline-primary btn-sm"
                                      onClick={() => editFaq(index)}
                                      title="Edit FAQ"
                                    >
                                      <FaEdit />
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() => deleteFaq(index)}
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
                    {showFaqForm && (
                      <div className="card mt-4 border-primary">
                        <div className="card-header bg-primary text-white">
                          <h6 className="mb-0">
                            {editingFaqIndex !== null
                              ? "Edit FAQ"
                              : "Add New FAQ"}
                          </h6>
                        </div>
                        <div className="card-body">
                          <FaqForm
                            initialData={
                              editingFaqIndex !== null
                                ? faqs[editingFaqIndex]
                                : undefined
                            }
                            onSave={saveFaq}
                            onCancel={() => setShowFaqForm(false)}
                          />
                        </div>
                      </div>
                    )}

                    <div className="d-flex justify-content-between mt-4">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={handleCancel}
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          // For step 5 (FAQ), just move to next step since FAQs are managed separately
                          handleStepSubmit({});
                        }}
                      >
                        Next Step
                      </button>
                    </div>
                  </div>
                )}

                {/* Sessions Management Interface */}
                {currentStep === 6 && (
                  <div className="sessions-management">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <h5 className="mb-1">
                          <FaClock className="me-2 text-primary" />
                          Course Sessions ({sessions.length})
                        </h5>
                        <small className="text-muted">
                          Structure your course content with organized sessions
                        </small>
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary btn-lg"
                        onClick={addSession}
                      >
                        <FaPlus className="me-2" />
                        Add New Session
                      </button>
                    </div>

                    {sessions.length === 0 ? (
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
                          onClick={addSession}
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
                            {sessions.reduce(
                              (total, session) =>
                                total + (Number(session.duration) || 0),
                              0
                            )}{" "}
                            minutes
                          </small>
                        </div>
                        <div className="sessions-list">
                          {sessions.map((session, index) => (
                            <div
                              key={index}
                              className="card mb-3 border-start border-4 border-info"
                            >
                              <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start">
                                  <div className="flex-grow-1">
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
                                        <span className="badge bg-success ms-1">
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
                                          <small className="text-muted d-block">
                                            <FaClock className="me-1" />
                                            <strong>Duration:</strong>{" "}
                                            {session.duration} min
                                          </small>
                                        </div>
                                        {session.startTime &&
                                          session.endTime && (
                                            <div className="col-md-4">
                                              <small className="text-muted d-block">
                                                <strong>Time:</strong>{" "}
                                                {session.startTime} -{" "}
                                                {session.endTime}
                                              </small>
                                            </div>
                                          )}
                                        {session.dayGroup && (
                                          <div className="col-md-4">
                                            <small className="text-muted d-block">
                                              <strong>Schedule:</strong>{" "}
                                              {session.dayGroup}
                                            </small>
                                          </div>
                                        )}
                                      </div>
                                      {(session.objectives?.length > 0 ||
                                        session.materials?.length > 0) && (
                                        <div className="mt-2">
                                          {session.objectives?.length > 0 && (
                                            <small className="text-muted d-block">
                                              <strong>Objectives:</strong>{" "}
                                              {session.objectives
                                                .slice(0, 2)
                                                .join(", ")}
                                              {session.objectives.length > 2 &&
                                                "..."}
                                            </small>
                                          )}
                                          {session.materials?.length > 0 && (
                                            <small className="text-muted d-block">
                                              <strong>Materials:</strong>{" "}
                                              {session.materials
                                                .slice(0, 2)
                                                .join(", ")}
                                              {session.materials.length > 2 &&
                                                "..."}
                                            </small>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="btn-group">
                                    <button
                                      type="button"
                                      className="btn btn-outline-primary btn-sm"
                                      onClick={() => editSession(index)}
                                      title="Edit Session"
                                    >
                                      <FaEdit />
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() => deleteSession(index)}
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
                    {showSessionForm && (
                      <div className="card mt-4 border-info">
                        <div className="card-header bg-info text-white">
                          <h6 className="mb-0">
                            {editingSessionIndex !== null
                              ? "Edit Session"
                              : "Add New Session"}
                          </h6>
                        </div>
                        <div className="card-body">
                          <SessionForm
                            initialData={
                              editingSessionIndex !== null
                                ? sessions[editingSessionIndex]
                                : undefined
                            }
                            onSave={saveSession}
                            onCancel={() => setShowSessionForm(false)}
                          />
                        </div>
                      </div>
                    )}

                    <div className="d-flex justify-content-between mt-4">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={handleCancel}
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          // For step 6 (Sessions), just move to next step since sessions are managed separately
                          handleStepSubmit({});
                        }}
                      >
                        Next Step
                      </button>
                    </div>
                  </div>
                )}

                {/* TimeTable Management Interface */}
                {currentStep === 7 && (
                  <div className="timetable-management">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <h5 className="mb-1">
                          <FaCalendar className="me-2 text-primary" />
                          Class Schedule ({timeTable.length})
                        </h5>
                        <small className="text-muted">
                          Add class dates and time schedules for your course
                        </small>
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary btn-lg"
                        onClick={addTimeTable}
                      >
                        <FaPlus className="me-2" />
                        Add New Date
                      </button>
                    </div>

                    {timeTable.length === 0 ? (
                      <div className="text-center py-5">
                        <div
                          className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                          style={{ width: "80px", height: "80px" }}
                        >
                          <FaCalendar className="text-muted" size={40} />
                        </div>
                        <h6 className="mb-2">No class dates added yet</h6>
                        <p className="text-muted mb-4">
                          Start by adding class dates and schedules for your
                          course
                        </p>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={addTimeTable}
                        >
                          <FaPlus className="me-2" />
                          Add Your First Date
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <small className="text-muted">
                            {timeTable.length} class date
                            {timeTable.length !== 1 ? "s" : ""} scheduled
                          </small>
                        </div>
                        <div className="timetable-list">
                          {timeTable.map((entry, index) => (
                            <div
                              key={index}
                              className="card mb-3 border-start border-4 border-success"
                            >
                              <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start">
                                  <div className="flex-grow-1">
                                    <div className="d-flex align-items-center mb-2">
                                      <span className="badge bg-success me-2">
                                        Date {index + 1}
                                      </span>
                                      <h6 className="mb-0 fw-bold">
                                        {new Date(
                                          entry.date
                                        ).toLocaleDateString("en-US", {
                                          weekday: "long",
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </h6>
                                    </div>
                                    <div className="ps-4">
                                      {entry.description && (
                                        <p className="text-muted mb-1">
                                          <strong>Description:</strong>{" "}
                                          {entry.description}
                                        </p>
                                      )}
                                      {entry.time && (
                                        <p className="text-muted mb-0">
                                          <strong>Time:</strong> {entry.time}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="btn-group">
                                    <button
                                      type="button"
                                      className="btn btn-outline-primary btn-sm"
                                      onClick={() => editTimeTable(index)}
                                      title="Edit Date"
                                    >
                                      <FaEdit />
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() => deleteTimeTable(index)}
                                      title="Delete Date"
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

                    {/* TimeTable Form */}
                    {showTimeTableForm && (
                      <div className="card mt-4 border-success">
                        <div className="card-header bg-success text-white">
                          <h6 className="mb-0">
                            {editingTimeTableIndex !== null
                              ? "Edit Class Date"
                              : "Add New Class Date"}
                          </h6>
                        </div>
                        <div className="card-body">
                          <TimeTableForm
                            initialData={
                              editingTimeTableIndex !== null
                                ? timeTable[editingTimeTableIndex]
                                : undefined
                            }
                            onSave={saveTimeTable}
                            onCancel={() => setShowTimeTableForm(false)}
                          />
                        </div>
                      </div>
                    )}

                    <div className="d-flex justify-content-between mt-4">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={handleCancel}
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          handleStepSubmit({});
                        }}
                      >
                        Next Step
                      </button>
                    </div>
                  </div>
                )}

                {/* Regular Dynamic Form for other steps */}
                {currentStep !== 5 &&
                  currentStep !== 6 &&
                  currentStep !== 7 && (
                    <DynamicForm
                      config={getFormConfig(currentStep)}
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
