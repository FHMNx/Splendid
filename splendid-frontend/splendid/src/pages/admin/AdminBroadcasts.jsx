import { useState } from "react";
import { Megaphone, Send, Loader2, Bell, Info, Sparkles } from "lucide-react";
import PageTitle from "../../components/PageTitle";
import { sendAdminBroadcast } from "../../api/notificationAPI";
import { toast } from "react-hot-toast";

const AdminBroadcasts = () => {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);

    const handleSendBroadcast = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error("Please enter a broadcast title");
            return;
        }

        if (!message.trim()) {
            toast.error("Please enter a broadcast message");
            return;
        }

        setIsSending(true);
        try {
            await sendAdminBroadcast({
                title: title.trim(),
                message: message.trim(),
            });
            toast.success("Broadcast sent to all users successfully!");
            setTitle("");
            setMessage("");
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Failed to send broadcast";
            toast.error(errorMsg);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <>
            <PageTitle title="Broadcasts | Admin | Splendid" />

            <div className="space-y-6">
                {/* Header */}
                <section className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                            <Megaphone size={20} />
                        </span>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                                System Broadcasts
                            </h2>
                            <p className="text-sm text-zinc-500">
                                Broadcast instant announcements and updates to all registered users
                            </p>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Form Column */}
                    <div className="lg:col-span-2">
                        <form
                            onSubmit={handleSendBroadcast}
                            className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm space-y-5"
                        >
                            <div className="border-b border-zinc-100 pb-4">
                                <h3 className="text-lg font-semibold text-zinc-900">
                                    Compose Broadcast
                                </h3>
                                <p className="text-xs text-zinc-500 mt-0.5">
                                    This message will appear in every active user's notification feed.
                                </p>
                            </div>

                            {/* Title Field */}
                            <div>
                                <label
                                    htmlFor="broadcast-title"
                                    className="block text-sm font-medium text-zinc-700 mb-1.5"
                                >
                                    Broadcast Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="broadcast-title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Scheduled System Maintenance / New Feature Alert"
                                    maxLength={120}
                                    className="w-full rounded-lg border border-emerald-200 bg-white px-3.5 py-2.5 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                    required
                                />
                                <div className="mt-1 flex justify-end">
                                    <span className="text-xs text-zinc-400">
                                        {title.length}/120
                                    </span>
                                </div>
                            </div>

                            {/* Message Field */}
                            <div>
                                <label
                                    htmlFor="broadcast-message"
                                    className="block text-sm font-medium text-zinc-700 mb-1.5"
                                >
                                    Message Body <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="broadcast-message"
                                    rows={5}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Write your announcement or notice here..."
                                    className="w-full rounded-lg border border-emerald-200 bg-white px-3.5 py-2.5 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                    required
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center justify-between pt-2">
                                <span className="text-xs text-zinc-400 flex items-center gap-1">
                                    <Sparkles size={14} className="text-emerald-600" />
                                    Broadcasts are delivered in real-time
                                </span>
                                <button
                                    type="submit"
                                    disabled={isSending || !title.trim() || !message.trim()}
                                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-600 disabled:bg-emerald-300 disabled:cursor-not-allowed"
                                >
                                    {isSending ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            <span>Sending Broadcast...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send size={16} />
                                            <span>Send Broadcast</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Preview & Info Column */}
                    <div className="space-y-6">
                        {/* Live Notification Preview */}
                        <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm space-y-3">
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                                <Bell size={14} />
                                <span>User Feed Preview</span>
                            </div>
                            <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 transition-all">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs">
                                        <Megaphone size={14} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-semibold text-zinc-900 truncate">
                                                {title.trim() || "Broadcast Title Preview"}
                                            </p>
                                            <span className="text-[10px] text-zinc-400 shrink-0 ml-2">Just now</span>
                                        </div>
                                        <p className="mt-1 text-xs text-zinc-600 leading-relaxed break-words whitespace-pre-wrap">
                                            {message.trim() || "Your announcement message will render here for all users."}
                                        </p>
                                        <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-800">
                                            BROADCAST
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Best Practices Info */}
                        <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-5 space-y-3 text-xs text-zinc-600">
                            <div className="flex items-center gap-2 font-semibold text-zinc-800">
                                <Info size={15} className="text-zinc-500" />
                                <span>Broadcast Guidelines</span>
                            </div>
                            <ul className="space-y-2 list-disc list-inside text-zinc-500 leading-relaxed">
                                <li>Use concise, clear titles that describe the purpose of the alert.</li>
                                <li>Broadcasts create a new unread item in every user's notification list.</li>
                                <li>Ideal for announcing scheduled maintenance, new releases, or critical billing notices.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminBroadcasts;
