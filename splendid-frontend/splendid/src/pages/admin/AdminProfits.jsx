import { useEffect, useState } from "react";
import {
    TrendingUp, DollarSign, Users,
    ReceiptText, Loader2, Plus, X,
} from "lucide-react";
import PageTitle from "../../components/PageTitle";
import {
    getPaymentSummary, getAllPayments,
    getAllUsers, recordPayment,
} from "../../features/admin/adminAPI";
import { toast } from "react-hot-toast";

const METHOD_STYLE = {
    PAYHERE: "bg-blue-100 text-blue-700",
    WHATSAPP: "bg-emerald-100 text-emerald-700",
};

const PLAN_PRICES = {
    MONTHLY: 499,
    HALF_YEARLY: 2499,
    YEARLY: 3999,
    FREE_TRIAL: 0,
};

const PLANS = ["MONTHLY", "HALF_YEARLY", "YEARLY"];
const METHODS = ["PAYHERE", "WHATSAPP"];

// Record Payment Modal
const RecordPaymentModal = ({ users, onClose, onRecorded }) => {
    const [form, setForm] = useState({
        userId: "",
        plan: "MONTHLY",
        amount: "499.00",
        paymentMethod: "WHATSAPP",
        notes: "",
        paidAt: new Date().toISOString().slice(0, 16),
    });
    const [isLoading, setIsLoading] = useState(false);

    const handlePlanChange = (plan) => {
        setForm((prev) => ({
            ...prev,
            plan,
            amount: String(PLAN_PRICES[plan] ?? ""),
        }));
    };

    const handleSubmit = async () => {
        if (!form.userId || !form.plan || !form.amount) {
            toast.error("Please fill all required fields");
            return;
        }

        setIsLoading(true);
        try {
            await recordPayment({
                userId: Number(form.userId),
                plan: form.plan,
                amount: Number(form.amount),
                paymentMethod: form.paymentMethod,
                notes: form.notes,
                paidAt: form.paidAt ? new Date(form.paidAt).toISOString() : null,
            });
            toast.success("Payment recorded and subscription activated");
            onRecorded();
            onClose();
        } catch {
            toast.error("Failed to record payment");
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = "w-full rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-xl border border-emerald-100 bg-white p-6 shadow-2xl">

                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900">
                            Record Payment
                        </h3>
                        <p className="text-xs text-zinc-500">
                            Manually log a WhatsApp or PayHere payment
                        </p>
                    </div>
                    <button type="button" onClick={onClose}
                        className="rounded-md p-1.5 text-zinc-400 transition hover:bg-zinc-100">
                        <X size={16} />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* User */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                            User <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={form.userId}
                            onChange={(e) => setForm((p) => ({ ...p, userId: e.target.value }))}
                            className={inputClass}
                        >
                            <option value="">Select user</option>
                            {users.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.firstName} {u.lastName} — {u.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Plan + Amount */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                                Plan <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={form.plan}
                                onChange={(e) => handlePlanChange(e.target.value)}
                                className={inputClass}
                            >
                                {PLANS.map((p) => (
                                    <option key={p} value={p}>{p.replace("_", " ")}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                                Amount (LKR) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={form.amount}
                                onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                            Payment Method
                        </label>
                        <div className="flex gap-2">
                            {METHODS.map((method) => (
                                <button
                                    key={method}
                                    type="button"
                                    onClick={() => setForm((p) => ({ ...p, paymentMethod: method }))}
                                    className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition ${form.paymentMethod === method
                                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                            : "border-zinc-200 text-zinc-600 hover:border-emerald-200"
                                        }`}
                                >
                                    {method}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Paid At */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                            Payment Date & Time
                        </label>
                        <input
                            type="datetime-local"
                            value={form.paidAt}
                            onChange={(e) => setForm((p) => ({ ...p, paidAt: e.target.value }))}
                            className={inputClass}
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                            Notes
                        </label>
                        <textarea
                            rows={2}
                            value={form.notes}
                            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                            placeholder="e.g. Payment received via WhatsApp, screenshot ref #..."
                            className={inputClass}
                        />
                    </div>
                </div>

                <div className="mt-5 flex justify-end gap-2">
                    <button type="button" onClick={onClose}
                        className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50">
                        Cancel
                    </button>
                    <button type="button" onClick={handleSubmit} disabled={isLoading}
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:bg-emerald-300">
                        {isLoading && <Loader2 size={14} className="animate-spin" />}
                        {isLoading ? "Recording..." : "Record & Activate"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Main Page
const AdminProfits = () => {
    const [summary, setSummary] = useState(null);
    const [payments, setPayments] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState("");
    const [methodFilter, setMethodFilter] = useState("ALL");

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [summaryRes, paymentsRes, usersRes] = await Promise.all([
                getPaymentSummary(),
                getAllPayments(),
                getAllUsers(),
            ]);
            setSummary(summaryRes.data);
            setPayments(paymentsRes.data || []);
            setUsers(usersRes.data || []);
        } catch {
            toast.error("Failed to load payment data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const filtered = payments.filter((p) => {
        const q = search.toLowerCase();
        const matchSearch =
            p.userName?.toLowerCase().includes(q) ||
            p.userEmail?.toLowerCase().includes(q) ||
            p.plan?.toLowerCase().includes(q);
        const matchMethod =
            methodFilter === "ALL" || p.paymentMethod === methodFilter;
        return matchSearch && matchMethod;
    });

    const fmt = (val) =>
        `LKR ${Number(val ?? 0).toLocaleString("en-LK", { minimumFractionDigits: 2 })}`;

    return (
        <>
            <PageTitle title="Profits | Admin | Splendid" />

            <div className="space-y-6">

                {/* Header */}
                <section className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                                Platform Profits
                            </h2>
                            <p className="mt-1 text-sm text-zinc-500">
                                Track all subscription payments and revenue.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-600"
                        >
                            <Plus size={16} />
                            Record Payment
                        </button>
                    </div>
                </section>

                {/* Summary Cards */}
                {isLoading ? (
                    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-28 animate-pulse rounded-xl bg-zinc-100" />
                        ))}
                    </div>
                ) : (
                    <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                        {[
                            {
                                label: "Total Revenue",
                                value: fmt(summary?.totalRevenue),
                                icon: TrendingUp,
                                color: "text-emerald-700",
                                bg: "bg-emerald-50 text-emerald-700",
                            },
                            {
                                label: "This Month",
                                value: fmt(summary?.monthlyRevenue),
                                icon: DollarSign,
                                color: "text-blue-700",
                                bg: "bg-blue-50 text-blue-700",
                            },
                            {
                                label: "This Year",
                                value: fmt(summary?.yearlyRevenue),
                                icon: ReceiptText,
                                color: "text-purple-700",
                                bg: "bg-purple-50 text-purple-700",
                            },
                            {
                                label: "Paid Users",
                                value: summary?.totalPaidUsers ?? 0,
                                icon: Users,
                                color: "text-amber-700",
                                bg: "bg-amber-50 text-amber-700",
                            },
                        ].map(({ label, value, icon: Icon, color, bg }) => (
                            <article key={label}
                                className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                                <div className="flex items-start justify-between">
                                    <p className="text-sm text-zinc-500">{label}</p>
                                    <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${bg}`}>
                                        <Icon size={17} />
                                    </span>
                                </div>
                                <p className={`mt-3 text-2xl font-bold tracking-tight ${color}`}>
                                    {value}
                                </p>
                            </article>
                        ))}
                    </section>
                )}

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by user or plan..."
                        className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 sm:w-72"
                    />
                    <select
                        value={methodFilter}
                        onChange={(e) => setMethodFilter(e.target.value)}
                        className="rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    >
                        <option value="ALL">All Methods</option>
                        <option value="PAYHERE">PayHere</option>
                        <option value="WHATSAPP">WhatsApp</option>
                    </select>
                </div>

                {/* Payments Table */}
                <section className="rounded-xl border border-emerald-100 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-emerald-50 text-left text-zinc-600">
                                <tr>
                                    <th className="px-4 py-3 font-medium">User</th>
                                    <th className="px-4 py-3 font-medium">Plan</th>
                                    <th className="px-4 py-3 font-medium">Amount</th>
                                    <th className="px-4 py-3 font-medium">Method</th>
                                    <th className="px-4 py-3 font-medium">Date</th>
                                    <th className="px-4 py-3 font-medium">Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading && Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="border-b border-zinc-100">
                                        {Array.from({ length: 6 }).map((__, j) => (
                                            <td key={j} className="px-4 py-3">
                                                <div className="h-4 animate-pulse rounded bg-zinc-200" />
                                            </td>
                                        ))}
                                    </tr>
                                ))}

                                {!isLoading && filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-10 text-center text-zinc-400">
                                            No payments recorded yet.
                                        </td>
                                    </tr>
                                )}

                                {!isLoading && filtered.map((payment) => (
                                    <tr key={payment.id}
                                        className="border-b border-zinc-100 transition hover:bg-emerald-50/40">
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-zinc-900">{payment.userName}</p>
                                            <p className="text-xs text-zinc-400">{payment.userEmail}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                                {payment.plan?.replace("_", " ")}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-zinc-900">
                                            LKR {Number(payment.amount).toLocaleString("en-LK", { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${METHOD_STYLE[payment.paymentMethod] ?? "bg-zinc-100 text-zinc-600"
                                                }`}>
                                                {payment.paymentMethod}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-zinc-500">
                                            {payment.paidAt
                                                ? new Date(payment.paidAt).toLocaleDateString("en-US", {
                                                    year: "numeric", month: "short", day: "numeric",
                                                    hour: "2-digit", minute: "2-digit",
                                                })
                                                : "—"}
                                        </td>
                                        <td className="px-4 py-3 text-zinc-400 text-xs max-w-xs truncate">
                                            {payment.notes ?? "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Total row */}
                    {!isLoading && filtered.length > 0 && (
                        <div className="flex items-center justify-between border-t border-zinc-100 px-4 py-3">
                            <span className="text-sm text-zinc-500">
                                {filtered.length} payment{filtered.length !== 1 ? "s" : ""}
                            </span>
                            <span className="text-sm font-semibold text-zinc-900">
                                Total: LKR {filtered
                                    .reduce((sum, p) => sum + Number(p.amount), 0)
                                    .toLocaleString("en-LK", { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    )}
                </section>
            </div>

            {showModal && (
                <RecordPaymentModal
                    users={users}
                    onClose={() => setShowModal(false)}
                    onRecorded={fetchData}
                />
            )}
        </>
    );
};

export default AdminProfits;