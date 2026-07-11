import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { useAuth } from "../../context/AuthContext";

interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState<LoginFormValues>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validate(): LoginFormErrors {
    const next: LoginFormErrors = {};
    if (!form.email.trim()) next.email = "Enter your email address.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      next.email = "Enter a valid email address.";
    if (!form.password) next.password = "Enter your password.";
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
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      stubTitle="Employee Dashboard"
      stubSubtitle="Sign in to raise or track a ticket"
    >
      <h1 className="text-2xl font-bold text-[#1F2937]">Welcome back</h1>
      <p className="mt-1 text-sm text-[#64748B]">
        Log in with your company email to continue.
      </p>

      

      {serverError && (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
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
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-[#1F2937]">
              Password
            </label>
            <a href="/forgot-password" className="text-xs font-medium text-[#0D98BA] hover:text-[#0B7E9A]">
              Forgot password?
            </a>
          </div>
          <div className="relative mt-1.5">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full rounded-lg border px-3.5 py-2.5 pr-16 text-sm text-[#1F2937] outline-none transition focus:ring-2 focus:ring-[#0D98BA]/40 focus:border-[#0D98BA] ${
                errors.password ? "border-red-400" : "border-[#E2E8F0]"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#64748B] hover:text-[#1F2937]"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#0D98BA] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B7E9A] disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#64748B]">
        Don't have an account?{" "}
        <a href="/signup" className="font-medium text-[#0D98BA] hover:text-[#0B7E9A]">
          Sign up
        </a>
      </p>
    </AuthLayout>
  );
}
