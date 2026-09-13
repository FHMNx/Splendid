import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
    ArrowLeft,
    Send,
    Loader2,
    Shield,
    User,
    Clock,
    Tag,
    AlertCircle,
    CheckCircle2,
    MessageSquare,
    ChevronDown,
} from "lucide-react";
import PageTitle from "../../components/PageTitle";
import {
    getTicketMessages,
    addTicketMessage,
    updateTicketStatusAdmin,
    getAllTicketsAdmin,
} from "../../api/supportAPI";
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

const STATUS_OPTIONS = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

const AdminTicketDetails = () => {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const loadTicketData = async () => {
        try {
            const [messagesRes, ticketsRes] = await Promise.all([
                getTicketMessages(id),
                getAllTicketsAdmin(0, 100),
            ]);

            setMessages(messagesRes.data ?? messagesRes ?? []);

            const rawTickets = ticketsRes.data?.content ?? ticketsRes.content ?? ticketsRes.data ?? [];
            const foundTicket = rawTickets.find((t) => String(t.id) === String(id));
            if (foundTicket) {
                setTicket(foundTicket);
            }
        } catch (err) {
            toast.error("Failed to load ticket conversation");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadTicketData();
    }, [id]);

    useEffect(() => {
        if (!isLoading) {
            scrollToBottom();
        }
    }, [messages, isLoading]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setIsSending(true);
        try {
            const res = await addTicketMessage(id, { message: newMessage.trim() });
            const savedMsg = res.data ?? res;
            setMessages((prev) => [...prev, savedMsg]);
            setNewMessage("");
            toast.success("Reply sent to user");

            // If ticket was OPEN, optionally reflect IN_PROGRESS
            if (ticket && ticket.status === "OPEN") {
                setTicket((prev) => ({ ...prev, status: "IN_PROGRESS" }));
            }
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to send message";
            toast.error(msg);
        } finally {
            setIsSending(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        if (!ticket || ticket.status === newStatus) return;

        setIsUpdatingStatus(true);
        try {
            await updateTicketStatusAdmin(id, newStatus);
            setTicket((prev) => ({ ...prev, status: newStatus }));
            toast.success(`Ticket status updated to ${newStatus.replace("_", " ")}`);
        } catch (err) {
            toast.error("Failed to update status");
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    return (
        <>
            <PageTitle
                title={
                    ticket
                        ? `${ticket.ticketNumber || `Ticket #${id}`} | Admin Support`
                        : "Ticket Details | Admin Support"
                }
            />

            <div className="space-y-6 max-w-5xl mx-auto">
                {/* Back navigation & Quick Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Link
                        to="/admin/tickets"
                        className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 hover:text-zinc-900"
                    >
                        <ArrowLeft size={16} />
                        <span>Back to Tickets</span>
                    </Link>

                    {/* Status Dropdown */}
                    {ticket && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                                Ticket Status:
                            </span>
                            <div className="relative">
                                <select
                                    value={ticket.status}
                                    disabled={isUpdatingStatus}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    className={`appearance-none rounded-lg border font-semibold text-xs px-3.5 py-2 pr-8 outline-none transition cursor-pointer shadow-sm disabled:opacity-60 ${
                                        STATUS_BADGES[ticket.status] || "bg-zinc-100 text-zinc-800 border-zinc-200"
                                    }`}
                                >
                                    {STATUS_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt} className="bg-white text-zinc-800">
                                            {opt.replace("_", " ")}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    size={14}
                                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Ticket Header Overview Card */}
                {ticket ? (
                    <section className="rounded-xl border border-emerald-100 bg-white p-5 sm:p-6 shadow-sm">
                        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-100 pb-4">
                            <div>
                                <div className="flex items-center gap-2.5 mb-1.5">
                                    <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-900 tracking-wide">
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
                                        {ticket.priority} Priority
                                    </span>
                                </div>
                                <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                                    {ticket.subject}
                                </h2>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-zinc-500">
                                <div className="text-right">
                                    <p className="font-semibold text-zinc-800">
                                        {ticket.userName || "User"}
                                    </p>
                                    <p className="text-zinc-400">{ticket.userEmail}</p>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm">
                                    {(ticket.userName || ticket.userEmail || "U").charAt(0).toUpperCase()}
                                </div>
                            </div>
                        </div>

                        {/* Metadata bar */}
                        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                            <span className="flex items-center gap-1.5">
                                <Tag size={13} className="text-emerald-700" />
                                Category:{" "}
                                <strong className="text-zinc-700">
                                    {ticket.category?.replace("_", " ") || "GENERAL"}
                                </strong>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock size={13} className="text-emerald-700" />
                                Created:{" "}
                                <strong className="text-zinc-700">
                                    {ticket.createdAt
                                        ? new Date(ticket.createdAt).toLocaleString("en-US", {
                                              dateStyle: "medium",
                                              timeStyle: "short",
                                          })
                                        : "—"}
                                </strong>
                            </span>
                        </div>
                    </section>
                ) : (
                    isLoading && (
                        <div className="h-28 animate-pulse rounded-xl bg-zinc-200 border border-zinc-200" />
                    )
                )}

                {/* Conversation & Reply Thread */}
                <section className="flex flex-col rounded-xl border border-emerald-100 bg-white shadow-sm overflow-hidden min-h-[480px]">
                    <div className="border-b border-zinc-100 bg-zinc-50/70 px-5 py-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800">
                            <MessageSquare size={16} className="text-emerald-700" />
                            <span>Conversation History</span>
                        </div>
                        <span className="text-xs text-zinc-400">
                            {messages.length + (ticket?.description ? 1 : 0)} total messages
                        </span>
                    </div>

                    {/* Messages Scroll Area */}
                    <div className="flex-1 p-5 space-y-4 overflow-y-auto bg-gray-50/50 max-h-[500px]">
                        {/* Initial User Inquiry Description */}
                        {ticket?.description && (
                            <div className="flex items-start gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-zinc-700 font-semibold text-xs">
                                    <User size={15} />
                                </div>
                                <div className="max-w-xl rounded-2xl rounded-tl-none border border-zinc-200 bg-white p-4 text-sm shadow-sm">
                                    <div className="flex items-center justify-between gap-4 mb-1">
                                        <p className="font-semibold text-zinc-900 text-xs">
                                            {ticket.userName || "User"} <span className="text-zinc-400 font-normal">(Author)</span>
                                        </p>
                                        <span className="text-[10px] text-zinc-400">
                                            {ticket.createdAt
                                                ? new Date(ticket.createdAt).toLocaleTimeString([], {
                                                      hour: "2-digit",
                                                      minute: "2-digit",
                                                  })
                                                : ""}
                                        </span>
                                    </div>
                                    <p className="text-zinc-700 leading-relaxed whitespace-pre-wrap">
                                        {ticket.description}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Chronological Chat Messages */}
                        {messages.map((msg) => {
                            const isAdmin = msg.isAdminReply;
                            return (
                                <div
                                    key={msg.id}
                                    className={`flex items-start gap-3 ${
                                        isAdmin ? "justify-end" : "justify-start"
                                    }`}
                                >
                                    {!isAdmin && (
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-zinc-700 font-semibold text-xs">
                                            <User size={15} />
                                        </div>
                                    )}

                                    <div
                                        className={`max-w-xl rounded-2xl p-4 text-sm shadow-sm ${
                                            isAdmin
                                                ? "rounded-tr-none bg-emerald-700 text-white"
                                                : "rounded-tl-none border border-zinc-200 bg-white text-zinc-800"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-4 mb-1">
                                            <p
                                                className={`text-xs font-semibold flex items-center gap-1 ${
                                                    isAdmin ? "text-emerald-100" : "text-zinc-900"
                                                }`}
                                            >
                                                {isAdmin && <Shield size={12} />}
                                                {msg.senderName || (isAdmin ? "Support Team" : "User")}
                                            </p>
                                            <span
                                                className={`text-[10px] ${
                                                    isAdmin ? "text-emerald-200" : "text-zinc-400"
                                                }`}
                                            >
                                                {msg.createdAt
                                                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                      })
                                                    : ""}
                                            </span>
                                        </div>
                                        <p className="leading-relaxed whitespace-pre-wrap">
                                            {msg.message}
                                        </p>
                                    </div>

                                    {isAdmin && (
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-white font-semibold text-xs shadow">
                                            <Shield size={15} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {isLoading && messages.length === 0 && (
                            <div className="flex justify-center py-10">
                                <Loader2 size={24} className="animate-spin text-emerald-600" />
                            </div>
                        )}

                        <div ref={chatEndRef} />
                    </div>

                    {/* Admin Reply Form */}
                    <form
                        onSubmit={handleSendMessage}
                        className="border-t border-zinc-200 bg-white p-4"
                    >
                        <div className="relative">
                            <textarea
                                rows={3}
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your response to the user... (Press Send when done)"
                                className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                            />
                        </div>

                        <div className="mt-2.5 flex items-center justify-between">
                            <span className="text-xs text-zinc-400">
                                Replying as <strong>Support Team</strong> (User will receive an email notification)
                            </span>
                            <button
                                type="submit"
                                disabled={isSending || !newMessage.trim()}
                                className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-600 disabled:bg-emerald-300 disabled:cursor-not-allowed"
                            >
                                {isSending ? (
                                    <>
                                        <Loader2 size={15} className="animate-spin" />
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send size={15} />
                                        <span>Send Reply</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </>
    );
};

export default AdminTicketDetails;
