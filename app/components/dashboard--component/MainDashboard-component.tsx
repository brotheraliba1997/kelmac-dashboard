"use client";
import React from "react";
import {
  FaUsers,
  FaBuilding,
  FaUserCheck,
  FaVideo,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaTrophy,
} from "react-icons/fa";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function MainDashboardcomponent() {
  // Sample data for charts
  const enrollmentData = [
    { month: "Jan", students: 45, courses: 12 },
    { month: "Feb", students: 52, courses: 15 },
    { month: "Mar", students: 48, courses: 14 },
    { month: "Apr", students: 61, courses: 18 },
    { month: "May", students: 70, courses: 20 },
    { month: "Jun", students: 85, courses: 22 },
  ];

  const courseStatusData = [
    { name: "Active", value: 45, color: "#3b82f6" },
    { name: "Completed", value: 30, color: "#22c55e" },
    { name: "Pending", value: 15, color: "#f59e0b" },
    { name: "Cancelled", value: 10, color: "#ef4444" },
  ];

  const revenueData = [
    { month: "Jan", revenue: 12000 },
    { month: "Feb", revenue: 15000 },
    { month: "Mar", revenue: 13500 },
    { month: "Apr", revenue: 18000 },
    { month: "May", revenue: 21000 },
    { month: "Jun", revenue: 24000 },
  ];

  const stats = [
    {
      title: "Total Students",
      count: "245",
      icon: FaUsers,
      color: "bg-blue-500",
      change: "+12%",
    },
    {
      title: "Active Courses",
      count: "42",
      icon: FaGraduationCap,
      color: "bg-green-500",
      change: "+8%",
    },
    {
      title: "Instructors",
      count: "18",
      icon: FaChalkboardTeacher,
      color: "bg-purple-500",
      change: "+3%",
    },
    {
      title: "Enrollments",
      count: "156",
      icon: FaCalendarAlt,
      color: "bg-orange-500",
      change: "+15%",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with your courses today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    {stat.title}
                  </p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.count}
                  </h3>
                  <p className="text-sm text-green-600 font-medium mt-2">
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`${stat.color} p-4 rounded-xl`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Enrollment Trends */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Enrollment Trends
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={enrollmentData}>
                <defs>
                  <linearGradient
                    id="colorStudents"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="students"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorStudents)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Course Status Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Course Status Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={courseStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) =>
                    percent && name
                      ? `${name}: ${(percent * 100).toFixed(0)}%`
                      : name || ""
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {courseStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Revenue Overview
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
                formatter={(value: any) => `$${value.toLocaleString()}`}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#22c55e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[
              {
                name: "John Doe",
                action: "enrolled in",
                course: "Web Development Bootcamp",
                time: "2 hours ago",
                color: "bg-blue-100 text-blue-800",
              },
              {
                name: "Jane Smith",
                action: "completed",
                course: "Digital Marketing",
                time: "5 hours ago",
                color: "bg-green-100 text-green-800",
              },
              {
                name: "Mike Johnson",
                action: "started",
                course: "Data Science Basics",
                time: "1 day ago",
                color: "bg-purple-100 text-purple-800",
              },
              {
                name: "Sarah Williams",
                action: "enrolled in",
                course: "UI/UX Design",
                time: "2 days ago",
                color: "bg-orange-100 text-orange-800",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-linear-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                    {activity.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">{activity.name}</span>{" "}
                      {activity.action}{" "}
                      <span className="font-semibold">{activity.course}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${activity.color}`}
                >
                  {activity.action}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainDashboardcomponent;
