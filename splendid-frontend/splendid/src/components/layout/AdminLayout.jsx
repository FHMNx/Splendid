import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, ArrowLeftRight, LogOut, Menu, X, Shield, ChevronDown, User, Crown, TrendingUp, Settings } from "lucide-react";
import splendidLogo from "../../assets/splendid.png";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { useRef, useEffect } from "react";
import { getProfile } from "../../features/auth/authAPI";

const NAV_ITEMS = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/subscriptions", label: "Subscriptions", icon: Crown },
    { to: "/admin/transactions", label: "Transactions", icon: ArrowLeftRight },
    { to: "/admin/profits", label: "Profits", icon: TrendingUp },
    { to: "/admin/settings", label: "Settings", icon: Settings },
];

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const profileRef = useRef(null);

    const [adminAvatar, setAdminAvatar] = useState(null);

    useEffect(() => {
        const fetchAdminProfile = async () => {
            try {
                const res = await getProfile();
                setAdminAvatar(res.data?.profileImageUrl || null);
            } catch {
                setAdminAvatar(null);
            }
        };
        fetchAdminProfile();
    }, []);

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        navigate("/login");
    };

    useEffect(() => {
        const handleOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, []);

    const linkBase = "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-900";
    const linkActive = "bg-emerald-100 text-emerald-900 font-semibold";

    return (
        <div className="min-h-screen bg-gray-50 md:flex">

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-emerald-100 bg-white shadow-sm transition-transform duration-300 md:static md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}>

                {/* Logo */}
                <div className="flex items-center justify-between border-b border-emerald-100 px-5 py-5">
                    <div className="flex items-center gap-3">
                        <img src={splendidLogo} alt="Splendid"
                            className="h-10 w-10 rounded-md border border-emerald-100 object-contain p-1" />
                        <div>
                            <h1 className="text-lg font-semibold tracking-tight text-emerald-900">
                                Splendid
                            </h1>
                            <div className="flex items-center gap-1">
                                <Shield size={11} className="text-emerald-600" />
                                <p className="text-xs font-medium text-emerald-600">
                                    Admin Panel
                                </p>
                            </div>
                        </div>
                    </div>
                    <button type="button" onClick={() => setIsSidebarOpen(false)}
                        className="rounded-md p-1 text-zinc-500 hover:bg-zinc-100 md:hidden">
                        <X size={18} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 space-y-1 px-4 py-6">
                    {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                        <NavLink key={to} to={to} end
                            className={({ isActive }) =>
                                `${linkBase} ${isActive ? linkActive : "text-zinc-700"}`
                            }
                        >
                            <Icon size={18} />
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Logout */}
                <div className="border-t border-emerald-100 p-4">
                    <button type="button" onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-900 hover:text-white">
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile overlay */}
            {isSidebarOpen && (
                <button type="button" aria-label="Close sidebar"
                    className="fixed inset-0 z-30 bg-black/30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)} />
            )}

            {/* Main */}
            <div className="flex min-h-screen flex-1 flex-col">

                {/* Header */}
                <header className="sticky top-0 z-20 flex items-center justify-between border-b border-emerald-100 bg-white px-4 py-3 shadow-sm sm:px-6">
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={() => setIsSidebarOpen(true)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-emerald-200 text-emerald-800 hover:bg-emerald-50 md:hidden">
                            <Menu size={18} />
                        </button>

                        {/* Admin badge */}
                        <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 sm:flex">
                            <Shield size={13} className="text-emerald-700" />
                            <span className="text-xs font-semibold text-emerald-700">
                                Admin Panel
                            </span>
                        </div>
                    </div>

                    {/* Profile dropdown */}
                    <div className="relative" ref={profileRef}>
                        <button type="button"
                            onClick={() => setIsProfileOpen((p) => !p)}
                            className="inline-flex items-center gap-2 rounded-full border border-transparent px-2 py-1.5 text-zinc-700 transition hover:border-emerald-100 hover:bg-emerald-50"
                        >
                            <img
                                src={adminAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    (user?.firstName ?? "A") + " " + (user?.lastName ?? "")
                                )}&background=d1fae5&color=065f46&size=80`}
                                alt="Admin avatar"
                                className="h-8 w-8 rounded-full border border-emerald-100 object-cover"
                            />
                            <span className="hidden text-sm font-medium sm:inline">
                                {user?.firstName} {user?.lastName}
                            </span>
                            <ChevronDown size={15} className={`text-zinc-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
                        </button>

                        <div className={`absolute right-0 mt-2 w-44 rounded-lg border border-emerald-100 bg-white p-1.5 shadow-lg transition-all duration-200 ${isProfileOpen
                            ? "pointer-events-auto translate-y-0 opacity-100"
                            : "pointer-events-none -translate-y-1 opacity-0"
                            }`}>
                            <div className="border-b border-zinc-100 px-3 py-2 mb-1">
                                <p className="text-xs font-medium text-zinc-900">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-xs text-zinc-400">{user?.email}</p>
                            </div>
                            <button type="button" onClick={handleLogout}
                                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 transition hover:bg-red-50">
                                <LogOut size={14} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;