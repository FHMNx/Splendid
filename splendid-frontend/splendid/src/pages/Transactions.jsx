import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import EditTransactionModal from "../components/transactions/EditTransactionModal";

const TRANSACTIONS = [
  {
    id: 1,
    title: "Salary Payment",
    description: "Monthly company salary",
    amount: 2500,
    category: "Salary",
    date: "2026-04-20",
    type: "Income",
  },
  {
    id: 2,
    title: "Groceries",
    description: "Weekly food shopping",
    amount: 124,
    category: "Food",
    date: "2026-04-21",
    type: "Expense",
  },
  {
    id: 3,
    title: "Freelance Project",
    description: "Landing page delivery",
    amount: 780,
    category: "Freelance",
    date: "2026-04-18",
    type: "Income",
  },
  {
    id: 4,
    title: "Electricity Bill",
    description: "Monthly utility payment",
    amount: 68,
    category: "Bills",
    date: "2026-04-17",
    type: "Expense",
  },
  {
    id: 5,
    title: "Uber Ride",
    description: "Commute to office",
    amount: 16,
    category: "Travel",
    date: "2026-04-15",
    type: "Expense",
  },
  {
    id: 6,
    title: "Dividend Credit",
    description: "Stock dividend payout",
    amount: 210,
    category: "Investments",
    date: "2026-04-12",
    type: "Income",
  },
  {
    id: 7,
    title: "Internet Subscription",
    description: "Home broadband",
    amount: 34,
    category: "Bills",
    date: "2026-04-10",
    type: "Expense",
  },
];

const SummaryCard = ({ title, value, tone = "default" }) => {
  const toneClass =
    tone === "income"
      ? "text-emerald-700"
      : tone === "expense"
        ? "text-red-600"
        : "text-zinc-900";

  return (
    <article className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
      <p className="text-sm text-zinc-500">{title}</p>
      <p className={`mt-1 text-2xl font-semibold tracking-tight ${toneClass}`}>
        {value}
      </p>
    </article>
  );
};

const LoadingRows = () => {
  return Array.from({ length: 5 }).map((_, index) => (
    <tr key={index} className="border-b border-zinc-100">
      {Array.from({ length: 6 }).map((__, cellIndex) => (
        <td key={cellIndex} className="px-4 py-3">
          <div className="h-4 animate-pulse rounded bg-zinc-200" />
        </td>
      ))}
    </tr>
  ));
};

