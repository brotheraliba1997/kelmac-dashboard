"use client";
import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  accept?: string;
  maxSize?: number; // in MB
  preview?: string | null;
  disabled?: boolean;
  label?: string;
  helperText?: string;
  className?: string;
  autoUpload?: boolean; // Auto upload to server
  uploadUrl?: string; // Upload API endpoint
  onUploadSuccess?: (url: string) => void; // Callback with uploaded URL
  onUploadError?: (error: any) => void; // Callback on upload error
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onFileSelect,
  onFileRemove,
  accept = "image/*",
  maxSize = 5,
  preview = null,
  disabled = false,
  label = "Upload Image",
  helperText = "PNG, JPG, JPEG",
  className = "",
  autoUpload = false,
  uploadUrl = "http://localhost:5000/api/v1/files/upload",
  onUploadSuccess,
  onUploadError,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return false;
    }

    // Validate file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSize) {
      toast.error(`File size should not exceed ${maxSize}MB`);
      return false;
    }

    return true;
  };

  // Upload file to server
  const uploadFileToServer = async (file: File) => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Get token from localStorage
      //   const token =  localStorage.getItem("token");
      const token = localStorage.getItem("token");
      console.log("Uploading file with token:", token);
      const response = await axios.post(uploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token && { Authorization: `Bearer ${JSON.parse(token)}` }),
        },
      });
      console.log("Upload response:", response);
      let uploadedUrl = response.data?.file?.path || response.data?.path;

      // Remove /tmp prefix if present
      if (uploadedUrl && uploadedUrl.startsWith("/tmp/")) {
        uploadedUrl = uploadedUrl.replace("/tmp/", "");
      }

      const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/files/${uploadedUrl}`;
      if (!uploadedUrl) {
        throw new Error("Upload failed - no URL returned");
      }

      toast.success("File uploaded successfully!");

      if (onUploadSuccess) {
        onUploadSuccess(baseUrl);
      }

      return baseUrl;
    } catch (error: any) {
      console.error("Upload error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to upload file";
      toast.error(errorMessage);

      if (onUploadError) {
        onUploadError(error);
      }

      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setUploadedFileName(file.name);
      setUploadedFileSize(file.size);
      onFileSelect(file);

      // Auto upload if enabled
      if (autoUpload) {
        await uploadFileToServer(file);
      }
    }
    // Reset input value to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file)) {
      setUploadedFileName(file.name);
      setUploadedFileSize(file.size);
      onFileSelect(file);

      // Auto upload if enabled
      if (autoUpload) {
        await uploadFileToServer(file);
      }
    }
  };

  const handleRemove = () => {
    setUploadedFileName(null);
    setUploadedFileSize(null);
    if (onFileRemove) {
      onFileRemove();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const openFileDialog = () => {
    if (!disabled && !isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {!preview ? (
        <div
          onClick={openFileDialog}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative flex flex-col items-center justify-center w-full h-48 
            border-2 border-dashed rounded-lg cursor-pointer transition-all
            ${
              isDragging
                ? "border-secondary bg-secondary/5 scale-[1.02]"
                : "border-gray-300 bg-gray-50 hover:bg-gray-100"
            }
            ${disabled || isUploading ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          {/* Upload Icon or Loading Spinner */}
          {isUploading ? (
            <svg
              className="w-12 h-12 mb-3 text-blue-600 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              className={`w-12 h-12 mb-3 transition-colors ${
                isDragging ? "text-secondary" : "text-gray-400"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          )}

          {/* Text */}
          <div className="text-center px-4">
            <p className="text-sm text-gray-700 font-medium mb-1">
              {isUploading
                ? "Uploading..."
                : isDragging
                ? "Drop to upload"
                : `Click to ${label.toLowerCase()}`}
            </p>
            {!isUploading && (
              <>
                <p className="text-xs text-gray-500">or drag and drop</p>
                <p className="text-xs text-gray-400 mt-2">
                  {helperText} (MAX. {maxSize}MB)
                </p>
              </>
            )}
          </div>

          {/* Drag Overlay */}
          {isDragging && (
            <div className="absolute inset-0 bg-secondary/10 rounded-lg pointer-events-none" />
          )}
        </div>
      ) : (
        <div className="relative">
          {/* Image Preview */}
          <div className="relative w-full h-56 rounded-lg overflow-hidden border border-gray-300 bg-gray-100">
            <img
              src={preview}
              alt="Upload preview"
              className="w-full h-full object-contain"
            />

            {/* Remove Button */}
            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg group"
                title="Remove image"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}

            {/* Change/Replace Button */}
            {!disabled && (
              <button
                type="button"
                onClick={openFileDialog}
                className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1.5 rounded-lg hover:bg-white transition-colors shadow-md text-sm font-medium border border-gray-200"
              >
                Change
              </button>
            )}
          </div>

          {/* File Info */}
          {uploadedFileName && (
            <div className="mt-3 flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <svg
                  className="w-5 h-5 text-gray-400 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-gray-700 truncate flex-1">
                  {uploadedFileName}
                </span>
              </div>
              {uploadedFileSize && (
                <span className="text-xs text-gray-500 ml-3 shrink-0">
                  {formatFileSize(uploadedFileSize)}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
