import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import {
  Bot,
  Mail,
  CreditCard,
  LineChart,
  ShieldCheck,
  Download,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Wallet,
  Target,
  PieChart,
  Lock,
  Zap,
  TrendingUp,
  FileSpreadsheet,
  MessageSquare,
  Shield,
  Layers,
  ChevronRight,
  Clock,
  Flame,
} from "lucide-react";

const mainFeatures = [
  {
    id: "ai-assistant",
    icon: Bot,
    badge: "AI Powered",
    badgeColor: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    title: "AI Finance Assistant (Penny)",
    description:
      "Meet Penny, your dedicated AI copilot. Powered by Groq's high-speed inference engine, Penny analyzes your spending habits, identifies budget leaks, and suggests tailored savings strategies in conversational English.",
    highlights: [
      "Instant answers on your spending patterns",
      "Context-aware budget optimizations",
      "24/7 personalized financial advice",
    ],
    highlightBox: {
      userQuery: "How can I cut 15% from my dining expenses?",
      aiResponse:
        "You spent LKR 14,500 on weekend dining this month. Setting a weekly cap of LKR 2,500 can save you approximately LKR 4,500 effortlessly!",
    },
    colSpan: "lg:col-span-7",
  },
  {
    id: "analytics",
    icon: LineChart,
    badge: "Data Visualization",
    badgeColor: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    title: "Intelligent Analytics & Trends",
    description:
      "Transform raw transaction rows into clear, interactive visual charts. Monitor monthly income vs. expense cash flow, detect spending spikes, and stay ahead of your limits with automated category breakdowns.",
    highlights: [
      "Monthly cash-flow comparison graphs",
      "Interactive category distribution charts",
      "Real-time budget health indicators",
    ],
    colSpan: "lg:col-span-5",
  },
  {
    id: "notifications",
    icon: Mail,
    badge: "Transactional SMTP",
    badgeColor: "bg-purple-500/10 text-purple-700 border-purple-500/20",
    title: "Automated Email Alerts & Support",
    description:
      "Reliable email workflows powered by Resend SMTP. Receive instant email verification, secure 15-minute password resets, support inquiry confirmations, and automated subscription renewal notices.",
    highlights: [
      "Instant account verification links",
      "Secure tokenized password reset emails",
      "Support inquiry tracking & auto-receipts",
    ],
    colSpan: "lg:col-span-5",
  },
  {
    id: "packages",
    icon: CreditCard,
    badge: "PayHere Integration",
    badgeColor: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    title: "Affordable & Scalable Packages",
    description:
      "Start with a 100% free 7-day trial with no credit card required. Upgrade seamlessly to Monthly or Half-Yearly plans using Sri Lanka's leading payment gateway, PayHere.",
    highlights: [
      "7-Day risk-free trial with full features",
      "Secure local card payments via PayHere",
      "Automated subscription status & countdown timer",
    ],
    colSpan: "lg:col-span-7",
  },
  {
    id: "security",
    icon: ShieldCheck,
    badge: "Bank-Grade Privacy",
    badgeColor: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    title: "Bank-Grade Security Architecture",
    description:
      "Built from the ground up with security best practices. Featuring stateless JWT authentication, salted Bcrypt password encryption, protected API endpoints, and granular Role-Based Access Control (RBAC).",
    highlights: [
      "Stateless JWT bearer authorization",
      "Salted Bcrypt password hashing",
      "Isolated user tenant database boundaries",
    ],
    colSpan: "lg:col-span-6",
  },
  {
    id: "exports",
    icon: Download,
    badge: "Data Portability",
    badgeColor: "bg-indigo-500/10 text-indigo-700 border-indigo-500/20",
    title: "One-Click CSV Data Exports",
    description:
      "Never worry about vendor lock-in. Export your complete transaction history or filter by date ranges directly into clean, spreadsheet-ready CSV files for Excel, Google Sheets, or tax accountants.",
    highlights: [
      "Instant transaction CSV generation",
      "Preserves category & timestamp metadata",
      "Complete data ownership & portability",
    ],
    colSpan: "lg:col-span-6",
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Record Fast",
    desc: "Log daily income & expenses in seconds with smart auto-categorization.",
    icon: Wallet,
  },
  {
    step: "02",
    title: "Set Goals",
    desc: "Define monthly spending thresholds and get proactive warnings before overspending.",
    icon: Target,
  },
  {
    step: "03",
    title: "Gain Clarity",
    desc: "Ask Penny for insights and watch your savings grow month after month.",
    icon: TrendingUp,
  },
];

