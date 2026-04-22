import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Quote,
  Shield,
  Sparkles,
  Star,
  Wallet,
} from "lucide-react";

const testimonials = [
  {
    name: "Nimal Perera",
    role: "Freelancer",
    quote:
      "Splendid makes it easy to see where my money goes. The interface feels clean and never overwhelming.",
  },
  {
    name: "Ayesha Khan",
    role: "Small business owner",
    quote:
      "I like how fast it is to add transactions and review my spending. It fits my daily workflow perfectly.",
  },
  {
    name: "Kasun Silva",
    role: "Student",
    quote:
      "The app looks modern and gives me just enough insight to stay on budget without clutter.",
  },
];

const partnerNames = [
  "Dialog Axiata",
  "Commercial Bank",
  "Sampath Bank",
  "LOLC Finance",
  "Cargills Bank",
  "Keells",
  "Cargills Food City",
  "Daraz Sri Lanka",
];

function Home() {
  return (
    <>
      <PageTitle title="Home | Splendid" />
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-linear-to-br from-emerald-50 via-white to-lime-50 py-16 md:py-20">
        {" "}
        <div className="absolute left-10 top-8 h-28 w-28 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute right-0 top-24 h-40 w-40 rounded-full bg-lime-300/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 md:grid-cols-2">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm text-emerald-700 shadow-sm">
              <Sparkles size={16} className="text-emerald-500" />
              Modern expense tracking made simple
            </div>

            <h1 className="mt-5 text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
              Take control of your
              <span className="block text-emerald-600">
                finances with clarity
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600 md:mx-0 md:text-lg">
              Track your income, monitor expenses, and make smarter financial
              decisions with a clean, simple expense tracking experience.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
              <Link
                to="/contact-us"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-800 px-6 py-3 font-medium text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700"
              >
                Get Started <ArrowRight size={18} />
              </Link>

              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
              >
                Explore Features
              </a>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {["Track spending", "Clear insights", "Secure workflow"].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-white bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-sm md:justify-start"
                  >
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-4 -top-4 hidden h-24 w-24 rounded-3xl border border-emerald-200 bg-white/70 shadow-lg md:block" />
            <img
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f"
              alt="finance"
              className="relative rounded-3xl border border-white/70 shadow-[0_20px_60px_rgba(15,23,42,0.12)]"
            />
            <div className="absolute -bottom-5 left-1/2 w-[88%] -translate-x-1/2 rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-xl shadow-emerald-100/60">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">
                Weekly overview
              </p>
              <div className="mt-2 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">Transactions tracked</p>
                  <p className="text-2xl font-bold text-slate-900">128</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Budget health</p>
                  <p className="text-2xl font-bold text-emerald-600">92%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Powerful Features
          </h2>
          <p className="text-gray-600 mt-2">
            Everything you need to manage your finances effectively
          </p>

          <div className="mt-10 grid md:grid-cols-3 gap-8">
            <div className="group rounded-3xl border border-slate-200 bg-slate-50 p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-100/50">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                <Wallet size={24} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Track Income & Expenses
              </h3>
              <p className="text-gray-600 mt-2 text-sm">
                Easily record and categorize your transactions.
              </p>
            </div>

            <div className="group rounded-3xl border border-slate-200 bg-slate-50 p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-100/50">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Visual Insights
              </h3>
              <p className="text-gray-600 mt-2 text-sm">
                Understand your spending with charts and analytics.
              </p>
            </div>

            <div className="group rounded-3xl border border-slate-200 bg-slate-50 p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-100/50">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                <Shield size={24} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Secure & Reliable
              </h3>
              <p className="text-gray-600 mt-2 text-sm">
                Your data is safe and always accessible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* IMAGE SHOWCASE */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm text-emerald-700 shadow-sm">
              <Sparkles size={16} className="text-emerald-500" />
              Visual finance tracking
            </div>

            <h2 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">
              Clear visuals for every expense decision
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600 lg:mx-0 md:text-base">
              A modern expense tracker works best when the interface feels calm,
              readable, and data-rich. These visuals give the app a more
              polished and trustworthy feel.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
              {[
                "Budget clarity",
                "Daily tracking",
                "Spending trends",
                "Financial goals",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm"
                >
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <img
              src="https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&w=900&q=80"
              alt="Expense tracking dashboard"
              className="h-72 w-full rounded-3xl object-cover shadow-[0_20px_60px_rgba(15,23,42,0.12)] sm:row-span-2 sm:h-full"
            />

            <img
              src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80"
              alt="Financial analytics screen"
              className="h-32 w-full rounded-3xl object-cover shadow-[0_20px_60px_rgba(15,23,42,0.10)]"
            />

            <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">
                Smart tracking
              </p>
              <p className="mt-3 text-lg font-semibold text-slate-900">
                Built to make spending patterns easier to spot.
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Combine dashboards, summaries, and clean data cards to keep the
                experience visually balanced and useful.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-emerald-50/60 py-16">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm text-emerald-700 shadow-sm">
            <Quote size={16} className="text-emerald-500" />
            User testimonials
          </div>

          <h2 className="mt-4 text-3xl font-bold text-slate-900">
            Loved by people who want clearer money habits
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            A few words from users who wanted a simple, calm way to keep track
            of spending.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className="rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-100/40"
              >
                <div className="mb-5 flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, index) => (
                    <Star key={index} size={16} fill="currentColor" />
                  ))}
                </div>

                <p className="text-sm leading-7 text-slate-600 md:text-base">
                  “{testimonial.quote}”
                </p>

                <div className="mt-6 border-t border-slate-100 pt-4">
                  <p className="font-semibold text-slate-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-6 inline-flex rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm text-emerald-700 shadow-sm">
            Three real user stories, shown side by side.
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80"
                alt="Create account on laptop"
                className="h-40 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-emerald-600 font-bold text-2xl">1</h3>
                <p className="mt-2 font-medium text-slate-800">
                  Create an account
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Set up your profile and get started in minutes.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=900&q=80"
                alt="Recording daily transactions"
                className="h-40 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-emerald-600 font-bold text-2xl">2</h3>
                <p className="mt-2 font-medium text-slate-800">
                  Add your transactions
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Record income and expenses as they happen.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80"
                alt="Analyzing spending charts"
                className="h-40 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-emerald-600 font-bold text-2xl">3</h3>
                <p className="mt-2 font-medium text-slate-800">
                  Track & analyze spending
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Review patterns and make better money decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT US */}
      <section className="relative overflow-hidden bg-gray-200 py-16 text-green-800">
        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-green-200 bg-white p-6 shadow-xl sm:p-8">
            <p className="inline-flex rounded-full border border-green-200 bg-green-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-green-800">
              Contact us
            </p>
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Let&apos;s build better money habits together
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-green-700 md:text-base">
              Have questions about features, onboarding, or support? Send us a
              message and our team will get back to you quickly.
            </p>

            <form className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label className="mb-1 block text-sm text-green-700">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-green-600 bg-white/90 px-4 py-3 text-slate-800 outline-none transition focus:border-green-800 focus:ring-2 focus:ring-green-600/60"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="mb-1 block text-sm text-green-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-green-600 bg-white/90 px-4 py-3 text-slate-800 outline-none transition focus:border-green-800 focus:ring-2 focus:ring-green-600/60"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm text-green-700">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="How can we help?"
                  className="w-full rounded-xl border border-green-600 bg-white/90 px-4 py-3 text-slate-800 outline-none transition focus:border-green-800 focus:ring-2 focus:ring-green-600/60"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm text-green-700">
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Tell us what you need..."
                  className="w-full resize-none rounded-xl border border-green-600 bg-white/90 px-4 py-3 text-slate-800 outline-none transition focus:border-green-800 focus:ring-2 focus:ring-green-600/60"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-800 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
                >
                  Send Message <ArrowRight size={18} />
                </button>
              </div>
            </form>
          </div>

          <aside className="grid gap-4 self-start">
            <div className="rounded-3xl border border-green-200 bg-white p-6 shadow-xl">
              <h3 className="text-xl font-semibold">We&apos;re Here To Help</h3>
              <p className="mt-2 text-sm leading-7 text-green-700">
                Reach out for onboarding help, feature guidance, or partnership
                opportunities. We respond in under one business day.
              </p>
            </div>

            <div className="space-y-3 rounded-3xl border border-green-200 bg-white p-6 shadow-xl">
              <div className="flex items-start gap-3">
                <Mail size={18} className="mt-1 text-green-700" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-green-800 font-bold">
                    Email
                  </p>
                  <p className="text-sm text-green-800">support@splendid.app</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={18} className="mt-1 text-green-700" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-green-800 font-bold">
                    Phone
                  </p>
                  <p className="text-sm text-green-800">+94 75 383 7635</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-1 text-green-700" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-green-800 font-bold">
                    Office
                  </p>
                  <p className="text-sm text-green-800">Kandy 07, Sri Lanka</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock3 size={18} className="mt-1 text-green-700" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em]  text-green-800 font-bold">
                    Hours
                  </p>
                  <p className="text-sm text-green-800">
                    Mon - Fri, 9:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-emerald-800 text-white text-center">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-3xl font-bold md:text-4xl">
            Start managing your money today
          </h2>

          <p className="mt-3 text-emerald-50/90">
            Join now and take control of your financial future.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/contact-us"
              className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              Contact Us
            </Link>
            <Link
              to="/about-us"
              className="inline-flex items-center justify-center rounded-xl border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-500">
              Our partners
            </p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 md:text-3xl">
              Trusted tools in the financial workflow
            </h2>
          </div>

          <div className="mt-8 overflow-hidden rounded-2rem py-6">
            <style>{`
              @keyframes partner-marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
            `}</style>

            <div className="overflow-hidden">
              <div
                className="flex w-max gap-4 px-6"
                style={{
                  animation: "partner-marquee 28s linear infinite",
                }}
              >
                {[...partnerNames, ...partnerNames].map((partner, index) => (
                  <div
                    key={`${partner}-${index}`}
                    className="flex min-w-170px items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-700 shadow-sm"
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    {partner}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;
