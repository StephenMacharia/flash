import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { useAuth } from "../../context/AuthContext";
import { DEPARTMENTS } from "../../data/dummyUsers";

interface SignUpFormValues {
  fullName: string;
  email: string;
  department: string;
  password: string;
  confirmPassword: string;
}

interface SignUpFormErrors {
  fullName?: string;
  email?: string;
  department?: string;
  password?: string;
  confirmPassword?: string;
}

export default function SignUpForm() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [form, setForm] = useState<SignUpFormValues>({
    fullName: "",
    email: "",
    department: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<SignUpFormErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validate(): SignUpFormErrors {
    const next: SignUpFormErrors = {};
    if (!form.fullName.trim()) next.fullName = "Enter your full name.";
    if (!form.email.trim()) next.email = "Enter your email address.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      next.email = "Enter a valid email address.";
    if (!form.department) next.department = "Select your department.";
    if (!form.password) next.password = "Choose a password.";
    else if (form.password.length < 8) next.password = "Use at least 8 characters.";
    if (form.confirmPassword !== form.password)
      next.confirmPassword = "Passwords don't match.";
    return next;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError("");
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setLoading(true);
    try {
      await signup({
        fullName: form.fullName,
        email: form.email,
        department: form.department,
        password: form.password,
      });
      navigate("/dashboard");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      stubTitle="New Employee"
      stubSubtitle="Register to raise your first ticket"
    >
      <h1 className="text-2xl font-bold text-[#1F2937]">Create your account</h1>
      <p className="mt-1 text-sm text-[#64748B]">
        Use your company email to register for the Help Desk.
      </p>

      {serverError && (
        <div
          role="alert"
          className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-[#1F2937]">
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            value={form.fullName}
            onChange={handleChange}
            placeholder="employee name"
            className={`mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-sm text-[#1F2937] outline-none transition focus:ring-2 focus:ring-[#0D98BA]/40 focus:border-[#0D98BA] ${
              errors.fullName ? "border-red-400" : "border-[#E2E8F0]"
            }`}
          />
          {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#1F2937]">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder="jane.doe@treasury.go.ke"
            className={`mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-sm text-[#1F2937] outline-none transition focus:ring-2 focus:ring-[#0D98BA]/40 focus:border-[#0D98BA] ${
              errors.email ? "border-red-400" : "border-[#E2E8F0]"
            }`}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="department" className="block text-sm font-medium text-[#1F2937]">
            Department
          </label>
          <select
            id="department"
            name="department"
            value={form.department}
            onChange={handleChange}
            className={`mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-[#1F2937] outline-none transition focus:ring-2 focus:ring-[#0D98BA]/40 focus:border-[#0D98BA] ${
              errors.department ? "border-red-400" : "border-[#E2E8F0]"
            }`}
          >
            <option value="" disabled>
              Select department
            </option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          {errors.department && <p className="mt-1 text-xs text-red-600">{errors.department}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#1F2937]">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              className={`mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-sm text-[#1F2937] outline-none transition focus:ring-2 focus:ring-[#0D98BA]/40 focus:border-[#0D98BA] ${
                errors.password ? "border-red-400" : "border-[#E2E8F0]"
              }`}
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#1F2937]">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              className={`mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-sm text-[#1F2937] outline-none transition focus:ring-2 focus:ring-[#0D98BA]/40 focus:border-[#0D98BA] ${
                errors.confirmPassword ? "border-red-400" : "border-[#E2E8F0]"
              }`}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#0D98BA] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B7E9A] disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#64748B]">
        Already have an account?{" "}
        <a href="/login" className="font-medium text-[#0D98BA] hover:text-[#0B7E9A]">
          Log in
        </a>
      </p>
    </AuthLayout>
  );
}
