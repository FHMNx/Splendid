import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    LifeBuoy,
    Plus,
    Search,
    MessageSquare,
    Loader2,
    Clock,
    Tag,
    X,
    HelpCircle,
    CheckCircle2,
    AlertCircle,
    Send,
    ArrowRight,
} from "lucide-react";
import PageTitle from "../components/PageTitle";
import { getMyTickets, createTicket } from "../api/supportAPI";
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

const CATEGORIES = [
    { value: "GENERAL", label: "General Inquiry" },
    { value: "BILLING", label: "Billing & Subscriptions" },
    { value: "TECHNICAL", label: "Technical Issue / Bug" },
    { value: "ACCOUNT", label: "Account & Profile" },
    { value: "FEATURE_REQUEST", label: "Feature Suggestion" },
];

const PRIORITIES = [
    { value: "LOW", label: "Low Priority" },
    { value: "MEDIUM", label: "Medium Priority" },
    { value: "HIGH", label: "High Priority" },
    { value: "URGENT", label: "Urgent" },
];

// Create Ticket Modal Component
const CreateTicketModal = ({ isOpen, onClose, onTicketCreated }) => {
    const [subject, setSubject] = useState("");
    const [category, setCategory] = useState("GENERAL");
    const [priority, setPriority] = useState("MEDIUM");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!subject.trim()) {
            toast.error("Please provide a subject");
            return;
        }

        if (!description.trim()) {
            toast.error("Please provide a detailed description");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await createTicket({
                subject: subject.trim(),
                category,
                priority,
                description: description.trim(),
            });

            toast.success("Support ticket submitted successfully!");
            onTicketCreated(res.data ?? res);
            onClose();
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to create ticket";
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-2xl border border-emerald-100 bg-white p-6 shadow-2xl transition-all">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                            <LifeBuoy size={18} />
                        </span>
                        <div>
                            <h3 className="text-base font-semibold text-zinc-900">
                                Open New Support Ticket
                            </h3>
                            <p className="text-xs text-zinc-500">
                                Describe your issue and our team will get back to you shortly.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                            Subject <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Brief summary of your question or issue"
                            maxLength={120}
                            className="w-full rounded-lg border border-emerald-200 bg-white px-3.5 py-2 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                                Category
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                                Priority Level
                            </label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                            >
                                {PRIORITIES.map((pri) => (
                                    <option key={pri.value} value={pri.value}>
                                        {pri.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Please provide details, steps to reproduce, or any questions..."
                            className="w-full rounded-lg border border-emerald-200 bg-white px-3.5 py-2 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                            required
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !subject.trim() || !description.trim()}
                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-600 disabled:bg-emerald-300 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={15} className="animate-spin" />
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                <>
                                    <Send size={15} />
                                    <span>Submit Ticket</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const SupportTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    const fetchTickets = async () => {
        setIsLoading(true);
        try {
            const res = await getMyTickets();
            setTickets(res.data ?? res ?? []);
        } catch {
            toast.error("Failed to load your support tickets");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleTicketCreated = (newTicket) => {
        setTickets((prev) => [newTicket, ...prev]);
    };

    const filteredTickets = tickets.filter((ticket) => {
        const matchesStatus = statusFilter === "ALL" || ticket.status === statusFilter;
        const q = searchQuery.toLowerCase();
        const matchesSearch =
            !q ||
            ticket.ticketNumber?.toLowerCase().includes(q) ||
            ticket.subject?.toLowerCase().includes(q) ||
            ticket.category?.toLowerCase().includes(q);

        return matchesStatus && matchesSearch;
    });

    const openCount = tickets.filter((t) => t.status === "OPEN" || t.status === "IN_PROGRESS").length;
    const resolvedCount = tickets.filter((t) => t.status === "RESOLVED" || t.status === "CLOSED").length;

    return (
        <>
            <PageTitle title="Help & Support | Splendid" />

            <div className="space-y-6">
                {/* Header Banner */}
                <section className="rounded-2xl border border-emerald-100 bg-white p-5 sm:p-6 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                <LifeBuoy size={24} />
                            </span>
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                                    Help & Support Desk
                                </h2>
                                <p className="text-sm text-zinc-500">
                                    Submit inquiries, track existing tickets, and get assistance from our team
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 hover:shadow"
                        >
                            <Plus size={16} />
                            <span>Open New Ticket</span>
                        </button>
                    </div>

                    {/* Quick Metric Stats */}
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-zinc-100 pt-5">
                        <div className="rounded-xl bg-zinc-50 p-3.5 border border-zinc-100">
                            <p className="text-xs font-medium text-zinc-500">Total Tickets</p>
                            <p className="text-xl font-bold text-zinc-900 mt-0.5">{tickets.length}</p>
                        </div>
                        <div className="rounded-xl bg-sky-50/70 p-3.5 border border-sky-100">
                            <p className="text-xs font-medium text-sky-700">Active / In Progress</p>
                            <p className="text-xl font-bold text-sky-900 mt-0.5">{openCount}</p>
                        </div>
                        <div className="rounded-xl bg-emerald-50/70 p-3.5 border border-emerald-100">
                            <p className="text-xs font-medium text-emerald-700">Resolved / Closed</p>
                            <p className="text-xl font-bold text-emerald-900 mt-0.5">{resolvedCount}</p>
                        </div>
                    </div>
                </section>

                {/* Filters & Search Bar */}
                <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
                    {/* Status tabs */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        {["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((st) => (
                            <button
                                key={st}
                                type="button"
                                onClick={() => setStatusFilter(st)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                                    statusFilter === st
                                        ? "bg-emerald-700 text-white font-semibold"
                                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                                }`}
                            >
                                {st.replace("_", " ")}
                            </button>
                        ))}
                    </div>

                    {/* Search query */}
                    <div className="relative w-full sm:w-64">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search your tickets..."
                            className="w-full rounded-lg border border-emerald-200 bg-white pl-9 pr-3 py-1.5 text-xs text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                    </div>
                </section>

                {/* Ticket Cards Grid */}
                <div className="space-y-3">
                    {isLoading &&
                        Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-28 animate-pulse rounded-xl border border-zinc-200 bg-zinc-100"
                            />
                        ))}

                    {!isLoading && filteredTickets.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 mb-3">
                                <HelpCircle size={24} />
                            </div>
                            <h3 className="text-base font-semibold text-zinc-800">No support tickets found</h3>
                            <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
                                Need help with transactions, budgets, or your subscription? Click below to submit a question.
                            </p>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-600 transition"
                            >
                                <Plus size={14} />
                                <span>Create Your First Ticket</span>
                            </button>
                        </div>
                    )}

                    {!isLoading &&
                        filteredTickets.map((ticket) => (
                            <div
                                key={ticket.id}
                                className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="space-y-1.5 max-w-2xl">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="rounded-md bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-900 border border-emerald-100">
                                                {ticket.ticketNumber || `#SPL-${ticket.id}`}
                                            </span>
                                            <span
                                                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                                                    STATUS_BADGES[ticket.status] || "bg-zinc-100 text-zinc-600"
                                                }`}
                                            >
                                                {ticket.status?.replace("_", " ")}
                                            </span>
                                            <span
                                                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                                                    PRIORITY_BADGES[ticket.priority] || "bg-zinc-100 text-zinc-600"
                                                }`}
                                            >
                                                {ticket.priority}
                                            </span>
                                            <span className="text-xs text-zinc-400 font-medium">
                                                • {ticket.category?.replace("_", " ") || "GENERAL"}
                                            </span>
                                        </div>

                                        <h3 className="text-base font-semibold text-zinc-900">
                                            {ticket.subject}
                                        </h3>

                                        <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                                            {ticket.description}
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:items-end justify-between gap-3 shrink-0">
                                        <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                                            <Clock size={12} />
                                            {ticket.createdAt
                                                ? new Date(ticket.createdAt).toLocaleDateString("en-US", {
                                                      month: "short",
                                                      day: "numeric",
                                                      year: "numeric",
                                                  })
                                                : "—"}
                                        </span>

                                        <Link
                                            to={`/dashboard/support/${ticket.id}`}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 hover:text-emerald-900"
                                        >
                                            <MessageSquare size={13} />
                                            <span>View Thread</span>
                                            <ArrowRight size={12} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {/* Create Ticket Modal */}
            <CreateTicketModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onTicketCreated={handleTicketCreated}
            />
        </>
    );
};

export default SupportTickets;
