import { useEffect, useState } from "react";
import {
    Crown, Loader2, RefreshCw,
    ShieldCheck, ShieldX, Clock,
} from "lucide-react";
import PageTitle from "../../components/PageTitle";
import { getAllUsers, activateUserSubscription } from "../../features/admin/adminAPI";
import { toast } from "react-hot-toast";

const PLANS = [
    { value: "FREE_TRIAL", label: "Free Trial  (7 days)" },
    { value: "MONTHLY", label: "Monthly     (30 days)" },
    { value: "HALF_YEARLY", label: "Half Yearly (180 days)" },
    { value: "YEARLY", label: "Yearly      (365 days)" },
];

const STATUS_STYLE = {
    ACTIVE: "bg-emerald-100 text-emerald-700",
    EXPIRED: "bg-red-100 text-red-600",
    CANCELLED: "bg-zinc-100 text-zinc-600",
    NONE: "bg-zinc-100 text-zinc-400",
};

const PLAN_STYLE = {
    FREE_TRIAL: "bg-blue-100 text-blue-700",
    MONTHLY: "bg-emerald-100 text-emerald-700",
    HALF_YEARLY: "bg-purple-100 text-purple-700",
    YEARLY: "bg-amber-100 text-amber-700",
    NONE: "bg-zinc-100 text-zinc-400",
};

