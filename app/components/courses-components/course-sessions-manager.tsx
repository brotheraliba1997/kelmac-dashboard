"use client";
import React, { useState } from "react";
import DynamicForm, { DynamicFormConfig } from "../shared/DynamicForm";
import { FaPlus, FaTrash, FaEdit, FaClock, FaVideo } from "react-icons/fa";

// Session types matching the schema
export enum SessionTypeEnum {
  LECTURE = "lecture",
  INTRODUCTION = "introduction",
  BREAK = "break",
  LUNCH = "lunch",
  END_OF_DAY = "end_of_day",
}

interface Session {
  id?: string;
  title: string;
  description?: string;
  sessionType: string;
  startTime?: string;
  endTime?: string;
  videoUrl?: string;
  content?: string;
  duration: number;
  isFree: boolean;
  isBreak: boolean;
  topics: Array<{
    title: string;
    description?: string;
    isCompleted: boolean;
    order?: number;
  }>;
  resources: string[];
  color?: string;
  order: number;
  dayGroup?: string;
  dayNumber?: number;
}

interface CourseSessionsManagerProps {
  sessions: Session[];
  onSessionsChange: (sessions: Session[]) => void;
  disabled?: boolean;
}

export default function CourseSessionsManager({
  sessions,
  onSessionsChange,
  disabled = false,
}: CourseSessionsManagerProps) {
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [showForm, setShowForm] = useState(false);

  const sessionFormConfig: DynamicFormConfig = {
    title: editingSession ? "Edit Session" : "Add New Session",
    description: "Configure course session details",
    submitText: editingSession ? "Update Session" : "Add Session",
    cancelText: "Cancel",
    layout: "vertical",
    columns: 2,
    fields: [
      {
        name: "title",
        label: "Session Title",
        type: "text",
        placeholder: "Enter session title",
        validation: { required: true, maxLength: 200 },
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Session description",
        validation: { maxLength: 500 },
      },
      {
        name: "sessionType",
        label: "Session Type",
        type: "select",
        validation: { required: true },
        options: Object.values(SessionTypeEnum).map((type) => ({
          value: type,
          label:
            type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, " "),
        })),
        defaultValue: SessionTypeEnum.LECTURE,
      },
      {
        name: "duration",
        label: "Duration (minutes)",
        type: "number",
        placeholder: "60",
        validation: { required: true, min: 1 },
        defaultValue: 60,
      },
      {
        name: "startTime",
        label: "Start Time",
        type: "text",
        placeholder: "09:00 (HH:MM format)",
        validation: {
          pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        },
      },
      {
        name: "endTime",
        label: "End Time",
        type: "text",
        placeholder: "10:00 (HH:MM format)",
        validation: {
          pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        },
      },
      {
        name: "videoUrl",
        label: "Video URL",
        type: "url",
        placeholder: "https://example.com/video.mp4",
        icon: <FaVideo />,
      },
      {
        name: "content",
        label: "Session Content",
        type: "textarea",
        placeholder: "Detailed session content",
        validation: { maxLength: 2000 },
      },
      {
        name: "isFree",
        label: "Free Preview",
        type: "checkbox",
        defaultValue: false,
        description: "Allow free access to this session",
      },
      {
        name: "isBreak",
        label: "Break Session",
        type: "checkbox",
        defaultValue: false,
        description: "This is a break or lunch session",
      },
      {
        name: "dayGroup",
        label: "Day Group",
        type: "text",
        placeholder: "DAY 01",
        description: "Group sessions by day (e.g., DAY 01, DAY 02)",
      },
      {
        name: "dayNumber",
        label: "Day Number",
        type: "number",
        placeholder: "1",
        validation: { min: 1 },
        description: "Numeric day for sorting",
      },
      {
        name: "color",
        label: "Session Color",
        type: "color",
        defaultValue: "#007bff",
        description: "Color for session display",
      },
      {
        name: "resources",
        label: "Resources (URLs)",
        type: "textarea",
        placeholder: "Enter resource URLs (one per line)",
        description: "Enter each resource URL on a new line",
      },
    ],
  };

  const handleAddSession = () => {
    setEditingSession(null);
    setShowForm(true);
  };

  const handleEditSession = (session: Session) => {
    setEditingSession(session);
    setShowForm(true);
  };

  const handleDeleteSession = (sessionIndex: number) => {
    if (confirm("Are you sure you want to delete this session?")) {
      const updatedSessions = sessions.filter(
        (_, index) => index !== sessionIndex
      );
      onSessionsChange(updatedSessions);
    }
  };

  const handleFormSubmit = (data: Record<string, any>) => {
    const sessionData: Session = {
      title: data.title,
      description: data.description,
      sessionType: data.sessionType || SessionTypeEnum.LECTURE,
      startTime: data.startTime,
      endTime: data.endTime,
      videoUrl: data.videoUrl,
      content: data.content,
      duration: Number(data.duration) || 60,
      isFree: data.isFree || false,
      isBreak: data.isBreak || false,
      topics: [], // Will be managed separately
      resources: data.resources
        ? data.resources.split("\n").filter((url: string) => url.trim())
        : [],
      color: data.color,
      order: editingSession ? editingSession.order : sessions.length,
      dayGroup: data.dayGroup,
      dayNumber: data.dayNumber ? Number(data.dayNumber) : undefined,
    };

    let updatedSessions: Session[];
    if (editingSession) {
      const sessionIndex = sessions.findIndex(
        (s, index) =>
          s.id === editingSession.id || index === editingSession.order
      );
      updatedSessions = [...sessions];
      updatedSessions[sessionIndex] = { ...sessionData, order: sessionIndex };
    } else {
      updatedSessions = [...sessions, sessionData];
    }

    onSessionsChange(updatedSessions);
    setShowForm(false);
    setEditingSession(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingSession(null);
  };

  const moveSession = (fromIndex: number, toIndex: number) => {
    const updatedSessions = [...sessions];
    const [movedSession] = updatedSessions.splice(fromIndex, 1);
    updatedSessions.splice(toIndex, 0, movedSession);

    // Update order numbers
    updatedSessions.forEach((session, index) => {
      session.order = index;
    });

    onSessionsChange(updatedSessions);
  };

  const getFormInitialData = () => {
    if (!editingSession) return {};

    return {
      title: editingSession.title,
      description: editingSession.description,
      sessionType: editingSession.sessionType,
      duration: editingSession.duration,
      startTime: editingSession.startTime,
      endTime: editingSession.endTime,
      videoUrl: editingSession.videoUrl,
      content: editingSession.content,
      isFree: editingSession.isFree,
      isBreak: editingSession.isBreak,
      dayGroup: editingSession.dayGroup,
      dayNumber: editingSession.dayNumber,
      color: editingSession.color,
      resources: editingSession.resources.join("\n"),
    };
  };

  if (showForm) {
    return (
      <div className="card">
        <div className="card-body">
          <DynamicForm
            config={sessionFormConfig}
            initialData={getFormInitialData()}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="course-sessions-manager">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">Course Sessions ({sessions.length})</h5>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={handleAddSession}
          disabled={disabled}
        >
          <FaPlus className="me-1" />
          Add Session
        </button>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-4">
          <FaClock className="text-muted mb-3" size={48} />
          <p className="text-muted mb-3">No sessions added yet</p>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={handleAddSession}
            disabled={disabled}
          >
            <FaPlus className="me-1" />
            Add Your First Session
          </button>
        </div>
      ) : (
        <div className="sessions-list">
          {sessions.map((session, index) => (
            <div key={index} className="card mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-2">
                      {session.color && (
                        <div
                          className="me-2"
                          style={{
                            width: "12px",
                            height: "12px",
                            backgroundColor: session.color,
                            borderRadius: "50%",
                          }}
                        />
                      )}
                      <h6 className="mb-0">{session.title}</h6>
                      <span className="badge bg-secondary ms-2">
                        {session.sessionType.replace(/_/g, " ")}
                      </span>
                      {session.isFree && (
                        <span className="badge bg-success ms-1">Free</span>
                      )}
                    </div>

                    {session.description && (
                      <p className="text-muted mb-2 small">
                        {session.description}
                      </p>
                    )}

                    <div className="row small text-muted">
                      <div className="col-md-6">
                        <FaClock className="me-1" />
                        {session.duration} minutes
                        {session.startTime && session.endTime && (
                          <span className="ms-2">
                            ({session.startTime} - {session.endTime})
                          </span>
                        )}
                      </div>
                      <div className="col-md-6">
                        {session.dayGroup && (
                          <span className="me-2">{session.dayGroup}</span>
                        )}
                        {session.resources.length > 0 && (
                          <span>{session.resources.length} resources</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    {index > 0 && (
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => moveSession(index, index - 1)}
                        disabled={disabled}
                        title="Move up"
                      >
                        ↑
                      </button>
                    )}
                    {index < sessions.length - 1 && (
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => moveSession(index, index + 1)}
                        disabled={disabled}
                        title="Move down"
                      >
                        ↓
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleEditSession(session)}
                      disabled={disabled}
                    >
                      <FaEdit />
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDeleteSession(index)}
                      disabled={disabled}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
