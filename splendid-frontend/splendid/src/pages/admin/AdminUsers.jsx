import { useEffect, useState } from "react";
import {
    ShieldCheck, ShieldX, Loader2,
    ChevronDown, Users, Crown,
} from "lucide-react";
import PageTitle from "../../components/PageTitle";
import { getAllUsers, toggleUserVerification, activateUserSubscription } from "../../features/admin/adminAPI";
import { toast } from "react-hot-toast";

const PLANS = [
    { value: "FREE_TRIAL", label: "Free Trial  (7 days)" },
    { value: "MONTHLY", label: "Monthly     (30 days)" },
    { value: "HALF_YEARLY", label: "Half Yearly (180 days)" },
    { value: "YEARLY", label: "Yearly      (365 days)" },
];

const SubscriptionModal = ({ user, onClose, onActivated }) => {
    const [plan, setPlan] = useState("MONTHLY");
    const [isLoading, setIsLoading] = useState(false);

    const handleActivate = async () => {
        setIsLoading(true);
        try {
            await activateUserSubscription(user.id, plan);
            toast.success(`${plan.replace("_", " ")} activated for ${user.firstName}`);
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
                <div className="mb-4 flex items-center gap-2">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                        <Crown size={18} />
                    </span>
                    <div>
                        <h3 className="text-base font-semibold text-zinc-900">
                            Activate Subscription
                        </h3>
                        <p className="text-xs text-zinc-500">
                            {user.firstName} {user.lastName}
                        </p>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                        Select Plan
                    </label>
                    <select
                        value={plan}
                        onChange={(e) => setPlan(e.target.value)}
                        className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    >
                        {PLANS.map((p) => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                    </select>
                </div>

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

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [togglingId, setTogglingId] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {
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

    const handleToggleVerification = async (user) => {
        setTogglingId(user.id);
        try {
            await toggleUserVerification(user.id);
            setUsers((prev) => prev.map((u) =>
                u.id === user.id ? { ...u, verified: !u.verified } : u
            ));
            toast.success(`${user.firstName} ${user.verified ? "unverified" : "verified"} successfully`);
        } catch {
            toast.error("Failed to update verification");
        } finally {
            setTogglingId(null);
        }
    };

    const filtered = users.filter((u) => {
        const q = search.toLowerCase();
        return (
            u.firstName?.toLowerCase().includes(q) ||
            u.lastName?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q)
        );
    });

    return (
        <>
            <PageTitle title="Users | Admin | Splendid" />

            <div className="space-y-6">

                {/* Header */}
                <section className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                                <Users size={20} />
                            </span>
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                                    Users
                                </h2>
                                <p className="text-sm text-zinc-500">
                                    {users.length} total registered users
                                </p>
                            </div>
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or email..."
                            className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 sm:w-72"
                        />
                    </div>
                </section>

                {/* Table */}
                <section className="rounded-xl border border-emerald-100 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-emerald-50 text-left text-zinc-600">
                                <tr>
                                    <th className="px-4 py-3 font-medium">User</th>
                                    <th className="px-4 py-3 font-medium">Role</th>
                                    <th className="px-4 py-3 font-medium">Verified</th>
                                    <th className="px-4 py-3 font-medium">Transactions</th>
                                    <th className="px-4 py-3 font-medium">Joined</th>
                                    <th className="px-4 py-3 font-medium">Actions</th>
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

                                {!isLoading && filtered.map((user) => (
                                    <tr key={user.id}
                                        className="border-b border-zinc-100 transition hover:bg-emerald-50/50">
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-zinc-900">
                                                {user.firstName} {user.lastName}
                                            </p>
                                            <p className="text-xs text-zinc-400">{user.email}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${user.role === "ADMIN"
                                                    ? "bg-purple-100 text-purple-700"
                                                    : "bg-zinc-100 text-zinc-600"
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${user.verified
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-red-100 text-red-600"
                                                }`}>
                                                {user.verified ? "Verified" : "Unverified"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-zinc-600">
                                            {user.transactionCount}
                                        </td>
                                        <td className="px-4 py-3 text-zinc-500">
                                            {user.createdAt
                                                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                                                    year: "numeric", month: "short", day: "numeric"
                                                })
                                                : "—"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {/* Toggle verification */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleVerification(user)}
                                                    disabled={togglingId === user.id}
                                                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${user.verified
                                                            ? "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                                                            : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                                        } disabled:opacity-50`}
                                                >
                                                    {togglingId === user.id
                                                        ? <Loader2 size={12} className="animate-spin" />
                                                        : user.verified
                                                            ? <ShieldX size={12} />
                                                            : <ShieldCheck size={12} />
                                                    }
                                                    {user.verified ? "Unverify" : "Verify"}
                                                </button>

                                                {/* Activate subscription */}
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedUser(user)}
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
                                                >
                                                    <Crown size={12} />
                                                    Subscription
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            {selectedUser && (
                <SubscriptionModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onActivated={fetchUsers}
                />
            )}
        </>
    );
};

export default AdminUsers;