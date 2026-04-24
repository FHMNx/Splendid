import React, { useMemo, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageTitle from "../components/PageTitle";

const INITIAL_FORM = {
  title: "",
  amount: "",
  type: "",
  category: "",
  date: "",
  description: "",
};

const REQUIRED_FIELDS = ["title", "amount", "type", "category", "date"];

const validateForm = (values) => {
  const errors = {};

  if (!values.title.trim()) {
    errors.title = "Title is required.";
  }

  if (!values.amount) {
    errors.amount = "Amount is required.";
  } else if (Number(values.amount) <= 0) {
    errors.amount = "Amount must be greater than zero.";
  }

  if (!values.type) {
    errors.type = "Transaction type is required.";
  }

  if (!values.category) {
    errors.category = "Category is required.";
  }

  if (!values.date) {
    errors.date = "Date is required.";
  }

  return errors;
};

const TransactionForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const hasEmptyRequired = useMemo(() => {
    return REQUIRED_FIELDS.some((field) => !String(formData[field]).trim());
  }, [formData]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setIsSuccess(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    window.setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData(INITIAL_FORM);
      setErrors({});
    }, 900);
  };

  const inputBaseClass =
    "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none transition-all duration-200 focus:ring-2";

  const getInputClass = (fieldName) => {
    return `${inputBaseClass} ${
      errors[fieldName]
        ? "border-red-300 focus:border-red-400 focus:ring-red-200"
        : "border-emerald-200 focus:border-emerald-500 focus:ring-emerald-200"
    }`;
  };

  return (
    <>
      <PageTitle title="Transactions | Splendid" />

      <div className="mx-auto w-full max-w-6xl">
        <section className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
                Add Transaction
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Enter transaction details to update your expense records.
              </p>
            </div>
            <p className="text-xs text-zinc-500">
              Fields marked with{" "}
              <span className="font-semibold text-red-500">*</span> are
              required.
            </p>
          </div>

          {isSuccess && (
            <div className="mb-5 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              <CheckCircle2 size={16} />
              Transaction saved successfully.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="mb-1.5 block text-sm font-medium text-zinc-700"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Grocery Shopping"
                className={getInputClass("title")}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-600">{errors.title}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="amount"
                  className="mb-1.5 block text-sm font-medium text-zinc-700"
                >
                  Amount <span className="text-red-500">*</span>
                </label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={getInputClass("amount")}
                />
                {errors.amount && (
                  <p className="mt-1 text-xs text-red-600">{errors.amount}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="type"
                  className="mb-1.5 block text-sm font-medium text-zinc-700"
                >
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={getInputClass("type")}
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
                <label
                  htmlFor="category"
                  className="mb-1.5 block text-sm font-medium text-zinc-700"
                >
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={getInputClass("category")}
                >
                  <option value="">Select category</option>
                  <option value="Food">Food</option>
                  <option value="Travel">Travel</option>
                  <option value="Bills">Bills</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-xs text-red-600">{errors.category}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="date"
                  className="mb-1.5 block text-sm font-medium text-zinc-700"
                >
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={getInputClass("date")}
                />
                {errors.date && (
                  <p className="mt-1 text-xs text-red-600">{errors.date}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-1.5 block text-sm font-medium text-zinc-700"
              >
                Description <span className="text-zinc-400">(optional)</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Add notes for this transaction"
                className={getInputClass("description")}
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={hasEmptyRequired || isSubmitting}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-300"
              >
                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                {isSubmitting ? "Saving..." : "Save Transaction"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </>
  );
};

export default TransactionForm;