// Activate Modal
const ActivateModal = ({ user, onClose, onActivated }) => {
    const [plan, setPlan] = useState("MONTHLY");
    const [isLoading, setIsLoading] = useState(false);

    const handleActivate = async () => {
        setIsLoading(true);
        try {
            await activateUserSubscription(user.id, plan);
            toast.success(
                `${plan.replace("_", " ")} activated for ${user.firstName} ${user.lastName}`
            );
            onActivated();
            onClose();
        } catch {
            toast.error("Failed to activate subscription");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-sm rounded-xl border border-emerald-100 bg-white p-6 shadow-2xl">

                {/* Header */}
                <div className="mb-4 flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                        <Crown size={20} />
                    </span>
                    <div>
                        <h3 className="text-base font-semibold text-zinc-900">
                            Activate Subscription
                        </h3>
                        <p className="text-xs text-zinc-500">
                            {user.firstName} {user.lastName} · {user.email}
                        </p>
                    </div>
                </div>

                {/* Current plan info */}
                <div className="mb-4 rounded-lg border border-zinc-100 bg-zinc-50 p-3 text-xs text-zinc-600">
                    <p>Current plan:
                        <span className={`ml-1.5 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${PLAN_STYLE[user.subscriptionPlan] ?? PLAN_STYLE.NONE}`}>
                            {user.subscriptionPlan ?? "NONE"}
                        </span>
                    </p>
                    <p className="mt-1">Status:
                        <span className={`ml-1.5 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[user.subscriptionStatus] ?? STATUS_STYLE.NONE}`}>
                            {user.subscriptionStatus ?? "NONE"}
                        </span>
                    </p>
                    {user.subscriptionEndDate && (
                        <p className="mt-1">Expires: <span className="font-medium">{user.subscriptionEndDate}</span></p>
                    )}
                </div>

                {/* Plan selector */}
                <div className="mb-5">
                    <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                        Select New Plan
                    </label>
                    <select
                        value={plan}
                        onChange={(e) => setPlan(e.target.value)}
                        className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    >
                        {PLANS.map((p) => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                    </select>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                    <button type="button" onClick={onClose}
                        className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50">
                        Cancel
                    </button>
                    <button type="button" onClick={handleActivate} disabled={isLoading}
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:bg-emerald-300">
                        {isLoading && <Loader2 size={14} className="animate-spin" />}
                        {isLoading ? "Activating..." : "Activate Plan"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const AdminSubscriptions = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await getAllUsers();
            setUsers(res.data || []);
        } catch {
            toast.error("Failed to load users");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const filtered = users.filter((u) => {
        const q = search.toLowerCase();
        const matchesSearch =
            u.firstName?.toLowerCase().includes(q) ||
            u.lastName?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q);

        const matchesStatus =
            statusFilter === "ALL" ||
            u.subscriptionStatus === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // summary counts
    const counts = {
        total: users.length,
        active: users.filter((u) => u.subscriptionStatus === "ACTIVE").length,
        expired: users.filter((u) => u.subscriptionStatus === "EXPIRED").length,
        none: users.filter((u) => !u.subscriptionStatus || u.subscriptionStatus === "NONE").length,
    };

    return (
        <>
            <PageTitle title="Subscriptions | Admin | Splendid" />

            <div className="space-y-6">

                {/* Header */}
                <section className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                                Subscription Management
                            </h2>
                            <p className="mt-1 text-sm text-zinc-500">
                                Activate and manage user subscriptions manually.
                            </p>
                        </div>
                        <button type="button" onClick={fetchUsers}
                            className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100">
                            <RefreshCw size={14} />
                            Refresh
                        </button>
                    </div>
                </section>

                {/* Summary cards */}
                <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {[
                        { label: "Total Users", value: counts.total, color: "text-zinc-900", bg: "bg-zinc-50" },
                        { label: "Active", value: counts.active, color: "text-emerald-700", bg: "bg-emerald-50" },
                        { label: "Expired", value: counts.expired, color: "text-red-600", bg: "bg-red-50" },
                        { label: "No Subscription", value: counts.none, color: "text-zinc-500", bg: "bg-zinc-50" },
                    ].map(({ label, value, color, bg }) => (
                        <article key={label} className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
                            <p className="text-xs text-zinc-500">{label}</p>
                            <p className={`mt-1 text-3xl font-bold ${color}`}>{value}</p>
                        </article>
                    ))}
                </section>

                {/* Filters */}
                <section className="flex flex-wrap items-center gap-3">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 sm:w-72"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    >
                        <option value="ALL">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="EXPIRED">Expired</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </section>

                {/* Table */}
                <section className="rounded-xl border border-emerald-100 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-emerald-50 text-left text-zinc-600">
                                <tr>
                                    <th className="px-4 py-3 font-medium">User</th>
                                    <th className="px-4 py-3 font-medium">Plan</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 font-medium">Days Left</th>
                                    <th className="px-4 py-3 font-medium">Expires</th>
                                    <th className="px-4 py-3 font-medium">Action</th>
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
                                            No users found.
                                        </td>
                                    </tr>
                                )}

                                {!isLoading && filtered.map((user) => {
                                    const isExpired = user.subscriptionStatus === "EXPIRED";
                                    const isExpiringSoon =
                                        user.subscriptionStatus === "ACTIVE" &&
                                        user.subscriptionDaysRemaining <= 3;

                                    return (
                                        <tr key={user.id}
                                            className={`border-b border-zinc-100 transition hover:bg-emerald-50/40 ${isExpired ? "bg-red-50/30" : ""
                                                }`}>

                                            {/* User */}
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-zinc-900">
                                                    {user.firstName} {user.lastName}
                                                </p>
                                                <p className="text-xs text-zinc-400">{user.email}</p>
                                            </td>

                                            {/* Plan */}
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${PLAN_STYLE[user.subscriptionPlan] ?? PLAN_STYLE.NONE
                                                    }`}>
                                                    {user.subscriptionPlan?.replace("_", " ") ?? "None"}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[user.subscriptionStatus] ?? STATUS_STYLE.NONE
                                                    }`}>
                                                    {user.subscriptionStatus ?? "None"}
                                                </span>
                                            </td>

                                            {/* Days left */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    {isExpiringSoon && (
                                                        <Clock size={13} className="text-amber-500" />
                                                    )}
                                                    <span className={`text-sm font-medium ${isExpired ? "text-red-500" :
                                                            isExpiringSoon ? "text-amber-500" :
                                                                "text-zinc-700"
                                                        }`}>
                                                        {user.subscriptionStatus === "NONE" || !user.subscriptionEndDate
                                                            ? "—"
                                                            : `${user.subscriptionDaysRemaining}d`
                                                        }
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Expires */}
                                            <td className="px-4 py-3 text-zinc-500">
                                                {user.subscriptionEndDate ?? "—"}
                                            </td>

                                            {/* Action */}
                                            <td className="px-4 py-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedUser(user)}
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
                                                >
                                                    <Crown size={12} />
                                                    {isExpired ? "Renew" : "Activate"}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            {selectedUser && (
                <ActivateModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onActivated={fetchUsers}
                />
            )}
        </>
    );
};

export default AdminSubscriptions;