import React, { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, X } from "lucide-react";

const CATEGORY_OPTIONS = [
  "Food",
  "Travel",
  "Bills",
  "Shopping",
  "Other",
  "Salary",
  "Freelance",
  "Investments",
];

const INITIAL_FORM = {
  title: "",
  amount: "",
  type: "",
  category: "",
  date: "",
  description: "",
};

const validate = (values) => {
  const nextErrors = {};

  if (!values.title.trim()) nextErrors.title = "Title is required.";
  if (!values.amount) nextErrors.amount = "Amount is required.";
  if (Number(values.amount) <= 0) {
    nextErrors.amount = "Amount must be greater than zero.";
  }
  if (!values.type) nextErrors.type = "Type is required.";
  if (!values.category) nextErrors.category = "Category is required.";
  if (!values.date) nextErrors.date = "Date is required.";

  return nextErrors;
};

const EditTransactionModal = ({ data, onClose, onUpdate }) => {
  const modalRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(INITIAL_FORM);

  useEffect(() => {
    if (!data) return;

    setFormData({
      title: data.title ?? "",
      amount: data.amount ?? "",
      type: data.type ?? "",
      category: data.category ?? "",
      date: data.date ?? "",
      description: data.description ?? "",
    });
    setErrors({});
    setSuccessMessage("");

    const animationFrame = window.requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [data]);

  useEffect(() => {
    if (!data) return;

    const focusable = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    if (focusable && focusable.length > 0) {
      focusable[0].focus();
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
        return;
      }

      if (event.key !== "Tab") return;

      const elements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (!elements || elements.length === 0) return;

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [data]);

  const hasRequiredEmpty = useMemo(() => {
    return (
      !formData.title.trim() ||
      !formData.amount ||
      !formData.type ||
      !formData.category ||
      !formData.date
    );
  }, [formData]);

  if (!data) return null;

  const handleClose = () => {
    setIsVisible(false);
    window.setTimeout(() => {
      onClose();
    }, 180);
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(formData);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);

    window.setTimeout(() => {
      const payload = {
        ...data,
        ...formData,
        amount: Number(formData.amount),
      };

      onUpdate(payload);
      setIsSubmitting(false);
      setSuccessMessage("Transaction updated successfully.");

      window.setTimeout(() => {
        handleClose();
      }, 500);
    }, 600);
  };

  const fieldClass = (fieldName) => {
    return `w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none transition-all duration-200 focus:ring-2 ${
      errors[fieldName]
        ? "border-red-300 focus:border-red-400 focus:ring-red-200"
        : "border-emerald-200 focus:border-emerald-500 focus:ring-emerald-200"
    }`;
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-transaction-title"
    >
      <div
        ref={modalRef}
        className={`w-full max-w-2xl rounded-xl border border-emerald-100 bg-white p-5 shadow-2xl transition-all duration-200 sm:p-6 ${
          isVisible ? "scale-100" : "scale-95"
        }`}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2
              id="edit-transaction-title"
              className="text-xl font-semibold tracking-tight text-zinc-900"
            >
              Edit Transaction
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Update transaction details and save your changes.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md p-1.5 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700"
            aria-label="Close edit transaction modal"
          >
            <X size={18} />
          </button>
        </div>

        {successMessage && (
          <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {successMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className={fieldClass("title")}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-600">{errors.title}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Amount <span className="text-red-500">*</span>
              </label>
              <input
                name="amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                className={fieldClass("amount")}
              />
              {errors.amount && (
                <p className="mt-1 text-xs text-red-600">{errors.amount}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={fieldClass("type")}
              >
                <option value="">Select type</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-xs text-red-600">{errors.type}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={fieldClass("category")}
              >
                <option value="">Select category</option>
                {CATEGORY_OPTIONS.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-xs text-red-600">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className={fieldClass("date")}
              />
              {errors.date && (
                <p className="mt-1 text-xs text-red-600">{errors.date}</p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className={fieldClass("description")}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || hasRequiredEmpty}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {isSubmitting ? "Updating..." : "Update Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransactionModal;
