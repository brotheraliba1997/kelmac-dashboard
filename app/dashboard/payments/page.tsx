"use client";

import { useState } from "react";
import {
  FaCreditCard,
  FaFileAlt,
  FaHome,
  FaChevronRight,
  FaDollarSign,
} from "react-icons/fa";
import StripePaymentsTab from "@/app/components/payments/StripePaymentsTab";
import PurchaseOrdersTab from "@/app/components/payments/PurchaseOrdersTab";

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<"stripe" | "purchase-orders">(
    "stripe"
  );

  return (
    <div className="content container-fluid">
      {/* Page Header */}
      <div className="page-header mb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <FaDollarSign className="mr-3 text-blue-600" />
          Payments Management
        </h1>
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a
                href="/dashboard"
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                <FaHome className="mr-2" />
                Dashboard
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <FaChevronRight className="w-3 h-3 text-gray-400 mx-1" />
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 flex items-center">
                  <FaDollarSign className="mr-1" />
                  Payments
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("stripe")}
              className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "stripe"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <FaCreditCard className="mr-2" />
              Stripe Payments
            </button>
            <button
              onClick={() => setActiveTab("purchase-orders")}
              className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "purchase-orders"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <FaFileAlt className="mr-2" />
              Purchase Orders
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Stripe Payments Tab */}
          {activeTab === "stripe" && <StripePaymentsTab />}

          {/* Purchase Orders Tab */}
          {activeTab === "purchase-orders" && <PurchaseOrdersTab />}
        </div>
      </div>
    </div>
  );
}
