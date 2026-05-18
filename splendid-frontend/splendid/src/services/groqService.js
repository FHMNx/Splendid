const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant";

export const sendMessageToGroq = async (messages, financialContext) => {

  const systemPrompt = `You are Penny, a friendly and knowledgeable personal finance assistant built into Splendid — an expense and income tracking app.

You have access to the user's current financial summary:
- Total Income (all time): LKR ${financialContext.totalIncome}
- Total Expense (all time): LKR ${financialContext.totalExpense}
- Net Balance: LKR ${financialContext.netBalance}
- This Month's Income: LKR ${financialContext.monthlyIncome}
- This Month's Expense: LKR ${financialContext.monthlyExpense}
- Today's Expense: LKR ${financialContext.todayExpense}
${financialContext.budgets && financialContext.budgets.length > 0
  ? `- Active Budgets this month:\n${financialContext.budgets
      .map(b => `  • ${b.categoryName}: LKR ${b.spentAmount} spent of LKR ${b.limitAmount} limit (${b.percentage}% — ${b.status})`)
      .join("\n")}`
  : "- No budget goals set for this month"}

Your role:
- Answer questions about their spending, income, and budgets using the data above
- Give practical, actionable budgeting and saving advice
- Be concise — keep responses under 150 words unless the user asks for detail
- Be encouraging and positive, not judgmental about spending
- If asked something unrelated to finance, politely redirect to finance topics
- Always refer to amounts in LKR

Do not make up transaction details you don't have. If you don't know something specific, say so.`;

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      max_tokens: 300,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.error?.message || "Groq API error");
  }

  const data = await response.json();
  return data.choices[0]?.message?.content ?? "Sorry, I couldn't generate a response.";
};