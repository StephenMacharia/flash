import React, { useState, useRef, useCallback } from "react";
import type { TicketPriority, ImpactLevel, Attachment } from "../types";

interface RaiseTicketModalProps {
  onClose: () => void;
  onSubmit: (input: {
    title: string;
    description: string;
    category: string;
    subcategory: string;
    priority: TicketPriority;
    impactLevel: ImpactLevel;
    attachments: Attachment[];
  }) => void;
}

// Category definitions with subcategories
const CATEGORY_DATA = {
  "Software & Apps": {
    icon: "💻",
    color: "#0D98BA",
    subcategories: [
      "Email Client",
      "Office Suite",
      "Collaboration Tools",
      "Browser",
      "Other",
    ],
  },
  "Network & Internet": {
    icon: "📡",
    color: "#0D98BA",
    subcategories: [
      "Wi-Fi Connection",
      "VPN",
      "Slow Connection",
      "DNS Issues",
      "Other",
    ],
  },
  "Hardware & Devices": {
    icon: "🖥️",
    color: "#0D98BA",
    subcategories: [
      "Monitor",
      "Printer",
      "Keyboard/Mouse",
      "Laptop/Desktop",
      "Other",
    ],
  },
  "Security & Access": {
    icon: "🔒",
    color: "#0D98BA",
    subcategories: [
      "Login Issues",
      "Permission Access",
      "Password Reset",
      "Two-Factor Auth",
      "Other",
    ],
  },
};

const IMPACT_LEVELS: Array<{
  value: ImpactLevel;
  label: string;
  color: string;
  description: string;
}> = [
  {
    value: "Just Me",
    label: "Just Me",
    color: "bg-green-50 border-green-300",
    description: "It's affecting only my workflow, I have a workaround.",
  },
  {
    value: "My Team",
    label: "My Team",
    color: "bg-amber-50 border-amber-300",
    description: "It's blocking a group or department from completing tasks.",
  },
  {
    value: "System-Wide",
    label: "System-Wide / Critical",
    color: "bg-red-50 border-red-300",
    description:
      "Core campus/office network or vital system is completely down.",
  },
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "application/pdf",
  "text/plain",
  "application/zip",
];

