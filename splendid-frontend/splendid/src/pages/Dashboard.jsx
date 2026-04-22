import React, { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BanknoteArrowDown,
  BanknoteArrowUp,
  CreditCard,
  Plus,
  ReceiptText,
} from "lucide-react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import PageTitle from "../components/PageTitle";

const SUMMARY_CARDS = [
  {
    title: "Today Expense",
    amount: "LKR 2146.00",
    change: "-3.2%",
    trend: "down",
    icon: ReceiptText,
  },
  {
    title: "Monthly Expense",
    amount: "LKR 72,840.00",
    change: "+4.8%",
    trend: "up",
    icon: CreditCard,
  },
  {
    title: "Total Income",
    amount: "LKR 180,420.00",
    change: "+6.1%",
    trend: "up",
    icon: BanknoteArrowUp,
  },
  {
    title: "Monthly Income",
    amount: "LKR 220,960.00",
    change: "+2.3%",
    trend: "up",
    icon: BanknoteArrowDown,
  },
];

const TREND_DATA = {
  "7d": [
    { label: "Mon", expense: 120, income: 240 },
    { label: "Tue", expense: 160, income: 290 },
    { label: "Wed", expense: 110, income: 260 },
    { label: "Thu", expense: 180, income: 320 },
    { label: "Fri", expense: 150, income: 300 },
    { label: "Sat", expense: 90, income: 210 },
    { label: "Sun", expense: 130, income: 280 },
  ],
  "30d": [
    { label: "W1", expense: 820, income: 1400 },
    { label: "W2", expense: 760, income: 1320 },
    { label: "W3", expense: 910, income: 1500 },
    { label: "W4", expense: 840, income: 1420 },
  ],
  "3m": [
    { label: "Jan", expense: 2820, income: 4600 },
    { label: "Feb", expense: 2680, income: 4380 },
    { label: "Mar", expense: 2940, income: 4820 },
  ],
};

const CATEGORY_DATA = [
  { name: "Food", value: 38 },
  { name: "Travel", value: 22 },
  { name: "Bills", value: 18 },
  { name: "Shopping", value: 12 },
  { name: "Other", value: 10 },
];

const CATEGORY_COLORS = ["#047857", "#059669", "#10b981", "#34d399", "#6ee7b7"];

const RECENT_TRANSACTIONS = [
  {
    title: "Starbucks",
    amount: "$18.50",
    date: "Apr 22, 2026",
    type: "Expense",
  },
  {
    title: "Salary",
    amount: "$2,450.00",
    date: "Apr 20, 2026",
    type: "Income",
  },
  { title: "Uber", amount: "$12.40", date: "Apr 19, 2026", type: "Expense" },
  {
    title: "Freelance Project",
    amount: "$620.00",
    date: "Apr 18, 2026",
    type: "Income",
  },
  {
    title: "Electricity Bill",
    amount: "$74.30",
    date: "Apr 16, 2026",
    type: "Expense",
  },
];

const FILTER_OPTIONS = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 3 months", value: "3m" },
];

const Dashboard = () => {
  const [range, setRange] = useState("30d");

  const chartData = useMemo(() => {
    return TREND_DATA[range] ?? TREND_DATA["30d"];
  }, [range]);

  return (
    <>
      <PageTitle title="Dashboard | Splendid" />

      <div className="space-y-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {SUMMARY_CARDS.map(({ title, amount, change, trend, icon: Icon }) => {
            const isUp = trend === "up";
            return (
              <article
                key={title}
                className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <p className="text-sm font-medium text-zinc-600">{title}</p>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                    <Icon size={18} />
                  </span>
                </div>

                <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">
                  {amount}
                </p>

                <div className="mt-3 flex items-center gap-1.5 text-xs font-medium">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${
                      isUp
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {isUp ? (
                      <ArrowUpRight size={13} />
                    ) : (
                      <ArrowDownRight size={13} />
                    )}
                    {change}
                  </span>
                  <span className="text-zinc-500">vs previous period</span>
                </div>
              </article>
            );
          })}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <article className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm xl:col-span-2">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-zinc-900">
                  Expense vs Income
                </h3>
                <p className="text-sm text-zinc-500">
                  Trend over selected period
                </p>
              </div>

              <div className="inline-flex rounded-lg border border-emerald-100 bg-emerald-50/50 p-1">
                {FILTER_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRange(option.value)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                      range === option.value
                        ? "bg-white text-emerald-800 shadow-sm"
                        : "text-zinc-600 hover:text-emerald-700"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12, fill: "#52525b" }}
                  />
                  <YAxis tick={{ fontSize: 12, fill: "#52525b" }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    name="Expense"
                    stroke="#ef4444"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="income"
                    name="Income"
                    stroke="#059669"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
            <div>
              <h3 className="text-base font-semibold text-zinc-900">
                Category Breakdown
              </h3>
              <p className="text-sm text-zinc-500">This month expense split</p>
            </div>

            <div className="mt-4 h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CATEGORY_DATA}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={50}
                    paddingAngle={2}
                  >
                    {CATEGORY_DATA.map((entry, index) => (
                      <Cell
                        key={`${entry.name}-${index}`}
                        fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </article>
        </section>

        <section className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-zinc-900">
                Recent Transactions
              </h3>
              <p className="text-sm text-zinc-500">
                Last 5 transaction records
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-500">
                  <th className="px-3 py-2 font-medium">Title</th>
                  <th className="px-3 py-2 font-medium">Amount</th>
                  <th className="px-3 py-2 font-medium">Date</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_TRANSACTIONS.map((item) => (
                  <tr
                    key={`${item.title}-${item.date}`}
                    className="border-b border-zinc-100 text-zinc-700 transition-colors hover:bg-emerald-50/40"
                  >
                    <td className="px-3 py-3 font-medium text-zinc-900">
                      {item.title}
                    </td>
                    <td className="px-3 py-3">{item.amount}</td>
                    <td className="px-3 py-3 text-zinc-500">{item.date}</td>
                    <td className="px-3 py-3">
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
        </section>

        <button
          type="button"
          className="fixed bottom-6 right-6 inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <Plus size={17} />
          Add Transaction
        </button>
      </div>
    </>
  );
};

export default Dashboard;
