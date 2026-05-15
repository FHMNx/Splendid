import React, { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, X } from "lucide-react";
import { getCategoriesByType } from "../../features/categories/categoryAPI";

const INITIAL_FORM = {
  title: "",
  amount: "",
  type: "",
  categoryId: "",
  categoryName: "",
  paymentMethod: "",
  date: "",
  description: "",
};

const validate = (values) => {
  const errors = {};
  if (!values.title.trim()) errors.title = "Title is required.";
  if (!values.amount) errors.amount = "Amount is required.";
  if (Number(values.amount) <= 0) errors.amount = "Amount must be greater than zero.";
  if (!values.type) errors.type = "Type is required.";
  if (!values.categoryId) errors.category = "Category is required.";
  if (!values.date) errors.date = "Date is required.";
  return errors;
};

const EditTransactionModal = ({ data, onClose, onUpdate, isUpdating }) => {
  const modalRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [categories, setCategories] = useState([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);

  // Populate form when data changes (modal opens)
  useEffect(() => {
    if (!data) return;

    setFormData({
      title: data.title ?? "",
      amount: data.amount ?? "",
      type: data.type ?? "",              
      categoryId: data.categoryId ?? "",
      categoryName: data.categoryName ?? "",
      paymentMethod: data.paymentMethod ?? "CASH",
      date: data.date ?? "",
      description: data.notes ?? "",
    });
    setErrors({});

    requestAnimationFrame(() => setIsVisible(true));
  }, [data]);

  // Fetch categories when type changes
  useEffect(() => {
    if (!formData.type) return;

    const fetchCategories = async () => {
      setIsCategoriesLoading(true);
      try {
        const result = await getCategoriesByType(formData.type);
        setCategories(result || []);
      } catch {
        setCategories([]);
      } finally {
        setIsCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [formData.type]);

  // Keyboard trap + Escape
  useEffect(() => {
    if (!data) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") { handleClose(); return; }
      if (e.key !== "Tab") return;

      const focusable = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [data]);

  const hasRequiredEmpty = useMemo(() => (
    !formData.title.trim() ||
    !formData.amount ||
    !formData.type ||
    !formData.categoryId ||
    !formData.date
  ), [formData]);

  if (!data) return null;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 180);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // When type changes, reset category selection
    if (name === "type") {
      setFormData((prev) => ({ ...prev, type: value, categoryId: "", categoryName: "" }));
    } else if (name === "categoryId") {
      // Also store the category name for local state updates
      const selected = categories.find((c) => String(c.id) === value);
      setFormData((prev) => ({
        ...prev,
        categoryId: value,
        categoryName: selected?.name ?? "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validate(formData);
    if (Object.keys(nextErrors).length > 0) { setErrors(nextErrors); return; }

    // Build payload matching TransactionDto exactly
    const payload = {
      id: data.id,
      title: formData.title.trim(),
      amount: Number(formData.amount),
      type: formData.type.toUpperCase(),
      date: formData.date,
      paymentMethod: formData.paymentMethod || "CASH",
      notes: formData.description,
      categoryId: Number(formData.categoryId),
      categoryName: formData.categoryName,      // for optimistic UI update
    };

    onUpdate(payload);
  };

  const fieldClass = (name) =>
    `w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none transition-all duration-200 focus:ring-2 ${
      errors[name]
        ? "border-red-300 focus:border-red-400 focus:ring-red-200"
        : "border-emerald-200 focus:border-emerald-500 focus:ring-emerald-200"
    }`;

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
        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 id="edit-transaction-title" className="text-xl font-semibold tracking-tight text-zinc-900">
              Edit Transaction
            </h2>
            <p className="mt-1 text-sm text-zinc-500">Update the details below and save.</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md p-1.5 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input name="title" type="text" value={formData.title}
              onChange={handleChange} className={fieldClass("title")} />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
          </div>

          {/* Amount + Type */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Amount <span className="text-red-500">*</span>
              </label>
              <input name="amount" type="number" min="0" step="0.01"
                value={formData.amount} onChange={handleChange} className={fieldClass("amount")} />
              {errors.amount && <p className="mt-1 text-xs text-red-600">{errors.amount}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Type <span className="text-red-500">*</span>
              </label>
              <select name="type" value={formData.type} onChange={handleChange} className={fieldClass("type")}>
                <option value="">Select type</option>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>
              {errors.type && <p className="mt-1 text-xs text-red-600">{errors.type}</p>}
            </div>
          </div>

          {/* Category + Date */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                disabled={!formData.type || isCategoriesLoading}
                className={fieldClass("category")}
              >
                <option value="">
                  {!formData.type
                    ? "Select a type first"
                    : isCategoriesLoading
                    ? "Loading..."
                    : "Select category"}
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Date <span className="text-red-500">*</span>
              </label>
              <input name="date" type="date" value={formData.date}
                onChange={handleChange} className={fieldClass("date")} />
              {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date}</p>}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">Payment Method</label>
            <select name="paymentMethod" value={formData.paymentMethod}
              onChange={handleChange} className={fieldClass("paymentMethod")}>
              <option value="CASH">Cash</option>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="DEBIT_CARD">Debit Card</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="MOBILE_PAYMENT">Mobile Payment</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">Notes</label>
            <textarea name="description" rows={3} value={formData.description}
              onChange={handleChange} className={fieldClass("description")} />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={handleClose}
              className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating || hasRequiredEmpty}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              {isUpdating && <Loader2 size={16} className="animate-spin" />}
              {isUpdating ? "Updating..." : "Update Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransactionModal;