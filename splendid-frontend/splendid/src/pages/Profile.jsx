import React, { useRef, useState, useEffect } from "react";
import PageTitle from "../components/PageTitle";
import { Camera, LogOut, ShieldCheck, Sparkles, Wallet, ArrowUpRight, ArrowDownRight, ReceiptText, Loader2, } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile, changePassword , updateProfileImage  } from "../features/auth/authAPI";
import { getTransactionsSummary } from "../features/transactions/transactionAPI";

const Profile = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);

  const [profile, setProfile] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [stats, setStats] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // fetch profile and summary
  useEffect(() => {
    const fetchData = async () => {
      setIsProfileLoading(true);
      try {
        const res = await getProfile();
        const profileData = res.data;
        setProfile(profileData);
        setProfileImage(profileData.profileImageUrl || null);
        setFormData({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
        });
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setIsProfileLoading(false);
      }

      try {
        const summaryRes = await getTransactionsSummary();
        setStats(summaryRes);
      } catch {
        setStats(null);
      }
    };

    fetchData();
  }, []);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // validate size
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    // show preview immediately
    const previewUrl = URL.createObjectURL(file);
    setProfileImage(previewUrl);

    // convert to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      try {
        const res = await updateProfileImage(base64);
        setProfile(res.data);
        setProfileImage(res.data.profileImageUrl);
        toast.success("Profile photo updated");
      } catch (error) {
        console.error("Upload error:", error);
        console.error("Response:", error?.response?.data);
        console.error("Status:", error?.response?.status);
        toast.error(error?.response?.data?.message || "Failed to upload photo");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error("First name and last name are required");
      return;
    }
    setIsSavingProfile(true);
    try {
      const res = await updateProfile(formData);
      setProfile(res.data);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please fill all password fields");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setIsChangingPassword(true);
    try {
      await changePassword(passwordData);
      toast.success("Password changed successfully");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Logged out successfully");
  };

  // format createdAt date
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
    : "—";

  const fullName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : "—";

  const inputClass = "w-full rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";

  return (
    <>
      <PageTitle title="Profile | Splendid" />

      <div className="space-y-6">
        {/* Header */}
        <section className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                <Sparkles size={14} />
                Splendid Profile
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                Profile Settings
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Manage your account information and security preferences.
              </p>
            </div>
            <div className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium ${profile?.verified
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-600"
              }`}>
              <ShieldCheck size={16} />
              {isProfileLoading ? "..." : profile?.verified ? "Account Verified" : "Email Not Verified"}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              title: "Total Transactions",
              value: stats ? String(stats.totalTransactions) : "—",
              icon: ReceiptText,
            },
            {
              title: "Total Income",
              value: stats ? `LKR ${Number(stats.totalIncome).toFixed(2)}` : "—",
              icon: ArrowUpRight,
            },
            {
              title: "Total Expenses",
              value: stats ? `LKR ${Number(stats.totalExpense).toFixed(2)}` : "—",
              icon: ArrowDownRight,
            },
          ].map(({ title, value, icon: Icon }) => (
            <article
              key={title}
              className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-zinc-500">{title}</p>
                  <p className={`mt-2 text-2xl font-semibold tracking-tight 
                    ${title === "Total Income" ? "text-green-700" : title === "Total Expenses" ? "text-red-600" : "text-zinc-900"}`}>
                    {value}
                  </p>
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <Icon size={18} />
                </span>
              </div>
            </article>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">

            {/* Profile Header Card */}
            <article className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-5">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900">Profile Header</h3>
                  <p className="mt-1 text-sm text-zinc-500">
                    Click your avatar to change the profile picture.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
                >
                  <Camera size={16} />
                  Change Photo
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              <div className="mt-5 flex flex-col items-center gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  className="group relative h-24 w-24 overflow-hidden rounded-full border border-emerald-100 shadow-sm"
                  aria-label="Change profile picture"
                >
                  <img
                    src={profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=d1fae5&color=065f46&size=200`}
                    alt="Profile avatar"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-zinc-900/0 text-white transition group-hover:bg-zinc-900/40">
                    <Camera className="opacity-0 transition group-hover:opacity-100" size={20} />
                  </span>
                </button>

                <div className="text-center sm:text-left">
                  {isProfileLoading ? (
                    <div className="space-y-2">
                      <div className="h-5 w-36 animate-pulse rounded bg-zinc-200" />
                      <div className="h-4 w-48 animate-pulse rounded bg-zinc-200" />
                    </div>
                  ) : (
                    <>
                      <h4 className="text-xl font-semibold text-zinc-900">{fullName}</h4>
                      <p className="text-sm text-zinc-500">{profile?.email}</p>
                      <p className="mt-2 inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        Member since: {memberSince}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </article>

            {/* Edit Profile */}
            <article className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5">
                <h3 className="text-lg font-semibold text-zinc-900">Edit Profile</h3>
                <p className="mt-1 text-sm text-zinc-500">Update your personal information.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleProfileChange}
                    className={inputClass}
                    placeholder="First name"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleProfileChange}
                    className={inputClass}
                    placeholder="Last name"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700">Email</label>
                  <input
                    type="email"
                    value={profile?.email ?? ""}
                    disabled
                    className="w-full cursor-not-allowed rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-500 outline-none"
                  />
                </div>

                <div className="sm:col-span-2 flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={isSavingProfile}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-300"
                  >
                    {isSavingProfile && <Loader2 size={15} className="animate-spin" />}
                    {isSavingProfile ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </article>

            {/* Change Password */}
            <article className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5">
                <h3 className="text-lg font-semibold text-zinc-900">Security</h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Update your password to keep your account secure.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                    Current Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={inputClass}
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={inputClass}
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={inputClass}
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="sm:col-span-2 flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleChangePassword}
                    disabled={isChangingPassword}
                    className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
                  >
                    {isChangingPassword && <Loader2 size={15} className="animate-spin" />}
                    {isChangingPassword ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <article className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="text-lg font-semibold text-zinc-900">Account Details</h3>
              <dl className="mt-4 space-y-4 text-sm">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <dt className="text-zinc-500">Full Name</dt>
                  <dd className="font-medium text-zinc-900">
                    {isProfileLoading ? (
                      <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />
                    ) : fullName}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <dt className="text-zinc-500">Email</dt>
                  <dd className="font-medium text-zinc-900">
                    {isProfileLoading ? (
                      <div className="h-4 w-32 animate-pulse rounded bg-zinc-200" />
                    ) : profile?.email}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <dt className="text-zinc-500">Member Since</dt>
                  <dd className="font-medium text-zinc-900">
                    {isProfileLoading ? (
                      <div className="h-4 w-20 animate-pulse rounded bg-zinc-200" />
                    ) : memberSince}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-zinc-500">Plan</dt>
                  <dd className="font-medium text-emerald-700">Splendid Free</dd>
                </div>
              </dl>
            </article>

            {/* Logout */}
            <article className="rounded-xl border border-red-100 bg-red-50/60 p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
                  <LogOut size={18} />
                </span>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-zinc-900">Logout</h3>
                  <p className="mt-1 text-sm text-zinc-600">
                    Sign out of your account on this device.
                  </p>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-500"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              </div>
            </article>
          </aside>
        </section>
      </div>
    </>
  );
};

export default Profile;