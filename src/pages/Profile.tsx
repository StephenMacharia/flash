import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface EditProfileValues {
  fullName: string;
  email: string;
}

interface EditProfileErrors {
  fullName?: string;
  email?: string;
}

interface PasswordValues {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface PasswordErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

export default function Profile() {
  const { currentUser, updateProfile, changePassword } = useAuth();

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-[#F4F7F8] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Top nav */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[#64748B]">
              National Treasury
            </div>
            <div className="text-sm font-bold text-[#1F2937]">My Profile</div>
          </div>
          <Link
            to="/dashboard"
            className="text-sm font-medium text-[#64748B] hover:text-[#1F2937]"
          >
            Back to dashboard
          </Link>
        </div>

        {/* Header banner */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#0D98BA] to-[#086A82] p-6 text-white sm:flex-row sm:items-center">
          <div>
            <div className="text-sm font-medium text-teal-50/90">Account settings</div>
            <div className="mt-1 text-2xl font-bold">{currentUser.fullName}</div>
            <div className="mt-1 text-sm text-teal-50/80">
              {currentUser.department} · {currentUser.email}
            </div>
          </div>
        </div>

        {/* Two column layout */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <UserInformationCard />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <EditProfileCard />
            <ChangePasswordCard />
          </div>
        </div>
      </div>
    </div>
  );
}

function UserInformationCard() {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-base font-bold text-[#1F2937]">User Information</h2>
      <p className="mt-1 text-sm text-[#64748B]">Your account details on file.</p>

      <div className="mt-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#1F2937]">Full Name</label>
          <input
            type="text"
            value={currentUser.fullName}
            disabled
            readOnly
            className="mt-1.5 w-full cursor-not-allowed rounded-lg border border-[#E2E8F0] bg-[#F4F7F8] px-3.5 py-2.5 text-sm text-[#64748B] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1F2937]">Email Address</label>
          <input
            type="email"
            value={currentUser.email}
            disabled
            readOnly
            className="mt-1.5 w-full cursor-not-allowed rounded-lg border border-[#E2E8F0] bg-[#F4F7F8] px-3.5 py-2.5 text-sm text-[#64748B] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1F2937]">Department</label>
          <input
            type="text"
            value={currentUser.department}
            disabled
            readOnly
            className="mt-1.5 w-full cursor-not-allowed rounded-lg border border-[#E2E8F0] bg-[#F4F7F8] px-3.5 py-2.5 text-sm text-[#64748B] outline-none"
          />
        </div>
      </div>
    </div>
  );
}

function EditProfileCard() {
  const { currentUser, updateProfile } = useAuth();

  const [form, setForm] = useState<EditProfileValues>({
    fullName: currentUser?.fullName ?? "",
    email: currentUser?.email ?? "",
  });
  const [errors, setErrors] = useState<EditProfileErrors>({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!currentUser) return null;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setSuccessMessage("");
  }

  function validate(): EditProfileErrors {
    const next: EditProfileErrors = {};
    if (!form.fullName.trim()) next.fullName = "Enter your full name.";
    if (!form.email.trim()) next.email = "Enter your email address.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      next.email = "Enter a valid email address.";
    return next;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setLoading(true);
    try {
      await updateProfile({ fullName: form.fullName, email: form.email });
      setSuccessMessage("Profile updated successfully.");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-base font-bold text-[#1F2937]">Edit Profile</h2>
      <p className="mt-1 text-sm text-[#64748B]">Update your name and email address.</p>

      {successMessage && (
        <div
          role="status"
          className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          {successMessage}
        </div>
      )}

      {serverError && (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-5">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-[#1F2937]">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            value={form.fullName}
            onChange={handleChange}
            className={`mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-sm text-[#1F2937] outline-none transition focus:ring-2 focus:ring-[#0D98BA]/40 focus:border-[#0D98BA] ${
              errors.fullName ? "border-red-400" : "border-[#E2E8F0]"
            }`}
          />
          {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#1F2937]">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            className={`mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-sm text-[#1F2937] outline-none transition focus:ring-2 focus:ring-[#0D98BA]/40 focus:border-[#0D98BA] ${
              errors.email ? "border-red-400" : "border-[#E2E8F0]"
            }`}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1F2937]">Department</label>
          <input
            type="text"
            value={currentUser.department}
            disabled
            readOnly
            className="mt-1.5 w-full cursor-not-allowed rounded-lg border border-[#E2E8F0] bg-[#F4F7F8] px-3.5 py-2.5 text-sm text-[#64748B] outline-none"
          />
          <p className="mt-1 text-xs text-[#64748B]">
            Department cannot be changed. Contact ICT to update this field.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[#0D98BA] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B7E9A] disabled:opacity-60"
        >
          {loading ? "Updating…" : "Update Profile"}
        </button>
      </form>
    </div>
  );
}

function ChangePasswordCard() {
  const { changePassword } = useAuth();

  const [form, setForm] = useState<PasswordValues>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [errors, setErrors] = useState<PasswordErrors>({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setSuccessMessage("");
  }

  function validate(): PasswordErrors {
    const next: PasswordErrors = {};
    if (!form.currentPassword) next.currentPassword = "Enter your current password.";
    if (!form.newPassword) next.newPassword = "Choose a new password.";
    else if (form.newPassword.length < 8) next.newPassword = "Use at least 8 characters.";
    if (form.confirmNewPassword !== form.newPassword)
      next.confirmNewPassword = "Passwords don't match.";
    return next;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setLoading(true);
    try {
      await changePassword(form.currentPassword, form.newPassword);
      setSuccessMessage("Password changed successfully.");
      setForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-base font-bold text-[#1F2937]">Change Password</h2>
      <p className="mt-1 text-sm text-[#64748B]">
        Choose a strong password you don't use elsewhere.
      </p>

      {successMessage && (
        <div
          role="status"
          className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          {successMessage}
        </div>
      )}

      {serverError && (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-5">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-[#1F2937]">
            Current Password
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            value={form.currentPassword}
            onChange={handleChange}
            placeholder="••••••••"
            className={`mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-sm text-[#1F2937] outline-none transition focus:ring-2 focus:ring-[#0D98BA]/40 focus:border-[#0D98BA] ${
              errors.currentPassword ? "border-red-400" : "border-[#E2E8F0]"
            }`}
          />
          {errors.currentPassword && (
            <p className="mt-1 text-xs text-red-600">{errors.currentPassword}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-[#1F2937]">
              New Password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="At least 8 characters"
              className={`mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-sm text-[#1F2937] outline-none transition focus:ring-2 focus:ring-[#0D98BA]/40 focus:border-[#0D98BA] ${
                errors.newPassword ? "border-red-400" : "border-[#E2E8F0]"
              }`}
            />
            {errors.newPassword && (
              <p className="mt-1 text-xs text-red-600">{errors.newPassword}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmNewPassword"
              className="block text-sm font-medium text-[#1F2937]"
            >
              Confirm New Password
            </label>
            <input
              id="confirmNewPassword"
              name="confirmNewPassword"
              type="password"
              autoComplete="new-password"
              value={form.confirmNewPassword}
              onChange={handleChange}
              placeholder="Re-enter new password"
              className={`mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-sm text-[#1F2937] outline-none transition focus:ring-2 focus:ring-[#0D98BA]/40 focus:border-[#0D98BA] ${
                errors.confirmNewPassword ? "border-red-400" : "border-[#E2E8F0]"
              }`}
            />
            {errors.confirmNewPassword && (
              <p className="mt-1 text-xs text-red-600">{errors.confirmNewPassword}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[#0D98BA] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B7E9A] disabled:opacity-60"
        >
          {loading ? "Changing…" : "Change Password"}
        </button>
      </form>
    </div>
  );
}
