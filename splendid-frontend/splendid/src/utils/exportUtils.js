export const exportToCSV = (transactions, filename = "transactions.csv") => {

  if (!transactions || transactions.length === 0) {
    return false;
  }

  const headers = [
    "Title",
    "Amount (LKR)",
    "Type",
    "Category",
    "Date",
    "Payment Method",
    "Notes",
  ];

  // convert each transaction to a CSV row
  const rows = transactions.map((t) => [
    `"${(t.title ?? "").replace(/"/g, '""')}"`,
    Number(t.amount).toFixed(2),
    t.type ?? "",
    t.categoryName ?? "",
    t.date ?? "",
    t.paymentMethod ?? "",
    `"${(t.notes ?? "").replace(/"/g, '""')}"`,
  ]);

  // combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  // create a blob and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();

  // cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return true;
};

// generate filename with current date
export const generateExportFilename = () => {
  const date = new Date().toISOString().split("T")[0];
  return `transactions_${date}.csv`;
};