import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LifeBuoy, ChevronLeft, ChevronRight, MessageSquare, Search, Filter, ArrowUpRight } from "lucide-react";
import PageTitle from "../../components/PageTitle";
import { getAllTicketsAdmin } from "../../api/supportAPI";
import { toast } from "react-hot-toast";

const PRIORITY_BADGES = {
    URGENT: "bg-red-100 text-red-700 border-red-200",
    HIGH: "bg-orange-100 text-orange-700 border-orange-200",
    MEDIUM: "bg-amber-100 text-amber-700 border-amber-200",
    LOW: "bg-blue-100 text-blue-700 border-blue-200",
};

const STATUS_BADGES = {
    OPEN: "bg-sky-100 text-sky-700 border-sky-200",
    IN_PROGRESS: "bg-amber-100 text-amber-700 border-amber-200",
    RESOLVED: "bg-emerald-100 text-emerald-700 border-emerald-200",
    CLOSED: "bg-zinc-100 text-zinc-600 border-zinc-200",
};

const CATEGORY_BADGES = {
    BILLING: "bg-purple-50 text-purple-700 border-purple-200",
    TECHNICAL: "bg-cyan-50 text-cyan-700 border-cyan-200",
    ACCOUNT: "bg-indigo-50 text-indigo-700 border-indigo-200",
    FEATURE_REQUEST: "bg-emerald-50 text-emerald-700 border-emerald-200",
    GENERAL: "bg-zinc-100 text-zinc-700 border-zinc-200",
};

const AdminTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize] = useState(10);
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    const fetchTickets = async () => {
        setIsLoading(true);
        try {
            const res = await getAllTicketsAdmin(currentPage - 1, pageSize);
            const raw = res.data ?? res;
            setTickets(raw.content ?? []);
            setTotalPages(raw.totalPages ?? 1);
            setTotalElements(raw.totalElements ?? 0);
        } catch (err) {
            toast.error("Failed to load support tickets");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [currentPage, pageSize]);

    const filteredTickets = tickets.filter((ticket) => {
        const matchesStatus = statusFilter === "ALL" || ticket.status === statusFilter;
        const q = searchQuery.toLowerCase();
        const matchesSearch =
            !q ||
            ticket.ticketNumber?.toLowerCase().includes(q) ||
            ticket.subject?.toLowerCase().includes(q) ||
            ticket.userEmail?.toLowerCase().includes(q) ||
            ticket.userName?.toLowerCase().includes(q) ||
            ticket.category?.toLowerCase().includes(q);

        return matchesStatus && matchesSearch;
    });

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <>
            <PageTitle title="Support Tickets | Admin | Splendid" />

            <div className="space-y-6">
                {/* Header */}
                <section className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                                <LifeBuoy size={20} />
                            </span>
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                                    Support Tickets Desk
                                </h2>
                                <p className="text-sm text-zinc-500">
                                    {totalElements} total user support inquiries
                                </p>
                            </div>
                        </div>

                        {/* Search input */}
                        <div className="relative w-full sm:w-72">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by ticket #, user, subject..."
                                className="w-full rounded-lg border border-emerald-200 bg-white pl-9 pr-3 py-2 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                            />
                        </div>
                    </div>

                    {/* Status Filters */}
                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-3">
                        <span className="text-xs font-medium text-zinc-500 flex items-center gap-1 mr-1">
                            <Filter size={12} /> Status:
                        </span>
                        {["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((st) => (
                            <button
                                key={st}
                                type="button"
                                onClick={() => setStatusFilter(st)}
                                className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                                    statusFilter === st
                                        ? "bg-emerald-700 text-white"
                                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                                }`}
                            >
                                {st.replace("_", " ")}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Tickets Table */}
                <section className="rounded-xl border border-emerald-100 bg-white shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-emerald-50 text-left text-zinc-600">
                                <tr>
                                    <th className="px-4 py-3.5 font-semibold">Ticket ID</th>
                                    <th className="px-4 py-3.5 font-semibold">User</th>
                                    <th className="px-4 py-3.5 font-semibold">Subject</th>
                                    <th className="px-4 py-3.5 font-semibold">Category</th>
                                    <th className="px-4 py-3.5 font-semibold">Priority</th>
                                    <th className="px-4 py-3.5 font-semibold">Status</th>
                                    <th className="px-4 py-3.5 font-semibold">Date</th>
                                    <th className="px-4 py-3.5 font-semibold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {isLoading &&
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i}>
                                            {Array.from({ length: 8 }).map((__, j) => (
                                                <td key={j} className="px-4 py-4">
                                                    <div className="h-4 animate-pulse rounded bg-zinc-200" />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}

                                {!isLoading && filteredTickets.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-12 text-center text-zinc-400">
                                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-50 text-zinc-400 mb-2">
                                                <LifeBuoy size={24} />
                                            </div>
                                            <p className="font-medium text-zinc-600">No support tickets found</p>
                                            <p className="text-xs text-zinc-400 mt-0.5">Try adjusting your filters or search query.</p>
                                        </td>
                                    </tr>
                                )}

                                {!isLoading &&
                                    filteredTickets.map((ticket) => (
                                        <tr
                                            key={ticket.id}
                                            className="transition hover:bg-emerald-50/40"
                                        >
                                            {/* Ticket ID */}
                                            <td className="px-4 py-3.5 font-semibold text-emerald-900">
                                                {ticket.ticketNumber || `#SPL-${ticket.id}`}
                                            </td>

                                            {/* User */}
                                            <td className="px-4 py-3.5">
                                                <p className="font-medium text-zinc-900">{ticket.userName || "User"}</p>
                                                <p className="text-xs text-zinc-400">{ticket.userEmail}</p>
                                            </td>

                                            {/* Subject */}
                                            <td className="px-4 py-3.5 max-w-xs">
                                                <p className="font-medium text-zinc-900 truncate" title={ticket.subject}>
                                                    {ticket.subject}
                                                </p>
                                                {ticket.description && (
                                                    <p className="text-xs text-zinc-500 truncate" title={ticket.description}>
                                                        {ticket.description}
                                                    </p>
                                                )}
                                            </td>

                                            {/* Category */}
                                            <td className="px-4 py-3.5">
                                                <span
                                                    className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${
                                                        CATEGORY_BADGES[ticket.category] || "bg-zinc-100 text-zinc-600 border-zinc-200"
                                                    }`}
                                                >
                                                    {ticket.category ? ticket.category.replace("_", " ") : "GENERAL"}
                                                </span>
                                            </td>

                                            {/* Priority */}
                                            <td className="px-4 py-3.5">
                                                <span
                                                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                                                        PRIORITY_BADGES[ticket.priority] || "bg-zinc-100 text-zinc-600 border-zinc-200"
                                                    }`}
                                                >
                                                    {ticket.priority || "MEDIUM"}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="px-4 py-3.5">
                                                <span
                                                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                                                        STATUS_BADGES[ticket.status] || "bg-zinc-100 text-zinc-600 border-zinc-200"
                                                    }`}
                                                >
                                                    {ticket.status ? ticket.status.replace("_", " ") : "OPEN"}
                                                </span>
                                            </td>

                                            {/* Date */}
                                            <td className="px-4 py-3.5 text-xs text-zinc-500 whitespace-nowrap">
                                                {ticket.createdAt
                                                    ? new Date(ticket.createdAt).toLocaleDateString("en-US", {
                                                          month: "short",
                                                          day: "numeric",
                                                          year: "numeric",
                                                      })
                                                    : "—"}
                                            </td>

                                            {/* Action */}
                                            <td className="px-4 py-3.5 text-right whitespace-nowrap">
                                                <Link
                                                    to={`/admin/tickets/${ticket.id}`}
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 hover:text-emerald-900"
                                                >
                                                    <MessageSquare size={13} />
                                                    <span>View & Reply</span>
                                                    <ArrowUpRight size={12} className="text-emerald-600" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 px-4 py-3.5 bg-white">
                        <p className="text-xs text-zinc-500">
                            Page {currentPage} of {totalPages} ({totalElements} total tickets)
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2.5 py-1.5 text-xs text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50"
                            >
                                <ChevronLeft size={14} /> Previous
                            </button>
                            {pageNumbers.map((n) => (
                                <button
                                    key={n}
                                    type="button"
                                    onClick={() => setCurrentPage(n)}
                                    className={`h-7 w-7 rounded-md text-xs font-medium transition ${
                                        currentPage === n
                                            ? "bg-emerald-700 text-white font-semibold"
                                            : "text-zinc-700 hover:bg-emerald-50"
                                    }`}
                                >
                                    {n}
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2.5 py-1.5 text-xs text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50"
                            >
                                Next <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default AdminTickets;
