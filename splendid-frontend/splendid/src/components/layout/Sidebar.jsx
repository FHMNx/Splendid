import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import splendidLogo from "../../assets/splendid.png";

const Sidebar = ({ isMobileOpen = false, onClose = () => {} }) => {
  const [isTransactionsOpen, setIsTransactionsOpen] = useState(false);

  const transactionSubmenu = [
    { label: "View Transactions", to: "/dashboard/transactions" },
    { label: "Add Transactions", to: "/dashboard/transactions/add" },
  ];

  const linkBaseClass =
    "group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-zinc-800 transition-all duration-200 hover:bg-emerald-200 hover:text-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500";

  const linkActiveClass = "bg-emerald-100 text-white font-semibold shadow-sm";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-emerald-200 bg-white shadow-sm transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      aria-label="Sidebar navigation"
    >
      <div className="flex items-center justify-between border-b border-emerald-100 px-5 py-5">
        <div className="flex items-center gap-3">
          <img
            src={splendidLogo}
            alt="Splendid logo"
            className="h-10 w-10 rounded-md border border-emerald-100 bg-white object-contain p-1"
          />
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-emerald-900">
                Splendid
              </h1>
              <p className="text-xs text-zinc-600">Expense Tracking System</p>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
        <NavLink
          to="/dashboard"
          end
          onClick={onClose}
          className={({ isActive }) =>
            `${linkBaseClass} ${isActive ? linkActiveClass : ""}`
          }
        >
          <LayoutDashboard
            size={18}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
          <span>Dashboard</span>
        </NavLink>

        <div>
          <button
            type="button"
            onClick={() => setIsTransactionsOpen((prev) => !prev)}
            className={`${linkBaseClass} w-full justify-between`}
            aria-label="Toggle transactions menu"
            aria-expanded={isTransactionsOpen}
          >
            <span className="flex items-center gap-3">
              <ArrowLeftRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
              <span>Transactions</span>
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                isTransactionsOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
              isTransactionsOpen
                ? "mt-1 grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="space-y-1 overflow-hidden pl-6">
              {transactionSubmenu.map(({ label, to }) => (
                <NavLink
                  key={label}
                  to={to}
                  end
                  onClick={onClose}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                      isActive
                        ? "bg-emerald-100 hover:bg-emerald-200"
                        : "text-zinc-700 hover:bg-emerald-100 hover:text-emerald-900"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        <NavLink
          to="/dashboard/profile"
          end
          onClick={onClose}
          className={({ isActive }) =>
            `${linkBaseClass} ${isActive ? linkActiveClass : ""}`
          }
        >
          <User
            size={18}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
          <span>Profile</span>
        </NavLink>
      </nav>

      <div className="border-t border-emerald-100 p-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-zinc-800 transition-all duration-200 hover:bg-zinc-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
