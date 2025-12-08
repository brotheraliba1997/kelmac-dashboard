"use client";
import React, { useState, useEffect } from "react";
import { useLoginUserMutation } from "@/app/redux/services/authApi";
import { useSelector } from "react-redux";
import logo from "@/app/assets/img/logo.png";
import { useRouter } from "next/navigation";
import { FaUserCircle, FaLock } from "react-icons/fa";
import Image from "next/image";
import { toast } from "react-toastify";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [loginUser, { isLoading, error }] = useLoginUserMutation();
  const { token, user } = useSelector((state: any) => state.auth);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // Auto redirect if already logged in
  useEffect(() => {
    if (token && user) router.push("/dashboard");
  }, [token, user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser({ email: form.email, password: form.password }).unwrap();
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(
        err?.data?.message || "Invalid credentials. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-600 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
          {/* Logo Section */}
          <div className="px-8 pt-8 pb-6 text-center bg-white">
            <div className="mb-6">
              <Image
                src={logo}
                alt="Logo"
                width={180}
                height={180}
                className="mx-auto"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-700 text-sm font-medium">
              Sign in to your account to continue
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="px-8 pb-8">
            {/* Email / Username */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserCircle className="text-gray-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-500" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-danger-50 border border-danger-200 text-danger-700 rounded-lg text-sm">
                Invalid credentials. Please check your email and password.
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-bold text-base rounded-lg focus:outline-none focus:ring-4 focus:ring-secondary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <span className="flex items-center justify-center text-white">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  <span className="text-white">Signing in...</span>
                </span>
              ) : (
                <span className="text-white">Sign In</span>
              )}
            </button>
          </form>
        </div>

        {/* Footer Text */}
        <div className="text-center mt-6">
          <p className="text-white text-sm">
            © 2025 Kelmac Dashboard. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
