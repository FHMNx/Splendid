import React, { useState } from 'react';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Check, Sparkles, Zap, Crown, Gift } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import { launchPayHereCheckout } from "../services/payhereService";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

const PACKAGES = [
  {
    id: "free_trial",
    name: "Free Trial",
    duration: "7 Days",
    price: 0,
    priceLabel: "Free",
    period: "one time",
    icon: Gift,
    color: "emerald",
    description: "Try everything risk-free. No card needed.",
    badge: null,
    features: [
      "Full dashboard access",
      "Unlimited transactions",
      "Budget goals",
      "AI finance assistant (Penny)",
      "CSV export",
      "Email support",
    ],
  },
  {
    id: "monthly",
    name: "Monthly",
    duration: "30 Days",
    price: 499,
    priceLabel: "LKR 499",
    period: "per month",
    icon: Zap,
    color: "blue",
    description: "Perfect for getting started with full access.",
    badge: null,
    features: [
      "Everything in Free Trial",
      "Priority email support",
      "Advanced analytics",
      "Budget alerts",
      "Data backup",
      "Cancel anytime",
    ],
  },
  {
    id: "half_yearly",
    name: "Half Yearly",
    duration: "180 Days",
    price: 2499,
    priceLabel: "LKR 2,499",
    period: "per 6 months",
    icon: Sparkles,
    color: "emerald",
    description: "Best value for committed trackers.",
    badge: "Most Popular",
    features: [
      "Everything in Monthly",
      "Save LKR 495 vs monthly",
      "Priority support",
      "Early access to features",
      "Custom categories",
      "Dedicated onboarding",
    ],
  },
  {
    id: "yearly",
    name: "Yearly",
    duration: "365 Days",
    price: 3999,
    priceLabel: "LKR 3,999",
    period: "per year",
    icon: Crown,
    color: "amber",
    description: "Maximum savings for power users.",
    badge: "Best Deal",
    features: [
      "Everything in Half Yearly",
      "Save LKR 1,989 vs monthly",
      "VIP support",
      "All future features",
      "Personal finance review",
      "Export to PDF",
    ],
  },
];

const COLOR_MAP = {
  emerald: {
    badge: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    icon: "bg-emerald-100 text-emerald-700",
    ring: "ring-emerald-500",
    border: "border-emerald-500",
    whatsapp: "bg-emerald-700 hover:bg-emerald-600 text-white",
    pay: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200",
    check: "text-emerald-600",
    glow: "shadow-emerald-100",
  },
  blue: {
    badge: "bg-blue-100 text-blue-700 border border-blue-200",
    icon: "bg-blue-100 text-blue-700",
    ring: "ring-blue-500",
    border: "border-blue-500",
    whatsapp: "bg-blue-700 hover:bg-blue-600 text-white",
    pay: "bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200",
    check: "text-blue-600",
    glow: "shadow-blue-100",
  },
  amber: {
    badge: "bg-amber-100 text-amber-700 border border-amber-200",
    icon: "bg-amber-100 text-amber-700",
    ring: "ring-amber-500",
    border: "border-amber-500",
    whatsapp: "bg-amber-600 hover:bg-amber-500 text-white",
    pay: "bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200",
    check: "text-amber-600",
    glow: "shadow-amber-100",
  },
};

