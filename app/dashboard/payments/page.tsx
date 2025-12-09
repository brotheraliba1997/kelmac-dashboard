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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Payments Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage Stripe payments and purchase orders
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("stripe")}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors font-medium ${
                activeTab === "stripe"
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <FaCreditCard />
              Stripe Payments
            </button>
            <button
              onClick={() => setActiveTab("purchase-orders")}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors font-medium ${
                activeTab === "purchase-orders"
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <FaFileAlt />
              Purchase Orders
            </button>
          </div>

          <div className="p-6">
            {/* Stripe Payments Tab */}
            {activeTab === "stripe" && <StripePaymentsTab />}

            {/* Purchase Orders Tab */}
            {activeTab === "purchase-orders" && <PurchaseOrdersTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
