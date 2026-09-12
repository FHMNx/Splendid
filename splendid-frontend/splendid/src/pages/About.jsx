import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import {
  Target,
  Shield,
  Zap,
  ExternalLink,
  CarFront,
  Code,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Layers,
  Globe,
  Rocket,
  ShieldCheck,
  TrendingUp,
  Cpu,
  BarChart3,
  Users,
} from "lucide-react";
import logo from "../assets/splendid.png";

const coreValues = [
  {
    icon: Target,
    title: "Financial Clarity",
    description:
      "Eliminate spreadsheet headaches. Splendid gives you clear, visual insights into every rupee spent, budgeted, and saved.",
    badge: "Insight",
  },
  {
    icon: Shield,
    title: "Security by Design",
    description:
      "Equipped with stateless JWT authentication, bcrypt password hashing, and encrypted endpoints to keep your financial data private.",
    badge: "Privacy",
  },
  {
    icon: Zap,
    title: "Lightning Fast Speed",
    description:
      "Optimized Spring Boot backend paired with a reactive React frontend for instant transaction logging and zero-latency analytics.",
    badge: "Performance",
  },
];

const pillars = [
  {
    title: "Intelligent Budgeting",
    desc: "Set category-based monthly limits and receive visual warnings before you overspend.",
  },
  {
    title: "AI Financial Assistant",
    desc: "Chat with Penny, our smart AI finance copilot, to discover savings opportunities and trends.",
  },
  {
    title: "PayHere Payment Gateway",
    desc: "Seamless, secure local payment processing with automated recurring subscription tracking.",
  },
  {
    title: "CSV & Report Exports",
    desc: "Export your entire financial history to spreadsheet-ready CSV files with a single click.",
  },
];

const techStack = [
  "React 19",
  "Spring Boot 3",
  "Tailwind CSS",
  "MySQL",
  "JWT Security",
  "Groq AI (Llama 3)",
  "PayHere SDK",
  "Cloudinary",
];

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PageTitle title="About Us - Splendid" />
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900 py-16 sm:py-24 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.35),transparent_50%)]" />
          <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-emerald-600/20 blur-3xl" />

          <div className="relative max-w-5xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-700/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-200 backdrop-blur-md mb-6">
              <Sparkles size={14} className="text-emerald-300" />
              Our Mission & Vision
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Simplifying Personal Finance{" "}
              <span className="bg-gradient-to-r from-emerald-300 to-lime-200 bg-clip-text text-transparent">
                For Everyone
              </span>
            </h1>

            <p className="mt-6 max-w-3xl mx-auto text-base sm:text-lg text-emerald-100/90 leading-relaxed">
              Splendid was created to replace chaotic spreadsheets and complicated accounting tools with a calm, beautiful, and intelligent expense tracking experience designed for everyday individuals and modern businesses.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-3.5 text-sm font-semibold text-emerald-950 transition-all shadow-lg shadow-emerald-900/40 hover:-translate-y-0.5"
              >
                Get Started Free <ArrowRight size={16} />
              </Link>
              <Link
                to="/packages"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-800/40 hover:bg-emerald-800/80 px-6 py-3.5 text-sm font-semibold text-white transition-all backdrop-blur-md"
              >
                View Plans & Pricing
              </Link>
            </div>
          </div>
        </section>

        {/* OUR STORY & CORE VALUES */}
        <section className="max-w-6xl mx-auto px-4 py-16 sm:py-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-700">
              Why We Built Splendid
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Engineered with Principles We Believe In
            </p>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              Managing your hard-earned money should feel empowering, not stressful. We designed Splendid around three core pillars that guide every feature we build.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="group relative rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-100/50 hover:border-emerald-300"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white">
                      <Icon size={26} />
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      {val.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-800 transition">
                    {val.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {val.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Feature Highlights Grid */}
          <div className="mt-16 rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
                  <Layers size={15} />
                  Complete Toolkit
                </span>
                <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900">
                  Everything you need for clean money habits
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  From micro-transactions to annual profit tracking, Splendid combines high-grade database integrity with intuitive controls so you always stay ahead of your financial goals.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pillars.map((pillar, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition"
                  >
                    <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm mb-1">
                      <CheckCircle2 size={16} className="shrink-0" />
                      <span>{pillar.title}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* THE MOONFLEET ECOSYSTEM (CROSS-PROMOTION) */}
        <section className="bg-slate-900 text-white py-16 sm:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.15),transparent_40%)]" />
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3">
                  <Globe size={13} />
                  The Moonfleet Ecosystem
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  Discover Our Sister Platforms
                </h2>
                <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-xl">
                  Splendid is part of a growing suite of purpose-built cloud solutions engineered under the Moonfleet umbrella.
                </p>
              </div>

              <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Live in Production
              </div>
            </div>

            {/* Moonfleet Spotlight Card */}
            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800/90 via-slate-850 to-slate-900 p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <CarFront size={26} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white tracking-tight">
                        Moonfleet.lk
                      </h3>
                      <p className="text-xs font-medium text-emerald-400 uppercase tracking-widest">
                        Sri Lanka&apos;s No. 1 Vehicle Rental Platform
                      </p>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-slate-300">
                    Looking to rent high-quality cars, SUVs, or commercial vans with transparent pricing and instant online confirmation? <strong>Moonfleet.lk</strong> provides a modern, seamless vehicle hire marketplace trusted by thousands across Sri Lanka.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                      <span>Curated fleet of verified vehicles</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                      <span>Instant online reservation & card payments</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                      <span>24/7 Island-wide customer roadside support</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                      <span>Flexible self-drive & with-driver packages</span>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-wrap items-center gap-4">
                    <a
                      href="https://moonfleet.lk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-3 text-sm font-bold text-slate-950 transition-all shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5"
                    >
                      Try Free Demo <ExternalLink size={16} />
                    </a>
                    <span className="text-xs text-slate-400">
                      Visit official portal at <strong className="text-white">moonfleet.lk</strong>
                    </span>
                  </div>
                </div>

                {/* Right side visual badge card */}
                <div className="lg:col-span-5 flex flex-col justify-center">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <span className="text-xs uppercase tracking-wider text-slate-400">Platform Stats</span>
                      <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                        Top Rated
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-2xl font-extrabold text-white">500+</div>
                        <div className="text-xs text-slate-400">Vehicles listed island-wide</div>
                      </div>
                      <div>
                        <div className="text-2xl font-extrabold text-emerald-400">99.8%</div>
                        <div className="text-xs text-slate-400">Customer satisfaction rating</div>
                      </div>
                      <div>
                        <div className="text-2xl font-extrabold text-white">24 / 7</div>
                        <div className="text-xs text-slate-400">Continuous dispatch & support</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* THE DEVELOPER & ARCHITECTURE */}
        <section className="max-w-6xl mx-auto px-4 py-16 sm:py-20">
          <div className="rounded-3xl border border-emerald-100 bg-white p-8 sm:p-12 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  <Code size={14} className="text-emerald-700" />
                  Engineering & Craftsmanship
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Crafted by Fahman & The Engineering Team
                </h2>

                <p className="text-sm sm:text-base leading-relaxed text-slate-600">
                  Splendid is designed and maintained by a passionate Full Stack Software Engineer dedicated to crafting robust, scalable cloud applications. We build software where performance, clean code, and delightful user experiences come first.
                </p>

                {/* Tech Badges */}
                <div className="pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Built With Modern Enterprise Technologies
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-900"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Developer / Project Summary Card */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-lime-50 border border-emerald-100 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md border border-emerald-100 p-2 mb-4">
                  <img src={logo} alt="Splendid Logo" className="h-10 w-10 object-contain" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Splendid SaaS</h3>
                <p className="text-xs text-slate-500 mt-1">Version 2.0 • Production Ready</p>
                
                <div className="mt-4 pt-4 border-t border-emerald-100 w-full flex items-center justify-center gap-3">
                  <a
                    href="https://github.com/FHMNx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-emerald-700 hover:text-emerald-900 hover:underline"
                  >
                    GitHub Profile
                  </a>
                  <span className="text-slate-300">•</span>
                  <a
                    href="https://www.linkedin.com/in/fhmn/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-emerald-700 hover:text-emerald-900 hover:underline"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* BOTTOM CTA SECTION */}
        <section className="bg-emerald-800 text-white py-16 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to take charge of your financial journey?
            </h2>
            <p className="mt-4 text-emerald-100 text-base sm:text-lg leading-relaxed">
              Create your account in under two minutes and experience the difference clarity makes.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-emerald-900 transition hover:bg-emerald-50 shadow-lg shadow-emerald-900/30"
              >
                Create Free Account <ArrowRight size={16} />
              </Link>
              <Link
                to="/contact-us"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-white/30 bg-emerald-900/40 hover:bg-emerald-900/70 px-8 py-3.5 text-sm font-semibold text-white transition backdrop-blur-md"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
