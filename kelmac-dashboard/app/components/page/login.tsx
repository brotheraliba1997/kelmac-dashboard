"use client";
import React, { useState, useEffect } from "react";
import { useLoginUserMutation } from "@/app/redux/services/authApi";
import { useSelector } from "react-redux";

import { useRouter } from "next/navigation";
import { FaUserCircle, FaLock, FaShieldAlt } from "react-icons/fa";


const LoginPage: React.FC = () => {
  const router = useRouter();
  const [loginUser, { isLoading, error }] = useLoginUserMutation();
  const { tokens, user } = useSelector((state: any) => state.auth);

  const [form, setForm] = useState({
    email: "",
    password: "",
    agencyCode: "",
  });

  // Auto redirect if already logged in
  useEffect(() => {
    if (tokens && user) router.push("/dashboard");
  }, [tokens, user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser({ email: form.email, password: form.password }).unwrap();
      router.push("/dashboard");
    } catch (err: any) {
      console.log("Login error:", err);
    }
  };

  return (
    <div className="newloginbg">
      <div className="login-section">
        <div className="container">
          <div
            className="row align-items-center justify-content-around"
            style={{ height: "100vh" }}
          >
            <div className="col-lg-4 col-md-6 col-sm-12">
              <div className="login-card">
                <div className="loginlogo mb-3 text-center">
                  <a href="#">
                    <img src="assets/img/logo.png" alt="Logo" />
                  </a>
                </div>

                <form onSubmit={handleSubmit} className="row p-4 pt-0">
                  {/* Email / Username */}
                  <div className="col-md-12">
                    <label className="form-label">Username/Email</label>
                    <div className="input-group mb-3">
                      <span className="input-group-text rounded-1">
                        <FaUserCircle />
                      </span>
                      <input
                        type="text"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="form-control rounded-1"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="col-md-12">
                    <label className="form-label">Password</label>
                    <div className="input-group mb-3">
                      <span className="input-group-text rounded-1">
                        <FaLock />
                      </span>
                      <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="form-control rounded-1"
                        placeholder="Enter password"
                        required
                      />
                    </div>
                  </div>

                  {/* Agency Code */}
                  <div className="col-md-12">
                    <label className="form-label">Agency Code</label>
                    <div className="input-group mb-2">
                      <span className="input-group-text rounded-1">
                        <FaShieldAlt />
                      </span>
                      <input
                        type="text"
                        name="agencyCode"
                        value={form.agencyCode}
                        onChange={handleChange}
                        className="form-control rounded-1"
                        placeholder="Agency Code"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="col-md-12">
                    <div className="d-grid mb-3">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-dark rounded-1"
                      >
                        {isLoading ? "Logging in..." : "Login"}
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="text-danger text-center">
                      Invalid credentials
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
