import { useEffect, useRef, useState } from "react";
import { Bot, Loader2, Send, Sparkles, X } from "lucide-react";
import { sendMessageToGroq } from "../services/groqService";

const WELCOME_MESSAGE = {
    role: "assistant",
    content: "Hi! I'm Penny 👋 your personal finance assistant. I can see your income, expenses, and budgets. Ask me anything - like \"How's my spending this month?\" or \"Where should I cut back?\"",
};

const AIChatPanel = ({ isOpen, onClose, financialContext }) => {
    const [messages, setMessages] = useState([WELCOME_MESSAGE]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    // scroll to bottom when new message arrives
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // focus input when panel opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed || isLoading) return;

        const userMessage = { role: "user", content: trimmed };
        const updatedMessages = [...messages, userMessage];

        setMessages(updatedMessages);
        setInput("");
        setIsLoading(true);

        try {
            // only send actual conversation (exclude welcome message from API)
            const apiMessages = updatedMessages.filter((_, i) => i > 0);
            const reply = await sendMessageToGroq(apiMessages, financialContext);

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: reply },
            ]);
        } catch (error) {
            console.error("Groq error:", error.message);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: `Error: ${error.message}`,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleClear = () => {
        setMessages([WELCOME_MESSAGE]);
    };

    return (
        <>
            {/* Backdrop — mobile only */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/20 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Slide-in Panel */}
            <div
                className={`fixed bottom-0 right-0 z-50 flex h-150 w-full flex-col border-l border-emerald-100 bg-white shadow-2xl transition-transform duration-300 ease-in-out sm:w-96 sm:rounded-tl-2xl ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Panel Header */}
                <div className="flex items-center justify-between border-b border-emerald-100 bg-emerald-700 px-4 py-3 sm:rounded-tl-2xl">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                            <Sparkles size={16} className="text-white" />
                        </span>
                        <div>
                            <p className="text-sm font-semibold text-white">Penny</p>
                            <p className="text-xs text-emerald-200">AI Finance Assistant</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={handleClear}
                            className="rounded-md px-2 py-1 text-xs text-emerald-200 transition hover:bg-white/10 hover:text-white"
                        >
                            Clear
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md p-1.5 text-emerald-200 transition hover:bg-white/10 hover:text-white"
                            aria-label="Close chat"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                }`}
                        >
                            {/* Avatar */}
                            {msg.role === "assistant" && (
                                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                    <Bot size={14} />
                                </span>
                            )}

                            {/* Bubble */}
                            <div
                                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${msg.role === "user"
                                        ? "rounded-br-sm bg-emerald-700 text-white"
                                        : "rounded-bl-sm bg-zinc-100 text-zinc-800"
                                    }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {/* Typing indicator */}
                    {isLoading && (
                        <div className="flex items-end gap-2">
                            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                <Bot size={14} />
                            </span>
                            <div className="rounded-2xl rounded-bl-sm bg-zinc-100 px-4 py-3">
                                <div className="flex items-center gap-1">
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:0ms]" />
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:150ms]" />
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:300ms]" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                {/* Suggested questions — only show at start */}
                {messages.length === 1 && (
                    <div className="border-t border-zinc-100 px-4 py-2">
                        <p className="mb-2 text-xs text-zinc-400">Try asking:</p>
                        <div className="flex flex-wrap gap-1.5">
                            {[
                                "How's my spending this month?",
                                "Am I over budget anywhere?",
                                "How can I save more?",
                            ].map((suggestion) => (
                                <button
                                    key={suggestion}
                                    type="button"
                                    onClick={() => {
                                        setInput(suggestion);
                                        inputRef.current?.focus();
                                    }}
                                    className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700 transition hover:bg-emerald-100"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input */}
                <div className="border-t border-zinc-100 px-4 py-3">
                    <div className="flex items-end gap-2 rounded-xl border border-emerald-200 bg-white px-3 py-2 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask me about your finances..."
                            rows={1}
                            className="flex-1 resize-none bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
                            style={{ maxHeight: "80px" }}
                        />
                        <button
                            type="button"
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-700 text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-300"
                            aria-label="Send message"
                        >
                            {isLoading
                                ? <Loader2 size={13} className="animate-spin" />
                                : <Send size={13} />
                            }
                        </button>
                    </div>
                    <p className="mt-1.5 text-center text-xs text-zinc-400">
                        Powered by Groq · LLaMA 3
                    </p>
                </div>
            </div>
        </>
    );
};

export default AIChatPanel;