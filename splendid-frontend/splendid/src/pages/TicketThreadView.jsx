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
    Lock,
} from "lucide-react";
import PageTitle from "../components/PageTitle";
import { getTicketMessages, addTicketMessage, getMyTickets } from "../api/supportAPI";
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

const TicketThreadView = () => {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const loadTicketData = async () => {
        try {
            const [messagesRes, myTicketsRes] = await Promise.all([
                getTicketMessages(id),
                getMyTickets(),
            ]);

            setMessages(messagesRes.data ?? messagesRes ?? []);

            const rawTickets = myTicketsRes.data ?? myTicketsRes ?? [];
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
            toast.success("Message sent");
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to send message";
            toast.error(msg);
        } finally {
            setIsSending(false);
        }
    };

    const isClosed = ticket?.status === "CLOSED";

    return (
        <>
            <PageTitle
                title={
                    ticket
                        ? `${ticket.ticketNumber || `Ticket #${id}`} | Help & Support`
                        : "Support Ticket | Splendid"
                }
            />

            <div className="space-y-6 max-w-4xl mx-auto">
                {/* Back button */}
                <div>
                    <Link
                        to="/dashboard/support"
                        className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 hover:text-zinc-900"
                    >
                        <ArrowLeft size={16} />
                        <span>Back to My Tickets</span>
                    </Link>
                </div>

                {/* Ticket Header Card */}
                {ticket ? (
                    <section className="rounded-2xl border border-emerald-100 bg-white p-5 sm:p-6 shadow-sm">
                        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-100 pb-4">
                            <div>
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className="rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-900">
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

                            <div className="text-xs text-zinc-400">
                                Opened on{" "}
                                <strong className="text-zinc-600">
                                    {ticket.createdAt
                                        ? new Date(ticket.createdAt).toLocaleDateString("en-US", {
                                              dateStyle: "medium",
                                          })
                                        : "—"}
                                </strong>
                            </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                            <span className="flex items-center gap-1.5">
                                <Tag size={13} className="text-emerald-700" />
                                Category:{" "}
                                <strong className="text-zinc-700">
                                    {ticket.category?.replace("_", " ") || "GENERAL"}
                                </strong>
                            </span>
                        </div>
                    </section>
                ) : (
                    isLoading && (
                        <div className="h-28 animate-pulse rounded-2xl bg-zinc-200" />
                    )
                )}

                {/* Conversation Thread */}
                <section className="flex flex-col rounded-2xl border border-emerald-100 bg-white shadow-sm overflow-hidden min-h-[460px]">
                    <div className="border-b border-zinc-100 bg-zinc-50/70 px-5 py-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800">
                            <MessageSquare size={16} className="text-emerald-700" />
                            <span>Conversation History</span>
                        </div>
                        <span className="text-xs text-zinc-400">
                            {messages.length + (ticket?.description ? 1 : 0)} messages
                        </span>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 p-5 space-y-4 overflow-y-auto bg-gray-50/50 max-h-[500px]">
                        {/* Initial User Question */}
                        {ticket?.description && (
                            <div className="flex items-start justify-end gap-3">
                                <div className="max-w-xl rounded-2xl rounded-tr-none bg-emerald-700 p-4 text-sm text-white shadow-sm">
                                    <div className="flex items-center justify-between gap-4 mb-1">
                                        <p className="text-xs font-semibold text-emerald-100">
                                            You (Initial Request)
                                        </p>
                                        <span className="text-[10px] text-emerald-200">
                                            {ticket.createdAt
                                                ? new Date(ticket.createdAt).toLocaleTimeString([], {
                                                      hour: "2-digit",
                                                      minute: "2-digit",
                                                  })
                                                : ""}
                                        </span>
                                    </div>
                                    <p className="leading-relaxed whitespace-pre-wrap">
                                        {ticket.description}
                                    </p>
                                </div>
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-white font-semibold text-xs shadow">
                                    <User size={15} />
                                </div>
                            </div>
                        )}

                        {/* Chronological Messages */}
                        {messages.map((msg) => {
                            const isAdmin = msg.isAdminReply;
                            return (
                                <div
                                    key={msg.id}
                                    className={`flex items-start gap-3 ${
                                        isAdmin ? "justify-start" : "justify-end"
                                    }`}
                                >
                                    {isAdmin && (
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs shadow-2xs border border-emerald-200">
                                            <Shield size={15} />
                                        </div>
                                    )}

                                    <div
                                        className={`max-w-xl rounded-2xl p-4 text-sm shadow-sm ${
                                            isAdmin
                                                ? "rounded-tl-none border border-zinc-200 bg-white text-zinc-800"
                                                : "rounded-tr-none bg-emerald-700 text-white"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-4 mb-1">
                                            <p
                                                className={`text-xs font-semibold flex items-center gap-1 ${
                                                    isAdmin ? "text-zinc-900" : "text-emerald-100"
                                                }`}
                                            >
                                                {isAdmin ? "Splendid Support Team" : "You"}
                                            </p>
                                            <span
                                                className={`text-[10px] ${
                                                    isAdmin ? "text-zinc-400" : "text-emerald-200"
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

                                    {!isAdmin && (
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-white font-semibold text-xs shadow">
                                            <User size={15} />
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

                    {/* Reply Input Area */}
                    {isClosed ? (
                        <div className="border-t border-zinc-200 bg-zinc-50 p-4 text-center">
                            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-zinc-500">
                                <Lock size={14} />
                                <span>This ticket is closed and cannot receive additional replies.</span>
                            </div>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSendMessage}
                            className="border-t border-zinc-200 bg-white p-4"
                        >
                            <div className="relative">
                                <textarea
                                    rows={3}
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Write your reply or additional information here..."
                                    className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                />
                            </div>

                            <div className="mt-2.5 flex items-center justify-between">
                                <span className="text-xs text-zinc-400">
                                    Our support team will be notified of your reply
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
                    )}
                </section>
            </div>
        </>
    );
};

export default TicketThreadView;
