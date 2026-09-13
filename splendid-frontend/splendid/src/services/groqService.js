import api from "../api/axios";

export const sendMessageToGroq = async (messages, financialContext = {}) => {
  let contextText = "";
  if (financialContext) {
    const budgetsText =
      financialContext.budgets && financialContext.budgets.length > 0
        ? financialContext.budgets
            .map(
              (b) =>
                `  • ${b.categoryName}: LKR ${b.spentAmount} spent of LKR ${b.limitAmount} limit (${b.percentage}% — ${b.status})`
            )
            .join("\n")
        : "  • No budget goals set for this month";

    contextText = `- Total Income (all time): LKR ${financialContext.totalIncome ?? 0}
- Total Expense (all time): LKR ${financialContext.totalExpense ?? 0}
- Net Balance: LKR ${financialContext.netBalance ?? 0}
- This Month's Income: LKR ${financialContext.monthlyIncome ?? 0}
- This Month's Expense: LKR ${financialContext.monthlyExpense ?? 0}
- Today's Expense: LKR ${financialContext.todayExpense ?? 0}
- Active Budgets this month:
${budgetsText}`;
  }

  const response = await api.post("/ai/chat", {
    messages,
    currentContext: contextText,
  });

  return response.data?.data ?? response.data ?? "Sorry, I couldn't generate a response.";
};