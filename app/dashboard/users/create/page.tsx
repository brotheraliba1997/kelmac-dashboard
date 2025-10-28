"use client";

import { useCreateUserMutation } from "@/app/redux/services/userApi";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: { id: 0 }, // 👈 object form mein
    status: { id: 0 }, // 👈 object form mein
    provider: "email",
    socialId: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "role" || name === "status"
          ? { id: Number(value) } // 👈 string form mein id
          : value, // 👈 normal string for others
    }));
  };

  const [createUser, { isLoading: loading }] = useCreateUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      await createUser(formData).unwrap();
      router.push("/dashboard/users");
      setMessage("✅ User created successfully!");
      console.log("User created:", formData);

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: { id: 0 },
        status: { id: 0 },
        provider: "email",
        socialId: "",
      });
    } catch (error: any) {
      setMessage(`❌ ${error?.data?.message || "Failed to create user"}`);
    }
  };

  return (
    <div
      className="container py-5  "
      style={{ marginLeft: "240px", marginTop: "50px" }}
    >
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-8">
          <div className="card shadow border-0">
            <div className="card-header  text-black">
              <h5 className="mb-0">
                <i className="fas fa-user-plus me-2"></i>
                Create User
              </h5>
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit} className="row">
                {/* First Name */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-medium">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Last Name */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-medium">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email */}
                <div className="col-md-12 mb-3">
                  <label className="form-label fw-medium">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Password */}
                <div className="col-md-12 mb-3">
                  <label className="form-label fw-medium">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Role */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-medium">Role</label>
                  <select
                    className="form-select"
                    name="role"
                    value={formData.role?.id || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="1">Admin</option>
                    <option value="3">Instructor</option>
                    <option value="4">Corporate</option>
                    <option value="2">Student</option>
                  </select>
                </div>

                {/* Status */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-medium">Status</label>
                  <select
                    className="form-select"
                    name="status"
                    value={formData.status?.id || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="1">Active</option>
                    <option value="2">Pending</option>
                    <option value="3">Blocked</option>
                  </select>
                </div>

                {/* Provider */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-medium">Provider</label>
                  <select
                    className="form-select"
                    name="provider"
                    value={formData.provider}
                    onChange={handleChange}
                  >
                    <option value="email">Email</option>
                    <option value="google">Google</option>
                    <option value="facebook">Facebook</option>
                  </select>
                </div>

                {/* Social ID */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-medium">Social ID</label>
                  <input
                    type="text"
                    className="form-control"
                    name="socialId"
                    placeholder="Social ID (optional)"
                    value={formData.socialId}
                    onChange={handleChange}
                  />
                </div>

                {/* Submit Button */}
                <div className="col-md-12 mt-2 border-top pt-3 text-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary fw-semibold"
                  >
                    {isLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-2"></i>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>Submit
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Message */}
              {message && (
                <div
                  className={`alert mt-3 ${
                    message.includes("✅") ? "alert-success" : "alert-danger"
                  }`}
                >
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
