import {
  ArrowDownRight,
  ArrowUpRight,
  BanknoteArrowDown,
  BanknoteArrowUp,
  CreditCard,
  Plus,
  ReceiptText,
} from "lucide-react";
import { toast } from "react-hot-toast";
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
import { useState, useMemo, useEffect } from "react";
import { getAllTransactions, getTransactionsSummary, getTransactionTrend, getCategoryBreakdown } from "../features/transactions/transactionAPI";
import { getBudgets } from "../features/budget/budgetAPI";


const CATEGORY_COLORS = [
  "#047857", "#059669", "#10b981", "#34d399",
  "#6ee7b7", "#f59e0b", "#3b82f6", "#8b5cf6", "#ec4899",
];

const FILTER_OPTIONS = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 3 months", value: "3m" },
];

const Dashboard = () => {
  const [range, setRange] = useState("30d");
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isRecentLoading, setIsRecentLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  //CHART DATA STATES
  const [trendData, setTrendData] = useState([]);
  const [isTrendLoading, setIsTrendLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);

  //BUDGET DATA
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    const fetchTrend = async () => {
      setIsTrendLoading(true);
      try {
        const data = await getTransactionTrend(range);
        setTrendData(data);
      } catch {
        setTrendData([]);
      } finally {
        setIsTrendLoading(false);
      }
    };
    fetchTrend();
  }, [range]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsRecentLoading(true);
      // fetch recent transactions
      try {
        const response = await getAllTransactions(0, 5);
        setRecentTransactions(response.content || []);
      } catch (error) {
        setRecentTransactions([]);
        toast.error("Failed to load dashboard data. Please try again.");
      } finally {
        setIsRecentLoading(false);
      }

      //fetch current month budgets
      try {
        const now = new Date();
        const budgetResponse = await getBudgets(now.getMonth() + 1, now.getFullYear());
        setBudgets(budgetResponse.data || []);
      } catch (error) {
        setBudgets([]);
        toast.error("Failed to load budget data. Please try again.");
      }

      // fetch summary data
      setIsSummaryLoading(true);
      try {
        const summaryData = await getTransactionsSummary();
        setSummary(summaryData);
      } catch (error) {
        setSummary(null);
        toast.error("Failed to load dashboard summary. Please try again.");
      } finally {
        setIsSummaryLoading(false);
      }


      // fetch category breakdown
      setIsCategoryLoading(true);
      try {
        const categoryData = await getCategoryBreakdown();
        setCategoryData(categoryData);
      } catch (error) {
        setCategoryData([]);
        toast.error("Failed to load category breakdown. Please try again.");
      } finally {
        setIsCategoryLoading(false);
      }

    };

    fetchDashboardData();
  }, []);

  return (
    <>
      <PageTitle title="Dashboard | Splendid" />

      <div className="space-y-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Today Expense",
              amount: isSummaryLoading ? "..." : `LKR ${Number(summary?.todayExpense ?? 0).toFixed(2)}`,
              change: summary?.todayExpenseChange ?? 0,
              compareLabel: "vs yesterday",
              icon: ReceiptText,
              tone: "expense",
            },
            {
              title: "Monthly Expense",
              amount: isSummaryLoading ? "..." : `LKR ${Number(summary?.monthlyExpense ?? 0).toFixed(2)}`,
              change: summary?.monthlyExpenseChange ?? 0,
              compareLabel: "vs last month",
              icon: CreditCard,
              tone: "expense",
            },
            {
              title: "Total Income",
              amount: isSummaryLoading ? "..." : `LKR ${Number(summary?.totalIncome ?? 0).toFixed(2)}`,
              change: summary?.totalIncomeChange ?? 0,
              compareLabel: "vs last month",
              icon: BanknoteArrowUp,
              tone: "income",
            },
            {
              title: "Monthly Income",
              amount: isSummaryLoading ? "..." : `LKR ${Number(summary?.monthlyIncome ?? 0).toFixed(2)}`,
              change: summary?.monthlyIncomeChange ?? 0,
              compareLabel: "vs last month",
              icon: BanknoteArrowDown,
              tone: "income",
            },
          ].map(({ title, amount, change, compareLabel, icon: Icon, tone }) => {
            const isUp = change >= 0;

            // for expense cards, going up is bad (red), going down is good (green)
            // for income cards, going up is good (green), going down is bad (red)
            const badgeGreen =
              (tone === "expense" && !isUp) || (tone === "income" && isUp);

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

                <p className={`mt-3 text-2xl font-semibold tracking-tight ${tone === "income" ? "text-emerald-700" : "text-red-600"
                  }`}>
                  {amount}
                </p>

                <div className="mt-3 flex items-center gap-1.5 text-xs font-medium">
                  {isSummaryLoading ? (
                    <div className="h-5 w-20 animate-pulse rounded-full bg-zinc-200" />
                  ) : (
                    <>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${badgeGreen
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                        }`}>
                        {isUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                        {Math.abs(change).toFixed(1)}%
                      </span>
                      <span className="text-zinc-500">{compareLabel}</span>
                    </>
                  )}
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
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ${range === option.value
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
              {isTrendLoading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-700" />
                </div>
              ) : trendData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-zinc-400">
                  No data for this period.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#52525b" }} />
                    <YAxis tick={{ fontSize: 12, fill: "#52525b" }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="expense" name="Expense"
                      stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="income" name="Income"
                      stroke="#059669" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
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
              {isCategoryLoading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-700" />
                </div>
              ) : categoryData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-zinc-400">
                  No expense data this month.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={50}
                      paddingAngle={2}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`${entry.name}-${index}`}
                          fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </article>
        </section>

        {budgets.length > 0 && (
          <section className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-zinc-900">Budget Overview</h3>
                <p className="text-sm text-zinc-500">This month's spending vs limits</p>
              </div>

              <a
                href="/dashboard/budgets"
                className="text-xs font-medium text-emerald-700 hover:underline"
              >
                Manage budgets →
              </a>
            </div>

            <div className="space-y-3">
              {budgets.map((budget) => {
                const clampedPct = Math.min(budget.percentage, 100);
                const barColor =
                  budget.status === "OVER"
                    ? "bg-red-500"
                    : budget.status === "WARNING"
                      ? "bg-yellow-400"
                      : "bg-emerald-500";

                return (
                  <div key={budget.id}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-zinc-700">{budget.categoryName}</span>
                      <span className="text-zinc-500">
                        LKR {Number(budget.spentAmount).toFixed(0)} / {Number(budget.limitAmount).toFixed(0)}
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${clampedPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

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
                {isRecentLoading && (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-zinc-100">
                      {Array.from({ length: 4 }).map((__, j) => (
                        <td key={j} className="px-3 py-3">
                          <div className="h-4 animate-pulse rounded bg-zinc-200" />
                        </td>
                      ))}
                    </tr>
                  ))
                )}

                {!isRecentLoading && recentTransactions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-sm text-zinc-500">
                      No transactions yet.
                    </td>
                  </tr>
                )}

                {!isRecentLoading && recentTransactions.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-zinc-100 text-zinc-700 transition-colors hover:bg-emerald-50/40"
                  >
                    <td className="px-3 py-3 font-medium text-zinc-900">{item.title}</td>
                    <td className="px-3 py-3">{`LKR ${Number(item.amount).toFixed(2)}`}</td>
                    <td className="px-3 py-3 text-zinc-500">{item.date}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${String(item.type).toLowerCase() === "income"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                        }`}>
                        {item.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <a
          href="/dashboard/transactions/add"
          className="fixed bottom-6 right-6 inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <Plus size={17} />
          Add Transaction
        </a>
      </div >
    </>
  );
};

export default Dashboard;
