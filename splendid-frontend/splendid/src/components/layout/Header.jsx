import React, { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  Menu,
  MessageSquare,
  Search,
  User,
} from "lucide-react";
import splendidLogo from "../../assets/splendid.png";

const Header = ({
  title = "Splendid",
  onToggleSidebar,
  userName = "Abdullah Fahmaan",
  userAvatar = "https://i.pravatar.cc/80?img=12",
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
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
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-emerald-200 text-emerald-800 transition-all duration-200 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 md:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={18} />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-1">
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
        </div>

        <div className="order-3 w-full md:order-0 md:w-auto md:flex-1 md:justify-center">
          <label
            className="relative block w-full md:mx-auto md:max-w-md"
            aria-label="Search transactions"
          >
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-emerald-700/70"
            />
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full rounded-full border border-emerald-200 bg-emerald-50/30 py-2 pl-9 pr-4 text-sm text-zinc-800 placeholder:text-zinc-500 transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              aria-label="Search transactions"
            />
          </label>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-600 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span
              className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500"
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-600 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label="Messages"
          >
            <MessageSquare size={18} />
          </button>

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
                src={userAvatar}
                alt="User profile"
                className="h-8 w-8 rounded-full border border-emerald-100 object-cover"
              />
              <span className="hidden max-w-32 truncate text-sm font-medium text-zinc-800 sm:inline">
                {userName}
              </span>
              <ChevronDown
                size={16}
                className={`hidden text-zinc-500 transition-transform duration-200 sm:block ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`absolute right-0 mt-2 w-48 origin-top-right rounded-lg border border-emerald-100 bg-white p-1.5 shadow-lg transition-all duration-200 ${
                isProfileOpen
                  ? "pointer-events-auto translate-y-0 opacity-100"
                  : "pointer-events-none -translate-y-1 opacity-0"
              }`}
              role="menu"
              aria-label="Profile menu"
            >
              <a
                type="button"
                href="/dashboard/profile"
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-zinc-700 transition-colors duration-150 hover:bg-emerald-50 hover:text-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                role="menuitem"
              >
                <User size={15} />
                <span>Profile</span>
              </a>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-zinc-700 transition-colors duration-150 hover:bg-emerald-50 hover:text-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                role="menuitem"
              >
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
