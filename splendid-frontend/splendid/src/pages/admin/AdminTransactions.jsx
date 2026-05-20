import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ReceiptText } from "lucide-react";
import PageTitle from "../../components/PageTitle";
import { getAllTransactionsAdmin } from "../../features/admin/adminAPI";
import { toast } from "react-hot-toast";

const AdminTransactions = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize] = useState(10);

    useEffect(() => {
        const fetch = async () => {
            setIsLoading(true);
            try {
                const res = await getAllTransactionsAdmin(currentPage - 1, pageSize);
                const raw = res;
                setData(raw.content ?? []);
                setTotalPages(raw.page?.totalPages ?? raw.totalPages ?? 1);
                setTotalElements(raw.page?.totalElements ?? raw.totalElements ?? 0);
            } catch {
                toast.error("Failed to load transactions");
            } finally {
                setIsLoading(false);
            }
        };
        fetch();
    }, [currentPage, pageSize]);

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <>
            <PageTitle title="Transactions | Admin | Splendid" />

            <div className="space-y-6">

                {/* Header */}
                <section className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                            <ReceiptText size={20} />
                        </span>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                                All Transactions
                            </h2>
                            <p className="text-sm text-zinc-500">
                                {totalElements} transactions across all users
                            </p>
                        </div>
                    </div>
                </section>

                {/* Table */}
                <section className="rounded-xl border border-emerald-100 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-emerald-50 text-left text-zinc-600">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Title</th>
                                    <th className="px-4 py-3 font-medium">Amount</th>
                                    <th className="px-4 py-3 font-medium">Category</th>
                                    <th className="px-4 py-3 font-medium">Date</th>
                                    <th className="px-4 py-3 font-medium">Type</th>
                                    <th className="px-4 py-3 font-medium">Payment</th>
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

                                {!isLoading && data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-10 text-center text-zinc-400">
                                            No transactions found.
                                        </td>
                                    </tr>
                                )}

                                {!isLoading && data.map((item) => (
                                    <tr key={item.id}
                                        className="border-b border-zinc-100 transition hover:bg-emerald-50/40">
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-zinc-900">{item.title}</p>
                                            {item.notes && (
                                                <p className="text-xs text-zinc-400">{item.notes}</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-zinc-800">
                                            LKR {Number(item.amount).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 text-zinc-600">
                                            {item.categoryName ?? "—"}
                                        </td>
                                        <td className="px-4 py-3 text-zinc-500">{item.date}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${String(item.type).toLowerCase() === "income"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-red-100 text-red-600"
                                                }`}>
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-zinc-500">
                                            {item.paymentMethod?.replace("_", " ") ?? "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 px-4 py-3">
                        <p className="text-sm text-zinc-500">
                            Page {currentPage} of {totalPages}
                        </p>
                        <div className="flex items-center gap-1">
                            <button type="button"
                                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2.5 py-1.5 text-sm text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50">
                                <ChevronLeft size={14} /> Previous
                            </button>
                            {pageNumbers.map((n) => (
                                <button key={n} type="button"
                                    onClick={() => setCurrentPage(n)}
                                    className={`h-8 w-8 rounded-md text-sm font-medium transition ${currentPage === n
                                            ? "bg-emerald-700 text-white"
                                            : "text-zinc-700 hover:bg-emerald-100"
                                        }`}>
                                    {n}
                                </button>
                            ))}
                            <button type="button"
                                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2.5 py-1.5 text-sm text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50">
                                Next <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default AdminTransactions;