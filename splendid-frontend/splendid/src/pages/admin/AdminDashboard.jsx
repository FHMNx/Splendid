import { useEffect, useState } from "react";
import {
    Users, ArrowUpRight, ArrowDownRight,
    ReceiptText, TrendingUp, ShieldCheck,
    ShieldX, Target,
} from "lucide-react";
import PageTitle from "../../components/PageTitle";
import { getAdminStats } from "../../features/admin/adminAPI";
import { toast } from "react-hot-toast";

const StatCard = ({ title, value, icon: Icon, tone = "default", subtitle }) => {
    const toneClass =
        tone === "income" ? "text-emerald-700" :
            tone === "expense" ? "text-red-600" :
                tone === "info" ? "text-blue-600" :
                    "text-zinc-900";

    const iconBg =
        tone === "income" ? "bg-emerald-50 text-emerald-700" :
            tone === "expense" ? "bg-red-50 text-red-600" :
                tone === "info" ? "bg-blue-50 text-blue-600" :
                    "bg-zinc-50 text-zinc-600";

    return (
        <article className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
                <p className="text-sm font-medium text-zinc-500">{title}</p>
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}>
                    <Icon size={18} />
                </span>
            </div>
            <p className={`mt-3 text-3xl font-bold tracking-tight ${toneClass}`}>
                {value}
            </p>
            {subtitle && (
                <p className="mt-1 text-xs text-zinc-400">{subtitle}</p>
            )}
        </article>
    );
};

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getAdminStats();
                setStats(res.data);
            } catch {
                toast.error("Failed to load stats");
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const LoadingSkeleton = () => (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-32 animate-pulse rounded-xl bg-zinc-100" />
            ))}
        </div>
    );

    return (
        <>
            <PageTitle title="Admin Dashboard | Splendid" />

            <div className="space-y-6">

                {/* Header */}
                <section className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                        Platform Overview
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">
                        Real-time statistics across all users and transactions.
                    </p>
                </section>

                {/* Stats */}
                {isLoading ? <LoadingSkeleton /> : (
                    <>
                        {/* Users */}
                        <div>
                            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400">
                                Users
                            </h3>
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                <StatCard
                                    title="Total Users"
                                    value={stats?.totalUsers ?? 0}
                                    icon={Users}
                                    subtitle="All registered accounts"
                                />
                                <StatCard
                                    title="Verified Users"
                                    value={stats?.verifiedUsers ?? 0}
                                    icon={ShieldCheck}
                                    tone="income"
                                    subtitle="Email confirmed"
                                />
                                <StatCard
                                    title="Unverified Users"
                                    value={stats?.unverifiedUsers ?? 0}
                                    icon={ShieldX}
                                    tone="expense"
                                    subtitle="Pending verification"
                                />
                            </div>
                        </div>

                        {/* Transactions */}
                        <div>
                            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400">
                                Transactions & Budgets
                            </h3>
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                <StatCard
                                    title="Total Transactions"
                                    value={stats?.totalTransactions ?? 0}
                                    icon={ReceiptText}
                                    subtitle="Across all users"
                                />
                                <StatCard
                                    title="Total Budgets"
                                    value={stats?.totalBudgets ?? 0}
                                    icon={Target}
                                    tone="info"
                                    subtitle="Active budget goals"
                                />
                            </div>
                        </div>

                        {/* Finance */}
                        <div>
                            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400">
                                Platform Financials
                            </h3>
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                <StatCard
                                    title="Platform Total Income"
                                    value={`LKR ${Number(stats?.platformTotalIncome ?? 0).toLocaleString("en-LK", { minimumFractionDigits: 2 })}`}
                                    icon={ArrowUpRight}
                                    tone="income"
                                    subtitle="Sum of all user incomes"
                                />
                                <StatCard
                                    title="Platform Total Expense"
                                    value={`LKR ${Number(stats?.platformTotalExpense ?? 0).toLocaleString("en-LK", { minimumFractionDigits: 2 })}`}
                                    icon={ArrowDownRight}
                                    tone="expense"
                                    subtitle="Sum of all user expenses"
                                />
                                <StatCard
                                    title="Net Platform Balance"
                                    value={`LKR ${Number(stats?.platformNetBalance ?? 0).toLocaleString("en-LK", { minimumFractionDigits: 2 })}`}
                                    icon={TrendingUp}
                                    tone={Number(stats?.platformNetBalance ?? 0) >= 0 ? "income" : "expense"}
                                    subtitle="Income minus expenses"
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default AdminDashboard;