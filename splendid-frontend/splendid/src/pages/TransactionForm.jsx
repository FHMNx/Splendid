import React from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import PageTitle from "../components/PageTitle";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useEffect } from "react";
import { useMemo } from "react";

import { createTransaction } from "../features/transactions/transactionAPI";
import { getCategoriesByType } from "../features/categories/categoryAPI";

const INITIAL_FORM = {
  title: "",
  amount: "",
  type: "",
  category: "",
  date: "",
  description: "",
  paymentMethod: "",
};

const REQUIRED_FIELDS = [
  "title",
  "amount",
  "paymentMethod",
  "type",
  "category",
  "date",
];

const inputBaseClass =
  "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none transition-all duration-200 focus:ring-2";

const TransactionForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [categories, setCategories] = useState([]);

  const getInputClass = (fieldName) => {
    return `${inputBaseClass} ${
      errors[fieldName]
        ? "border-red-300 focus:border-red-400 focus:ring-red-200"
        : "border-emerald-200 focus:border-emerald-500 focus:ring-emerald-200"
    }`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "type" && { category: "" }), // Reset category if type changes
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setIsSuccess(false);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      if (!formData.type) return;

      try {
        const response = await getCategoriesByType(formData.type.toUpperCase());
        setCategories(response);
      } catch (error) {
        toast.error("Failed to load categories. Please try again.");
      }
    };

    fetchCategories();
  }, [formData.type]);

  const validateForm = (values) => {
    const validationErrors = {};

    if (!values.title.trim()) {
      validationErrors.title = "Title is required.";
    }

    if (!values.amount) {
      validationErrors.amount = "Amount is required.";
    } else if (Number(values.amount) <= 0) {
      validationErrors.amount = "Amount must be greater than zero.";
    }

    if (!values.paymentMethod) {
      validationErrors.paymentMethod = "Payment method is required.";
    }
    if (!values.type) {
      validationErrors.type = "Transaction type is required.";
    }
    if (!values.category) {
      validationErrors.category = "Category is required.";
    }
    if (!values.date) {
      validationErrors.date = "Date is required.";
    }

    return validationErrors;
  };

  const hasEmptyRequired = useMemo(() => {
    return REQUIRED_FIELDS.some((field) => !String(formData[field]).trim());
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        title: formData.title,
        amount: Number(formData.amount),
        date: formData.date,
        type: formData.type.toUpperCase(),
        paymentMethod: formData.paymentMethod,
        notes: formData.description,
        categoryId: Number(formData.category),
      };

      await createTransaction(payload);
      setIsSuccess(true);
      toast.success("Transaction created successfully!");
      
      setFormData(INITIAL_FORM);
      setErrors({});
    } catch (error) {
      toast.error("Failed to create transaction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                  Payment Method *
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className={getInputClass("paymentMethod")}
                >
                  <option value="">Select method</option>
                  <option value="CASH">Cash</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                  <option value="DEBIT_CARD">Debit Card</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="MOBILE_PAYMENT">Mobile Payment</option>
                  <option value="OTHER">Other</option>
                </select>
                {errors.paymentMethod && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.paymentMethod}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="type"
                  className="mb-1.5 block text-sm font-medium text-zinc-700"
                >
                  Transaction Type <span className="text-red-500">*</span>
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
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={getInputClass("category")}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
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
