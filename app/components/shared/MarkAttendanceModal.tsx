"use client";
import React, { use, useState } from "react";
import { useSelector } from "react-redux";
import Modal from "./Modal";
import { useMarkIndividualAssigmentMutation } from "@/app/redux/services/attendanceApi";

interface MarkAttendanceModalProps {
  show: boolean;
  onClose: () => void;
  classScheduleId: string;
  courseId: string;
  sessionId: string;
  studentId: string;
  studentName?: string;
  onSuccess?: () => void;
  setSelectedStudentForMarking: (student: any) => void;
}

const MarkAttendanceModal: React.FC<MarkAttendanceModalProps> = ({
  show,
  onClose,
  classScheduleId,
  courseId,
  sessionId,
  studentId,
  studentName = "Student",
  onSuccess,
  setSelectedStudentForMarking,
}) => {
  const { user } = useSelector((state: any) => state.auth);
  const [markAttendance, { isLoading }] = useMarkIndividualAssigmentMutation();

  const [formData, setFormData] = useState({
    marks: 1,
    notes: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "marks" ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        classScheduleId,
        courseId,
        sessionId,
        studentId,
        markedBy: user?._id || user?.id || "",
        marks: formData.marks,
        notes: formData.notes || undefined,
      };

      await markAttendance(payload).unwrap();
      setSelectedStudentForMarking((prev: any) => [...prev, studentId]);
      setFormData({ marks: 0, notes: "" });
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Error marking attendance:", error);
      alert(
        error?.data?.message || error?.message || "Failed to mark attendance"
      );
    }
  };

  return (
    <Modal
      title={`Mark Attendance - ${studentName}`}
      show={show}
      onClose={onClose}
      onConfirm={handleSubmit}
      confirmText={isLoading ? "Submitting..." : "Submit"}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marks <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="marks"
            value={formData.marks}
            onChange={handleInputChange}
            disabled={isLoading}
            min="1"
            max="10"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none disabled:bg-gray-100"
            placeholder="Enter marks (1-10)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            disabled={isLoading}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none disabled:bg-gray-100"
            placeholder="e.g., Student arrived 10 minutes late"
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Info:</span> This will mark
            attendance for <span className="font-medium">{studentName}</span> in
            the selected session.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default MarkAttendanceModal;
