"use client";
import React from "react";

const Spinner: React.FC = () => {
  return (
    <div
      className="flex justify-center items-center"
      style={{ minHeight: "200px" }}
    >
      <div
        className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
