import { useEffect, useState } from "react";
import { User, Lock, Shield, Settings, Loader2, LogOut, Save, Eye, EyeOff, Camera } from "lucide-react";
import PageTitle from "../../components/PageTitle";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile, changePassword } from "../../features/auth/authAPI";
import { getAdminStats } from "../../features/admin/adminAPI";
import { useRef } from "react";

const Section = ({ title, description, icon: Icon, children }) => (
    <article className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-3 border-b border-zinc-100 pb-5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <Icon size={18} />
            </span>
            <div>
                <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
                <p className="text-xs text-zinc-500">{description}</p>
            </div>
        </div>
        {children}
    </article>
);

const inputClass = "w-full rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";
const disabledClass = "w-full cursor-not-allowed rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-500 outline-none";

const AdminSettings = () => {
    const { logout, user: authUser } = useAuth();
    const navigate = useNavigate();

    const fileInputRef = useRef(null);
    const [profileImage, setProfileImage] = useState(null);
    const [pendingImage, setPendingImage] = useState(null);
    const [isSavingImage, setIsSavingImage] = useState(false);

    // profile
    const [profile, setProfile] = useState(null);
    const [isProfileLoading, setIsProfileLoading] = useState(true);
    const [profileForm, setProfileForm] = useState({ firstName: "", lastName: "" });
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    // password
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "", newPassword: "", confirmPassword: "",
    });
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        current: false, new: false, confirm: false,
    });

    // stats
    const [stats, setStats] = useState(null);


    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be smaller than 5MB");
            return;
        }
        const previewUrl = URL.createObjectURL(file);
        setProfileImage(previewUrl);
        setPendingImage(file);
    };

    const handleSaveImage = async () => {
        if (!pendingImage) return;
        setIsSavingImage(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                const res = await updateProfileImage(reader.result);
                setProfile(res.data);
                setProfileImage(res.data.profileImageUrl);
                setPendingImage(null);
                toast.success("Profile photo updated");
            } catch {
                toast.error("Failed to upload photo");
            } finally {
                setIsSavingImage(false);
            }
        };
        reader.readAsDataURL(pendingImage);
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsProfileLoading(true);
            try {
                const [profileRes, statsRes] = await Promise.all([
                    getProfile(),
                    getAdminStats(),
                ]);
                const p = profileRes.data;
                setProfile(p);
                setProfileForm({ firstName: p.firstName, lastName: p.lastName });
                setProfileImage(p.profileImageUrl || null);
                setStats(statsRes.data);
            } catch {
                toast.error("Failed to load settings");
            } finally {
                setIsProfileLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSaveProfile = async () => {
        if (!profileForm.firstName.trim() || !profileForm.lastName.trim()) {
            toast.error("Name fields cannot be empty");
            return;
        }
        setIsSavingProfile(true);
        try {
            const res = await updateProfile(profileForm);
            setProfile(res.data);
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update profile");
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleChangePassword = async () => {
        if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            toast.error("Please fill all password fields");
            return;
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }
        if (passwordForm.newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }
        setIsChangingPassword(true);
        try {
            await changePassword(passwordForm);
            toast.success("Password changed successfully");
            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to change password");
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        navigate("/login");
    };

    const toggleShow = (field) => {
        setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const PasswordInput = ({ name, field, placeholder }) => (
        <div className="relative">
            <input
                type={showPasswords[field] ? "text" : "password"}
                name={name}
                value={passwordForm[name]}
                onChange={(e) => setPasswordForm((p) => ({ ...p, [name]: e.target.value }))}
                placeholder={placeholder}
                className={`${inputClass} pr-10`}
            />
            <button
                type="button"
                onClick={() => toggleShow(field)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
                {showPasswords[field] ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
        </div>
    );

    return (
        <>
            <PageTitle title="Settings | Admin | Splendid" />

            <div className="mx-auto max-w-4xl space-y-6">

                {/* Header */}
                <section className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                            <Settings size={20} />
                        </span>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                                Admin Settings
                            </h2>
                            <p className="text-sm text-zinc-500">
                                Manage your admin account and system information.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Quick stats */}
                {stats && (
                    <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {[
                            { label: "Total Users", value: stats.totalUsers },
                            { label: "Verified Users", value: stats.verifiedUsers },
                            { label: "Total Transactions", value: stats.totalTransactions },
                            { label: "Total Budgets", value: stats.totalBudgets },
                        ].map(({ label, value }) => (
                            <article key={label}
                                className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm text-center">
                                <p className="text-2xl font-bold text-emerald-700">{value}</p>
                                <p className="mt-1 text-xs text-zinc-500">{label}</p>
                            </article>
                        ))}
                    </section>
                )}

                {/* Profile section */}
                <Section
                    title="Admin Profile"
                    description="Update your display name and view account details."
                    icon={User}
                >
                    {isProfileLoading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-10 animate-pulse rounded-lg bg-zinc-100" />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">

                            {/* Avatar */}
                            <div className="flex flex-col items-center gap-4 rounded-xl border border-zinc-100 bg-zinc-50 p-5 sm:flex-row">
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="group relative h-20 w-20 overflow-hidden rounded-full border-2 border-emerald-200 shadow-sm"
                                        aria-label="Change profile photo"
                                    >
                                        <img
                                            src={profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                (profileForm.firstName || "A") + " " + (profileForm.lastName || "")
                                            )}&background=d1fae5&color=065f46&size=200`}
                                            alt="Admin avatar"
                                            className="h-full w-full object-cover"
                                        />
                                        <span className="absolute inset-0 flex items-center justify-center bg-zinc-900/0 text-white transition group-hover:bg-zinc-900/40">
                                            <Camera className="opacity-0 transition group-hover:opacity-100" size={18} />
                                        </span>
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarChange}
                                    />
                                </div>

                                <div className="flex-1 text-center sm:text-left">
                                    <p className="text-base font-semibold text-zinc-900">
                                        {profileForm.firstName} {profileForm.lastName}
                                    </p>
                                    <p className="text-sm text-zinc-400">{profile?.email}</p>
                                    <p className="mt-1 text-xs text-zinc-400">
                                        Click the avatar to change photo. Max 5MB.
                                    </p>

                                    {/* Save / Cancel image buttons */}
                                    {pendingImage && (
                                        <div className="mt-3 flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={handleSaveImage}
                                                disabled={isSavingImage}
                                                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-600 disabled:bg-emerald-300"
                                            >
                                                {isSavingImage
                                                    ? <><Loader2 size={12} className="animate-spin" /> Saving...</>
                                                    : <><Save size={12} /> Save Photo</>
                                                }
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPendingImage(null);
                                                    setProfileImage(profile?.profileImageUrl || null);
                                                }}
                                                disabled={isSavingImage}
                                                className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* rest of the form fields stay exactly as they are */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {/* ... firstName, lastName inputs ... */}
                            </div>
                            {/* ... email, role, member since, save button ... */}
                        </div>
                    )}
                </Section>

                {/* Password section */}
                <Section
                    title="Change Password"
                    description="Keep your admin account secure with a strong password."
                    icon={Lock}
                >
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                                Current Password <span className="text-red-500">*</span>
                            </label>
                            <PasswordInput
                                name="currentPassword"
                                field="current"
                                placeholder="Enter current password"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                                    New Password <span className="text-red-500">*</span>
                                </label>
                                <PasswordInput
                                    name="newPassword"
                                    field="new"
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>
                                <PasswordInput
                                    name="confirmPassword"
                                    field="confirm"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>

                        <p className="text-xs text-zinc-400">
                            Password must be 8+ characters with uppercase, lowercase, and a number.
                        </p>

                        <div className="flex justify-end pt-2">
                            <button
                                type="button"
                                onClick={handleChangePassword}
                                disabled={isChangingPassword}
                                className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:bg-zinc-400 disabled:cursor-not-allowed"
                            >
                                {isChangingPassword
                                    ? <><Loader2 size={14} className="animate-spin" /> Updating...</>
                                    : <><Lock size={14} /> Update Password</>
                                }
                            </button>
                        </div>
                    </div>
                </Section>

                {/* System info section */}
                <Section
                    title="System Information"
                    description="Platform configuration and subscription pricing reference."
                    icon={Settings}
                >
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                                    Platform Name
                                </label>
                                <input type="text" value="Splendid" disabled className={disabledClass} />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                                    Currency
                                </label>
                                <input type="text" value="LKR (Sri Lankan Rupee)" disabled className={disabledClass} />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                                Subscription Plans & Prices
                            </label>
                            <div className="overflow-hidden rounded-lg border border-zinc-200">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-zinc-50 text-zinc-500">
                                        <tr>
                                            <th className="px-4 py-2.5 text-left font-medium">Plan</th>
                                            <th className="px-4 py-2.5 text-left font-medium">Duration</th>
                                            <th className="px-4 py-2.5 text-left font-medium">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { plan: "Free Trial", duration: "7 days", price: "Free" },
                                            { plan: "Monthly", duration: "30 days", price: "LKR 499.00" },
                                            { plan: "Half Yearly", duration: "180 days", price: "LKR 2,499.00" },
                                            { plan: "Yearly", duration: "365 days", price: "LKR 3,999.00" },
                                        ].map(({ plan, duration, price }) => (
                                            <tr key={plan} className="border-t border-zinc-100">
                                                <td className="px-4 py-2.5 font-medium text-zinc-800">{plan}</td>
                                                <td className="px-4 py-2.5 text-zinc-500">{duration}</td>
                                                <td className="px-4 py-2.5 font-semibold text-emerald-700">{price}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Danger zone */}
                <Section
                    title="Account"
                    description="Manage your admin session."
                    icon={LogOut}
                >
                    <div className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50/60 p-4">
                        <div>
                            <p className="text-sm font-medium text-zinc-900">Sign out</p>
                            <p className="text-xs text-zinc-500">
                                End your current admin session on this device.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-500"
                        >
                            <LogOut size={14} />
                            Logout
                        </button>
                    </div>
                </Section>

            </div>
        </>
    );
};

export default AdminSettings;