const DeleteModal = ({ transaction, onCancel, onConfirm }) => {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl border border-emerald-100 bg-white p-5 shadow-xl">
        <h3 className="text-lg font-semibold text-zinc-900">
          Delete Transaction
        </h3>
        <p className="mt-2 text-sm text-zinc-600">
          Are you sure you want to delete "{transaction.title}"? This action
          cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const Transactions = () => {
  const [data, setData] = useState(TRANSACTIONS);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const categories = useMemo(() => {
    return ["All", ...new Set(TRANSACTIONS.map((item) => item.category))];
  }, []);

  const filteredTransactions = useMemo(() => {
    return data
      .filter((item) => {
        const query = search.trim().toLowerCase();
        const matchesSearch =
          query.length === 0 ||
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query);

        const matchesType = typeFilter === "All" || item.type === typeFilter;
        const matchesCategory =
          categoryFilter === "All" || item.category === categoryFilter;

        const dateValue = new Date(item.date).getTime();
        const afterStart =
          !startDate || dateValue >= new Date(startDate).getTime();
        const beforeEnd = !endDate || dateValue <= new Date(endDate).getTime();

        return (
          matchesSearch &&
          matchesType &&
          matchesCategory &&
          afterStart &&
          beforeEnd
        );
      })
      .sort((a, b) => {
        const direction = sortDirection === "asc" ? 1 : -1;

        if (sortField === "amount") {
          return (a.amount - b.amount) * direction;
        }

        return (
          (new Date(a.date).getTime() - new Date(b.date).getTime()) * direction
        );
      });
  }, [
    data,
    search,
    typeFilter,
    categoryFilter,
    startDate,
    endDate,
    sortField,
    sortDirection,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter, categoryFilter, startDate, endDate, pageSize]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / pageSize),
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, currentPage, pageSize]);

  const totals = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, item) => {
        acc.count += 1;
        if (item.type === "Income") {
          acc.income += item.amount;
        } else {
          acc.expense += item.amount;
        }
        return acc;
      },
      { count: 0, income: 0, expense: 0 },
    );
  }, [filteredTransactions]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortField(field);
    setSortDirection("desc");
  };

  const handleDeleteConfirm = () => {
    if (!transactionToDelete) return;

    setData((prev) =>
      prev.filter((item) => item.id !== transactionToDelete.id),
    );
    setTransactionToDelete(null);
  };

  const handleOpenEditModal = (event, transaction) => {
    event.preventDefault();
    event.stopPropagation();

    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleUpdate = (updatedTransaction) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === updatedTransaction.id ? updatedTransaction : item,
      ),
    );
  };

  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }, [totalPages]);

  return (
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

          <a
            type="button"
            href="/dashboard/transactions/add"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600"
          >
            <Plus size={16} />
            Add Transactions
          </a>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          <label className="relative xl:col-span-2">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title or description"
              className="w-full rounded-lg border border-emerald-200 bg-white py-2.5 pl-9 pr-3 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </label>

          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            className="rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="All">Type: All</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                Category: {category}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              aria-label="Start date"
            />
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              aria-label="End date"
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryCard title="Total Transactions" value={totals.count} />
        <SummaryCard
          title="Total Income"
          value={`$${totals.income.toFixed(2)}`}
          tone="income"
        />
        <SummaryCard
          title="Total Expense"
          value={`$${totals.expense.toFixed(2)}`}
          tone="expense"
        />
      </section>

      <section className="rounded-xl border border-emerald-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 z-10 bg-emerald-50">
              <tr className="text-left text-zinc-600">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">
                  <button
                    type="button"
                    onClick={() => toggleSort("amount")}
                    className="inline-flex items-center gap-1 text-left"
                  >
                    Amount
                    {sortField === "amount" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </button>
                </th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">
                  <button
                    type="button"
                    onClick={() => toggleSort("date")}
                    className="inline-flex items-center gap-1 text-left"
                  >
                    Date
                    {sortField === "date" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </button>
                </th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {isLoading && <LoadingRows />}

              {!isLoading && paginatedTransactions.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-zinc-500"
                  >
                    No transactions found. Try adjusting your filters.
                  </td>
                </tr>
              )}

              {!isLoading &&
                paginatedTransactions.map((item) => (
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
                      ${item.amount.toFixed(2)}
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
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(event) => handleOpenEditModal(event, item)}
                          className="rounded-md p-1.5 text-zinc-600 transition hover:bg-emerald-100 hover:text-emerald-800"
                          aria-label={`Edit ${item.title}`}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setTransactionToDelete(item)}
                          className="rounded-md p-1.5 text-zinc-600 transition hover:bg-red-100 hover:text-red-700"
                          aria-label={`Delete ${item.title}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <span>Rows per page</span>
            <select
              value={pageSize}
              onChange={(event) => setPageSize(Number(event.target.value))}
              className="rounded-md border border-emerald-200 bg-white px-2 py-1 text-sm text-zinc-800"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2.5 py-1.5 text-sm text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft size={14} />
              Previous
            </button>

            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setCurrentPage(pageNumber)}
                className={`h-8 w-8 rounded-md text-sm font-medium transition ${
                  currentPage === pageNumber
                    ? "bg-emerald-700 text-white"
                    : "text-zinc-700 hover:bg-emerald-100"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2.5 py-1.5 text-sm text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      <DeleteModal
        transaction={transactionToDelete}
        onCancel={() => setTransactionToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />

      <EditTransactionModal
        data={isEditModalOpen ? selectedTransaction : null}
        onClose={handleCloseEditModal}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default Transactions;