const Features = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PageTitle title="Features - Splendid" />
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900 py-16 sm:py-24 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.35),transparent_50%)]" />
          <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-emerald-600/20 blur-3xl" />

          <div className="relative max-w-5xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-700/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-200 backdrop-blur-md mb-6">
              <Sparkles size={14} className="text-emerald-300" />
              Powerful Finance Ecosystem
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Everything You Need To{" "}
              <span className="bg-gradient-to-r from-emerald-300 to-lime-200 bg-clip-text text-transparent">
                Master Your Money
              </span>
            </h1>

            <p className="mt-6 max-w-3xl mx-auto text-base sm:text-lg text-emerald-100/90 leading-relaxed">
              Splendid combines real-time transaction tracking, intelligent budgeting, AI assistant advice, and bank-grade security into one seamless experience.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-3.5 text-sm font-semibold text-emerald-950 transition-all shadow-lg shadow-emerald-900/40 hover:-translate-y-0.5"
              >
                Start Free Trial <ArrowRight size={16} />
              </Link>
              <Link
                to="/packages"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-800/40 hover:bg-emerald-800/80 px-6 py-3.5 text-sm font-semibold text-white transition-all backdrop-blur-md"
              >
                Explore Packages
              </Link>
            </div>
          </div>
        </section>

        {/* MAIN BENTO / FEATURES GRID */}
        <section className="max-w-6xl mx-auto px-4 py-16 sm:py-20">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-700">
              Modern Capabilities
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Built for Speed, Accuracy, and Peace of Mind
            </p>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              Every tool in Splendid is designed to reduce friction and give you actionable visibility over your income, spending, and savings.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {mainFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.id}
                  className={`group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-100/50 hover:border-emerald-300 ${feat.colSpan}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white">
                        <Icon size={26} />
                      </div>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${feat.badgeColor}`}
                      >
                        {feat.badge}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-emerald-800 transition">
                      {feat.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {feat.description}
                    </p>

                    {/* Highlights List */}
                    <div className="mt-6 space-y-2.5">
                      {feat.highlights.map((h, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                          <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Optional Spotlight Box for AI Assistant */}
                  {feat.highlightBox && (
                    <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4.5 space-y-3">
                      <div className="flex items-start gap-2.5">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-200 text-[11px] font-bold text-emerald-900">
                          You
                        </span>
                        <p className="text-xs text-slate-700 italic">
                          &ldquo;{feat.highlightBox.userQuery}&rdquo;
                        </p>
                      </div>
                      <div className="flex items-start gap-2.5 border-t border-emerald-200/60 pt-2.5">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white text-[11px] font-bold">
                          <Bot size={13} />
                        </span>
                        <p className="text-xs text-emerald-900 font-medium leading-relaxed">
                          {feat.highlightBox.aiResponse}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* WORKFLOW / 3-STEP PROCESS */}
        <section className="bg-slate-900 text-white py-16 sm:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.15),transparent_40%)]" />

          <div className="relative max-w-6xl mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3">
                <Flame size={13} />
                Simple Workflow
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                How Splendid Works for You
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-400">
                A seamless flow that turns daily financial management into an effortless habit.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {workflowSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div
                    key={i}
                    className="relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition hover:-translate-y-1 hover:border-emerald-500/40"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <Icon size={24} />
                      </div>
                      <span className="text-2xl font-black text-emerald-400/40 font-mono">
                        {step.step}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* BOTTOM CTA SECTION */}
        <section className="bg-emerald-800 text-white py-16 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to experience these features?
            </h2>
            <p className="mt-4 text-emerald-100 text-base sm:text-lg leading-relaxed">
              Get started with a full-featured 7-day free trial today. No credit card required.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-emerald-900 transition hover:bg-emerald-50 shadow-lg shadow-emerald-900/30"
              >
                Create Free Account <ArrowRight size={16} />
              </Link>
              <Link
                to="/packages"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-white/30 bg-emerald-900/40 hover:bg-emerald-900/70 px-8 py-3.5 text-sm font-semibold text-white transition backdrop-blur-md"
              >
                View Pricing Plans
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Features;
