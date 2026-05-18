import React, { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Target, TrendingUp } from "lucide-react";
import { toast } from "react-hot-toast";
import PageTitle from "../components/PageTitle";
import { getBudgets, createOrUpdateBudget, deleteBudget } from "../features/budget/budgetAPI";
import { getCategoriesByType } from "../features/categories/categoryAPI";

const STATUS_CONFIG = {
  GOOD:    { color: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700", label: "Good" },
  WARNING: { color: "bg-yellow-400",  badge: "bg-yellow-100 text-yellow-700",   label: "Warning" },
  OVER:    { color: "bg-red-500",     badge: "bg-red-100 text-red-700",         label: "Over Budget" },
};

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const Budget = () => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear]   = useState(now.getFullYear());

  const [budgets, setBudgets]           = useState([]);
  const [isLoading, setIsLoading]       = useState(false);
  const [categories, setCategories]     = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId]     = useState(null);

  const [form, setForm] = useState({
    categoryId: "",
    limitAmount: "",
  });

  // fetch expense categories once
  useEffect(() => {
    getCategoriesByType("EXPENSE")
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  // fetch budgets when month/year changes
  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const res = await getBudgets(month, year);
        setBudgets(res.data || []);
      } catch {
        toast.error("Failed to load budgets");
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [month, year]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.categoryId || !form.limitAmount) {
      toast.error("Please fill all fields");
      return;
    }
    if (Number(form.limitAmount) <= 0) {
      toast.error("Limit must be greater than zero");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createOrUpdateBudget({
        categoryId: Number(form.categoryId),
        limitAmount: Number(form.limitAmount),
        month,
        year,
      });

      // update or add in local state
      setBudgets((prev) => {
        const exists = prev.find((b) => b.id === res.data.id);
        if (exists) {
          return prev.map((b) => b.id === res.data.id ? res.data : b);
        }
        return [...prev, res.data];
      });

      toast.success("Budget saved successfully");
      setForm({ categoryId: "", limitAmount: "" });
    } catch {
      toast.error("Failed to save budget");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteBudget(id);
      setBudgets((prev) => prev.filter((b) => b.id !== id));
      toast.success("Budget removed");
    } catch {
      toast.error("Failed to remove budget");
    } finally {
      setDeletingId(null);
    }
  };

  // year options — current year ±2
  const yearOptions = Array.from({ length: 5 }, (_, i) => year - 2 + i);

  return (
    <>
      <PageTitle title="Budget Goals | Splendid" />

      <div className="space-y-6">

        {/* Header */}
        <section className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
                Budget Goals
              </h2>
              <p className="text-sm text-zinc-500">
                Set monthly spending limits per category and track your progress.
              </p>
            </div>

            {/* Month / Year selector */}
            <div className="flex items-center gap-2">
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-zinc-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i + 1}>{m}</option>
                ))}
              </select>

              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-zinc-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Add Budget Form */}
          <aside className="lg:col-span-1">
            <article className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <Target size={16} />
                </span>
                <h3 className="text-base font-semibold text-zinc-900">
                  Set Budget
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                    Monthly Limit (LKR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={form.limitAmount}
                    onChange={(e) => setForm((p) => ({ ...p, limitAmount: e.target.value }))}
                    placeholder="e.g. 10000"
                    className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-300"
                >
                  {isSubmitting
                    ? <><Loader2 size={15} className="animate-spin" /> Saving...</>
                    : <><Plus size={15} /> Save Budget</>
                  }
                </button>
              </form>

              <p className="mt-3 text-xs text-zinc-400">
                Setting a budget for an existing category will update it.
              </p>
            </article>
          </aside>

          {/* Budget List */}
          <section className="lg:col-span-2 space-y-4">
            {isLoading && (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-28 animate-pulse rounded-xl bg-zinc-100" />
              ))
            )}

            {!isLoading && budgets.length === 0 && (
              <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-emerald-200 bg-white text-center">
                <TrendingUp size={32} className="mb-2 text-emerald-300" />
                <p className="text-sm font-medium text-zinc-500">No budgets set for this month</p>
                <p className="mt-1 text-xs text-zinc-400">Add a budget using the form on the left</p>
              </div>
            )}

            {!isLoading && budgets.map((budget) => {
              const config = STATUS_CONFIG[budget.status] ?? STATUS_CONFIG.GOOD;
              const clampedPct = Math.min(budget.percentage, 100);

              return (
                <article
                  key={budget.id}
                  className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">

                      {/* Category + status badge */}
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base font-semibold text-zinc-900">
                          {budget.categoryName}
                        </h4>
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${config.badge}`}>
                          {config.label}
                        </span>
                      </div>

                      {/* Amounts */}
                      <p className="mt-1 text-sm text-zinc-500">
                        <span className="font-medium text-zinc-800">
                          LKR {Number(budget.spentAmount).toFixed(2)}
                        </span>
                        {" "}spent of{" "}
                        <span className="font-medium text-zinc-800">
                          LKR {Number(budget.limitAmount).toFixed(2)}
                        </span>
                      </p>

                      {/* Progress bar */}
                      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${config.color}`}
                          style={{ width: `${clampedPct}%` }}
                        />
                      </div>

                      <p className="mt-1.5 text-xs text-zinc-400">
                        {budget.percentage.toFixed(1)}% used
                        {budget.status === "OVER" && (
                          <span className="ml-2 text-red-500 font-medium">
                            LKR {(Number(budget.spentAmount) - Number(budget.limitAmount)).toFixed(2)} over
                          </span>
                        )}
                        {budget.status !== "OVER" && (
                          <span className="ml-2 text-emerald-600">
                            LKR {(Number(budget.limitAmount) - Number(budget.spentAmount)).toFixed(2)} remaining
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleDelete(budget.id)}
                      disabled={deletingId === budget.id}
                      className="rounded-md p-1.5 text-zinc-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      aria-label={`Remove ${budget.categoryName} budget`}
                    >
                      {deletingId === budget.id
                        ? <Loader2 size={16} className="animate-spin" />
                        : <Trash2 size={16} />
                      }
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        </div>
      </div>
    </>
  );
};

export default Budget;