import React, { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  Menu,
  MessageSquare,
  User,
  LogOut,
} from "lucide-react";
import splendidLogo from "../../assets/splendid.png";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSubscription } from "../../context/SubscriptionContext";

//Subscription Countdown 
const SubscriptionCountdown = () => {
  const { subscription, plan, isActive } = useSubscription();
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!subscription || !isActive) return;

    const calculate = () => {
      const end = new Date(subscription.endDate);
      end.setHours(23, 59, 59, 999);
      const diff = end - new Date();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [subscription, isActive]);

  if (!subscription || !isActive || !timeLeft) return null;

  const daysLeft = subscription.daysRemaining ?? 0;

  const colorClass =
    daysLeft <= 1 ? "text-red-500" :
      daysLeft <= 3 ? "text-amber-500" : "text-emerald-600";

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="hidden items-center gap-1.5 md:flex">
      <span className="text-sm text-zinc-400">
        Your subscription expires in
      </span>
      <span className={`font-mono text-xs font-semibold ${colorClass}`}>
        {pad(timeLeft.days)}D : {pad(timeLeft.hours)}H : {pad(timeLeft.minutes)}M : {pad(timeLeft.seconds)}S
      </span>
    </div>
  );
};

//Header
const Header = ({
  title = "Splendid",
  onToggleSidebar,
  userName = "User",
  userAvatar = null,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsProfileOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="sticky top-0 z-20 w-full border-b border-emerald-100 bg-white shadow-sm">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">

        {/* Left — logo + title */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-emerald-200 text-emerald-800 transition-all duration-200 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 md:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={18} />
          </button>

          <div className="flex items-center gap-1.5">
            <img
              src={splendidLogo}
              alt="Splendid logo"
              className="h-8 w-8 object-contain"
            />
            <h1 className="text-lg font-semibold tracking-tight text-emerald-900 sm:text-xl">
              {title}
            </h1>
          </div>
        </div>

        {/*subscription countdown */}
        <div className="flex flex-1 items-center justify-center">
          <SubscriptionCountdown />
        </div>

        <div className="flex flex-1 items-center justify-end gap-1.5 sm:gap-2">
          <button
            type="button"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-600 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-600 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label="Messages"
          >
            <MessageSquare size={18} />
          </button>

          {/* Profile dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full border border-transparent px-1.5 py-1.5 text-zinc-700 transition-all duration-200 hover:border-emerald-100 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label="Open profile menu"
              aria-expanded={isProfileOpen}
              aria-haspopup="menu"
            >
              <img
                src={userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=d1fae5&color=065f46&size=80`}
                alt="User profile"
                className="h-8 w-8 rounded-full border border-emerald-100 object-cover"
              />
              <span className="hidden max-w-32 truncate text-sm font-medium text-zinc-800 sm:inline">
                {userName}
              </span>
              <ChevronDown
                size={16}
                className={`hidden text-zinc-500 transition-transform duration-200 sm:block ${isProfileOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {/* Dropdown */}
            <div
              className={`absolute right-0 mt-2 w-48 origin-top-right rounded-lg border border-emerald-100 bg-white p-1.5 shadow-lg transition-all duration-200 ${isProfileOpen
                  ? "pointer-events-auto translate-y-0 opacity-100"
                  : "pointer-events-none -translate-y-1 opacity-0"
                }`}
              role="menu"
            >

              <a href="/dashboard/profile"
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-zinc-700 transition-colors hover:bg-emerald-50 hover:text-emerald-900"
                role="menuitem"
              >
                <User size={15} />
                <span>Profile</span>
              </a>

              <a href="/packages"
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-zinc-700 transition-colors hover:bg-emerald-50 hover:text-emerald-900"
                role="menuitem"
              >
                <Bell size={15} />
                <span>Upgrade Plan</span>
              </a>
              <div className="my-1 border-t border-zinc-100" />
              <button
                type="button"
                onClick={handleLogOut}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                role="menuitem"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;