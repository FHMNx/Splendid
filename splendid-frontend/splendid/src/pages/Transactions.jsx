import React from "react";
import { Plus, Search } from "lucide-react";
import PageTitle from "../components/PageTitle";
import { getAllTransactions } from "../features/transactions/transactionAPI";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";

const SummaryCard = ({ title, value, tone = "neutral" }) => {
  const toneClass =
    tone === "positive"
      ? "text-emerald-700"
      : tone === "negative"
        ? "text-red-700"
        : "text-zinc-900";

  return (
    <article className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
      <p className="text-sm text-zinc-500">{title}</p>
      <p className={`mt-1 text-2xl font-semibold ${toneClass}`}>{value}</p>
    </article>
  );
};

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await getAllTransactions();

        const formatted = response.map((t) => ({
          id: t.id,
          title: t.title,
          description: t.notes || "",
          amount: t.amount,
          category: t.categoryId || "General",
          date: t.date,
          type: t.type === "INCOME" ? "Income" : "Expense",
        }));

        setTransactions(formatted);
      } catch (error) {
        toast.error("Failed to load transactions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <PageTitle title="Transactions | Splendid" />

      <div className="space-y-6">
        <section className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
                Transactions
              </h2>
              <p className="text-sm text-zinc-500">
                Track and manage your income and expenses.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600"
            >
              <Plus size={16} />
              Add Transactions
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
            <label className="relative xl:col-span-2">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="text"
                placeholder="Search by title or description"
                className="w-full rounded-lg border border-emerald-200 bg-white py-2.5 pl-9 pr-3 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </label>

            <select className="rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20">
              <option value="All">Type: All</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>

            <select className="rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20">
              <option value="All">Category: All</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Income">Income</option>
            </select>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                className="rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                aria-label="Start date"
              />
              <input
                type="date"
                className="rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                aria-label="End date"
              />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SummaryCard title="Total Transactions" value={transactions.length} />

          <SummaryCard
            title="Total Income"
            value="LKR ---"
            tone="positive"
          />

          <SummaryCard
            title="Total Expenses"
            value="LKR ---"
            tone="negative"
          />
        </section>

        <section className="rounded-xl border border-emerald-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 z-10 bg-emerald-50">
                <tr className="text-left text-zinc-600">
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-zinc-100 text-zinc-700 transition-colors duration-200 hover:bg-emerald-50/60"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-zinc-900">{item.title}</p>
                      <p className="text-xs text-zinc-500">
                        {item.description}
                      </p>
                    </td>

                    <td className="px-4 py-3 font-medium">
                      {item.type === "Income"
                        ? `+ LKR ${item.amount}`
                        : `- LKR ${item.amount}`}
                    </td>

                    <td className="px-4 py-3">{item.category}</td>
                    <td className="px-4 py-3">{item.date}</td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          item.type === "Income"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <span>Showing API data</span>
            </div>

            <div className="flex items-center gap-1">
              <span className="rounded-md bg-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-700">
                Live Data
              </span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Transactions;