const PackageCard = ({ pkg, isSelected, onSelect, user, isFree }) => {
  const colors = COLOR_MAP[pkg.color];
  const Icon = pkg.icon;

  const whatsappMessage = encodeURIComponent(
    `Hi! I'm interested in the Splendid ${pkg.name} plan (${pkg.duration}) for ${pkg.priceLabel}. Please guide me on how to proceed.`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  const [isPaying, setIsPaying] = useState(false);

  const handlePayNow = (e) => {
    e.stopPropagation();

    if (!user) {
      alert("Please log in to purchase a plan.");
      return;
    }

    const planMap = {
      monthly: "MONTHLY",
      half_yearly: "HALF_YEARLY",
      yearly: "YEARLY",
    };

    const planKey = planMap[pkg.id];
    setIsPaying(true);

    launchPayHereCheckout(
      user,
      planKey,
      // onSuccess
      (orderId) => {
        setIsPaying(false);
        alert("Payment successful! Your subscription is being activated. Please refresh in a moment.");
      },
      // onDismissed
      () => {
        setIsPaying(false);
      },
      // onError
      (error) => {
        setIsPaying(false);
        alert("Payment failed. Please try again or contact us via WhatsApp.");
      }
    );
  };

  return (
    <article
      onClick={() => onSelect(pkg.id)}
      className={`relative flex cursor-pointer flex-col rounded-2xl border-2 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isSelected
        ? `${colors.border} ${colors.glow} shadow-xl`
        : "border-zinc-100 hover:border-zinc-200"
        }`}
    >
      {/* Badge */}
      {pkg.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${colors.badge}`}>
            {pkg.badge}
          </span>
        </div>
      )}

      {/* Icon + Name */}
      <div className="flex items-start justify-between">
        <div>
          <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${colors.icon}`}>
            <Icon size={20} />
          </span>
          <h3 className="mt-3 text-xl font-bold text-zinc-900">{pkg.name}</h3>
          <p className="mt-0.5 text-sm text-zinc-500">{pkg.duration} access</p>
        </div>
        <div className={`h-5 w-5 rounded-full border-2 transition-all ${isSelected ? `${colors.border} bg-white` : "border-zinc-300 bg-white"
          }`}>
          {isSelected && (
            <div className={`m-0.5 h-3 w-3 rounded-full ${pkg.color === "amber" ? "bg-amber-500" :
              pkg.color === "blue" ? "bg-blue-600" : "bg-emerald-600"
              }`} />
          )}
        </div>
      </div>

      {/* Price */}
      <div className="mt-5 border-b border-zinc-100 pb-5">
        <span className="text-3xl font-bold tracking-tight text-zinc-900">
          {pkg.priceLabel}
        </span>
        <p className="mt-0.5 text-xs text-zinc-400">{pkg.period}</p>
        <p className="mt-2 text-sm text-zinc-500">{pkg.description}</p>
      </div>

      {/* Features */}
      <ul className="mt-5 flex-1 space-y-2.5">
        {pkg.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-zinc-700">
            <Check size={15} className={`mt-0.5 shrink-0 ${colors.check}`} />
            {feature}
          </li>
        ))}
      </ul>

      {/* Buttons*/}
      {!isFree && (
        <div className="mt-6 space-y-2">
          {/* WhatsApp */}

          <a href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${colors.whatsapp}`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Contact via WhatsApp
          </a>

          {/* PayHere */}
          <button
            type="button"
            onClick={handlePayNow}
            disabled={isPaying}
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${colors.pay}`}
          >
            {isPaying ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Opening PayHere...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
                Pay Now
              </>
            )}
          </button>
        </div>
      )
      }

      {/* Free trial CTA */}
      {
        isFree && (
          <div className="mt-6">

            <a href="/register"
              onClick={(e) => e.stopPropagation()}
              className="flex w-full items-center justify-center rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              Get Started Free →
            </a>
          </div>
        )
      }
    </article >
  );
};

const Packages = () => {
  const [selectedPkg, setSelectedPkg] = useState("half_yearly");
  const { user } = useAuth();

  return (
    <>
      <PageTitle title="Packages | Splendid" />
      <Navbar />

      <main className="min-h-screen bg-linear-to-b from-emerald-50/60 via-white to-white">

        {/* Hero */}
        <section className="px-4 pb-12 pt-16 text-center sm:pt-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700">
            <Sparkles size={14} />
            Simple, Transparent Pricing
          </div>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            Choose Your Plan
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-zinc-500">
            Start free for 7 days. No credit card required. Upgrade anytime to
            unlock full access and keep your finances on track.
          </p>

          {/* Trust badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-zinc-500">
            {["✓ No hidden fees", "✓ Cancel anytime", "✓ Instant activation", "✓ Local support"].map((badge) => (
              <span key={badge} className="font-medium">{badge}</span>
            ))}
          </div>
        </section>

        {/* Cards */}
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {PACKAGES.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                isSelected={selectedPkg === pkg.id}
                onSelect={setSelectedPkg}
                user={user}
                isFree={pkg.id === "free_trial"} 
              />
            ))}
          </div>

          {/* Bottom note */}
          <div className="mt-12 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6 text-center">
            <p className="text-sm font-medium text-zinc-700">
              Need help choosing a plan?
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              Message us directly on WhatsApp and we'll help you pick the right package.
            </p>

            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I need help choosing a Splendid subscription plan.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat with us on WhatsApp
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Packages;