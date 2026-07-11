import React, { useState } from "react";
import type { TicketPriority } from "../types";

interface RaiseTicketModalProps {
  onClose: () => void;
  onSubmit: (input: { issue: string; category: string; priority: TicketPriority }) => void;
}

const CATEGORIES = ["Network", "Software", "Hardware", "Access", "Other"];
const PRIORITIES: TicketPriority[] = ["Low", "Medium", "High"];

export default function RaiseTicketModal({ onClose, onSubmit }: RaiseTicketModalProps) {
  const [issue, setIssue] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [priority, setPriority] = useState<TicketPriority>("Medium");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!issue.trim()) {
      setError("Describe the issue you're facing.");
      return;
    }
    onSubmit({ issue: issue.trim(), category, priority });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1F2937]">Raise a ticket</h2>
          <button
            onClick={onClose}
            className="text-[#64748B] hover:text-[#1F2937] text-xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1F2937]">Issue</label>
            <textarea
              value={issue}
              onChange={(e) => {
                setIssue(e.target.value);
                setError("");
              }}
              rows={3}
              placeholder="Briefly describe what's going wrong"
              className={`mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-sm text-[#1F2937] outline-none transition focus:ring-2 focus:ring-[#0D98BA]/40 focus:border-[#0D98BA] ${
                error ? "border-red-400" : "border-[#E2E8F0]"
              }`}
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1F2937]">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2.5 text-sm text-[#1F2937] outline-none transition focus:ring-2 focus:ring-[#0D98BA]/40 focus:border-[#0D98BA]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2937]">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TicketPriority)}
                className="mt-1.5 w-full rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2.5 text-sm text-[#1F2937] outline-none transition focus:ring-2 focus:ring-[#0D98BA]/40 focus:border-[#0D98BA]"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-[#E2E8F0] px-4 py-2.5 text-sm font-semibold text-[#1F2937] transition hover:bg-[#F4F7F8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-[#0D98BA] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B7E9A]"
            >
              Submit ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
