import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    Bell,
    CheckCheck,
    Megaphone,
    MessageSquare,
    LifeBuoy,
    CreditCard,
    AlertTriangle,
    Clock,
    Loader2,
} from "lucide-react";
import {
    getUserNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from "../../api/notificationAPI";
import { toast } from "react-hot-toast";

const getNotificationIcon = (type) => {
    switch (type) {
        case "BROADCAST":
            return <Megaphone size={15} className="text-purple-600" />;
        case "TICKET_REPLY":
            return <MessageSquare size={15} className="text-emerald-600" />;
        case "TICKET_STATUS":
            return <LifeBuoy size={15} className="text-sky-600" />;
        case "SUBSCRIPTION":
            return <CreditCard size={15} className="text-amber-600" />;
        case "BUDGET_ALERT":
            return <AlertTriangle size={15} className="text-red-600" />;
        case "SYSTEM":
        default:
            return <Bell size={15} className="text-zinc-600" />;
    }
};

const formatTimeAgo = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isMarkingAll, setIsMarkingAll] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const fetchNotificationsData = async () => {
        try {
            const [countRes, listRes] = await Promise.all([
                getUnreadNotificationCount(),
                getUserNotifications(),
            ]);

            const count = countRes.data?.unreadCount ?? countRes.unreadCount ?? countRes.data ?? 0;
            const list = listRes.data ?? listRes ?? [];

            setUnreadCount(Number(count));
            setNotifications(list);
        } catch {
            // Silently handle background refresh failures
        }
    };

    // Initial load and 30s polling
    useEffect(() => {
        fetchNotificationsData();
        const interval = setInterval(fetchNotificationsData, 30000);
        return () => clearInterval(interval);
    }, []);

    // Outside click & escape listener
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        const handleEscape = (e) => {
            if (e.key === "Escape") setIsOpen(false);
        };

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    const handleToggleDropdown = () => {
        if (!isOpen) {
            fetchNotificationsData();
        }
        setIsOpen((prev) => !prev);
    };

    const handleMarkAllRead = async () => {
        if (unreadCount === 0) return;
        setIsMarkingAll(true);
        try {
            await markAllNotificationsAsRead();
            setNotifications((prev) =>
                prev.map((n) => ({ ...n, isRead: true, read: true }))
            );
            setUnreadCount(0);
            toast.success("All notifications marked as read");
        } catch {
            toast.error("Failed to mark notifications as read");
        } finally {
            setIsMarkingAll(false);
        }
    };

    const handleNotificationClick = async (notification) => {
        const isAlreadyRead = notification.isRead || notification.read;
        if (!isAlreadyRead) {
            try {
                await markNotificationAsRead(notification.id);
                setNotifications((prev) =>
                    prev.map((n) =>
                        n.id === notification.id ? { ...n, isRead: true, read: true } : n
                    )
                );
                setUnreadCount((prev) => Math.max(0, prev - 1));
            } catch {
                // Ignore failure
            }
        }

        setIsOpen(false);

        // Navigation logic for reference IDs
        if (
            notification.referenceId &&
            (notification.type === "TICKET_REPLY" || notification.type === "TICKET_STATUS")
        ) {
            navigate(`/dashboard/support/${notification.referenceId}`);
        } else if (notification.type === "BUDGET_ALERT") {
            navigate("/dashboard/budgets");
        } else if (notification.type === "SUBSCRIPTION") {
            navigate("/packages");
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button with Badge */}
            <button
                type="button"
                onClick={handleToggleDropdown}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-600 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                aria-label="Notifications"
                aria-expanded={isOpen}
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Menu */}
            <div
                className={`absolute right-0 mt-2 w-80 sm:w-96 origin-top-right rounded-xl border border-emerald-100 bg-white shadow-xl transition-all duration-200 z-50 ${
                    isOpen
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none -translate-y-1 opacity-0"
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 bg-zinc-50/70 rounded-t-xl">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-zinc-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                                {unreadCount} new
                            </span>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={handleMarkAllRead}
                            disabled={isMarkingAll}
                            className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 transition hover:text-emerald-800 hover:underline disabled:opacity-50"
                        >
                            {isMarkingAll ? (
                                <Loader2 size={12} className="animate-spin" />
                            ) : (
                                <CheckCheck size={13} />
                            )}
                            <span>Mark all read</span>
                        </button>
                    )}
                </div>

                {/* Notifications List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100">
                    {notifications.length === 0 ? (
                        <div className="py-10 text-center text-zinc-400">
                            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 mb-2">
                                <Bell size={18} />
                            </div>
                            <p className="text-xs font-medium text-zinc-600">No notifications yet</p>
                            <p className="text-[11px] text-zinc-400">Updates and alerts will appear here</p>
                        </div>
                    ) : (
                        notifications.map((item) => {
                            const isRead = item.isRead || item.read;
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => handleNotificationClick(item)}
                                    className={`flex items-start gap-3 p-3.5 transition-all cursor-pointer ${
                                        isRead
                                            ? "bg-white hover:bg-zinc-50"
                                            : "bg-emerald-50/60 hover:bg-emerald-50/90"
                                    }`}
                                >
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white border border-zinc-200 shadow-2xs">
                                        {getNotificationIcon(item.type)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-1">
                                            <p
                                                className={`text-xs truncate ${
                                                    isRead
                                                        ? "font-medium text-zinc-800"
                                                        : "font-semibold text-zinc-900"
                                                }`}
                                            >
                                                {item.title}
                                            </p>
                                            <span className="text-[10px] text-zinc-400 whitespace-nowrap flex items-center gap-0.5">
                                                <Clock size={10} />
                                                {formatTimeAgo(item.createdAt)}
                                            </span>
                                        </div>
                                        <p className="mt-0.5 text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                                            {item.message}
                                        </p>
                                    </div>
                                    {!isRead && (
                                        <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-600 mt-1.5" />
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer link to Support */}
                <div className="border-t border-zinc-100 p-2 text-center bg-zinc-50/50 rounded-b-xl">
                    <button
                        type="button"
                        onClick={() => {
                            setIsOpen(false);
                            navigate("/dashboard/support");
                        }}
                        className="text-xs font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
                    >
                        Visit Help & Support Desk →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationDropdown;