export default function RaiseTicketModal({
  onClose,
  onSubmit,
}: RaiseTicketModalProps) {
  const [activeCategory, setActiveCategory] =
    useState<string>("Software & Apps");
  const [activeImpact, setActiveImpact] = useState<ImpactLevel>("Just Me");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subcategory, setSubcategory] = useState(
    CATEGORY_DATA["Software & Apps"].subcategories[0],
  );
  const [priority, setPriority] = useState<TicketPriority>("Medium");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successTicketId, setSuccessTicketId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setSubcategory(
      CATEGORY_DATA[category as keyof typeof CATEGORY_DATA].subcategories[0],
    );
    setErrors({ ...errors, category: "" });
  };

  const handleImpactChange = (impact: ImpactLevel) => {
    setActiveImpact(impact);
    setErrors({ ...errors, impact: "" });
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateAndAddFiles = (files: FileList) => {
    const newAttachments: Attachment[] = [];
    const newErrors: Record<string, string> = { ...errors };
    delete newErrors.attachments;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.size > MAX_FILE_SIZE) {
        newErrors.attachments = `${file.name} exceeds 50MB limit`;
        continue;
      }

      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        newErrors.attachments = `${file.name} has unsupported file type`;
        continue;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        newAttachments.push({
          name: file.name,
          size: file.size,
          type: file.type,
          data: e.target?.result as string,
        });
        setAttachments((prev) => [...prev, ...newAttachments]);
      };
      reader.readAsArrayBuffer(file);
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      validateAndAddFiles(e.target.files);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Issue title is required";
    }

    if (!description.trim()) {
      newErrors.description = "Detailed description is required";
    }

    if (!activeCategory) {
      newErrors.category = "Please select a category";
    }

    if (!activeImpact) {
      newErrors.impact = "Please select an impact level";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const ticketId = `IT-${Math.floor(1000 + Math.random() * 9000)}`;
    setSuccessTicketId(ticketId);

    onSubmit({
      title,
      description,
      category: activeCategory,
      subcategory,
      priority,
      impactLevel: activeImpact,
      attachments,
    });

    setIsLoading(false);
    setShowSuccess(true);

    // Auto-close success modal after 4 seconds
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 4000);
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Gradient top accent */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0D98BA] to-[#086A82]" />

          <div className="flex flex-col items-center justify-center px-6 py-12">
            {/* Success checkmark animation */}
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <h3 className="text-center text-xl font-bold text-[#1F2937]">
              Ticket Submitted Successfully!
            </h3>

            <p className="mt-2 text-center text-sm text-[#64748B]">
              Your support request has been received and assigned a ticket
              number.
            </p>

            <div className="mt-6 rounded-lg bg-[#0D98BA]/10 px-4 py-3">
              <p className="text-center text-xs font-semibold uppercase tracking-wider text-[#0B7E9A]">
                Ticket Number
              </p>
              <p className="mt-1 text-center font-mono text-2xl font-bold text-[#0D98BA]">
                {successTicketId}
              </p>
            </div>

            <p className="mt-6 text-center text-sm text-[#64748B]">
              You can track its status in the{" "}
              <span className="font-semibold text-[#1F2937]">
                "Pending Tickets"
              </span>{" "}
              tab.
            </p>

            <button
              onClick={() => {
                setShowSuccess(false);
                onClose();
              }}
              className="mt-8 w-full rounded-lg bg-[#0D98BA] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B7E9A]"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 overflow-y-auto">
      <div className="w-full max-w-2xl my-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-[#1F2937]">
              Request Assistance
            </h2>
            <p className="mt-0.5 text-xs text-[#64748B]">
              Tell us what's not working so we can help
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg p-1.5 text-[#64748B] transition hover:bg-[#F1F5F9] hover:text-[#1F2937] disabled:opacity-50"
            aria-label="Close"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
          {/* Category Selection Cards */}
          <div>
            <label className="block text-sm font-semibold text-[#1F2937] mb-3">
              What's the issue about? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {Object.entries(CATEGORY_DATA).map(([category]) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  className={`relative flex flex-col items-center justify-center rounded-xl border-2 px-3 py-4 transition ${
                    activeCategory === category
                      ? "border-[#0D98BA] bg-[#0D98BA]/10"
                      : "border-[#E2E8F0] bg-white hover:border-[#0D98BA]/50"
                  }`}
                >
                  <div className="text-2xl mb-1">
                    {CATEGORY_DATA[category as keyof typeof CATEGORY_DATA].icon}
                  </div>
                  <span className="text-xs font-medium text-[#1F2937]">
                    {category.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="mt-1 text-xs text-red-600">{errors.category}</p>
            )}
          </div>

          {/* Subcategory Selection */}
          <div>
            <label className="block text-sm font-semibold text-[#1F2937] mb-2">
              Specific Issue <span className="text-red-500">*</span>
            </label>
            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2.5 text-sm text-[#1F2937] outline-none transition focus:border-[#0D98BA] focus:ring-2 focus:ring-[#0D98BA]/30"
            >
              {CATEGORY_DATA[
                activeCategory as keyof typeof CATEGORY_DATA
              ].subcategories.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-sm font-semibold text-[#1F2937] mb-2">
              Issue Title / Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({ ...errors, title: "" });
              }}
              placeholder="e.g., Cannot connect to Wi-Fi, Printer not responding"
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-[#0D98BA]/30 ${
                errors.title
                  ? "border-red-400 focus:border-red-400"
                  : "border-[#E2E8F0] focus:border-[#0D98BA]"
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Description Textarea */}
          <div>
            <label className="block text-sm font-semibold text-[#1F2937] mb-2">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description)
                  setErrors({ ...errors, description: "" });
              }}
              placeholder="Please provide as much detail as possible:
- When did it start?
- What have you already tried?
- Any error messages?
- Impact on your work?"
              rows={4}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-[#0D98BA]/30 ${
                errors.description
                  ? "border-red-400 focus:border-red-400"
                  : "border-[#E2E8F0] focus:border-[#0D98BA]"
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Impact Matrix */}
          <div>
            <label className="block text-sm font-semibold text-[#1F2937] mb-3">
              How urgent is this? <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {IMPACT_LEVELS.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => handleImpactChange(level.value)}
                  className={`w-full text-left rounded-lg border-2 px-4 py-3 transition ${
                    activeImpact === level.value
                      ? `${level.color} border-current`
                      : `border-[#E2E8F0] bg-white hover:border-[#D1D5DB]`
                  }`}
                >
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <div
                        className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                          activeImpact === level.value
                            ? "border-current bg-current"
                            : "border-[#D1D5DB]"
                        }`}
                      >
                        {activeImpact === level.value && (
                          <svg
                            className="h-3 w-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-[#1F2937]">
                        {level.label}
                      </div>
                      <div className="mt-0.5 text-xs text-[#64748B]">
                        {level.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {errors.impact && (
              <p className="mt-1 text-xs text-red-600">{errors.impact}</p>
            )}
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-sm font-semibold text-[#1F2937] mb-2">
              Priority Level (for your reference)
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TicketPriority)}
              className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2.5 text-sm text-[#1F2937] outline-none transition focus:border-[#0D98BA] focus:ring-2 focus:ring-[#0D98BA]/30"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium (Recommended)</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-[#1F2937] mb-3">
              Attachments (optional)
            </label>

            {/* Drag and Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative rounded-lg border-2 border-dashed px-6 py-8 text-center transition ${
                dragActive
                  ? "border-[#0D98BA] bg-[#0D98BA]/5"
                  : "border-[#D1D5DB] bg-[#F9FAFB] hover:border-[#0D98BA]/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
                accept={ALLOWED_FILE_TYPES.join(",")}
              />

              <svg
                className="mx-auto h-8 w-8 text-[#64748B]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                />
              </svg>

              <p className="mt-2 text-sm font-medium text-[#1F2937]">
                Drag and drop files here
              </p>
              <p className="mt-1 text-xs text-[#64748B]">
                or{" "}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="font-semibold text-[#0D98BA] hover:text-[#0B7E9A]"
                >
                  click to browse
                </button>
              </p>

              <p className="mt-2 text-xs text-[#64748B]">
                Supported: Images, PDFs, Zip, Text • Max 50MB
              </p>

              <p className="mt-3 border-t border-[#E2E8F0] pt-3 text-xs text-[#64748B]">
                💡 You can also paste screenshots directly with{" "}
                <span className="font-mono bg-[#E2E8F0] px-1.5 py-0.5 rounded">
                  Ctrl+V
                </span>
              </p>
            </div>

            {errors.attachments && (
              <p className="mt-1 text-xs text-red-600">{errors.attachments}</p>
            )}

            {/* File Preview List */}
            {attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold text-[#64748B] uppercase">
                  Attached Files ({attachments.length})
                </p>
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-[#F9FAFB] px-3.5 py-2.5"
                  >
                    <div className="flex items-center min-w-0">
                      <div className="flex-shrink-0 mr-3">
                        <svg
                          className="h-5 w-5 text-[#0D98BA]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-[#1F2937] truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-[#64748B]">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="ml-3 flex-shrink-0 text-[#64748B] hover:text-red-600 transition"
                      aria-label="Remove file"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-lg border border-[#E2E8F0] px-4 py-2.5 text-sm font-semibold text-[#1F2937] transition hover:bg-[#F1F5F9] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#0D98BA] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B7E9A] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
                  Submitting...
                </>
              ) : (
                <>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  Submit Ticket
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
