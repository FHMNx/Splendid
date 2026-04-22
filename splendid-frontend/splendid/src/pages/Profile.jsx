import React, { useRef, useState } from "react";
import {
  Camera,
  LogOut,
  ShieldCheck,
  Sparkles,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ReceiptText,
} from "lucide-react";

const ACCOUNT_STATS = [
  {
    title: "Total Transactions",
    value: "128",
    icon: ReceiptText,
  },
  {
    title: "Total Income",
    value: "$18,420",
    icon: ArrowUpRight,
  },
  {
    title: "Total Expenses",
    value: "$9,860",
    icon: ArrowDownRight,
  },
];

const Profile = () => {
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(
    "https://i.pravatar.cc/200?img=12",
  );
  const [formData, setFormData] = useState({
    firstName: "Abdullah",
    lastName: "Fahmaan",
    email: "abdullah@splendid.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setProfileImage(previewUrl);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
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

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
          >
            <ShieldCheck size={16} />
            Account Verified
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {ACCOUNT_STATS.map(({ title, value, icon: Icon }) => (
          <article
            key={title}
            className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-zinc-500">{title}</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
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
          <article className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-5">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900">
                  Profile Header
                </h3>
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

            <div className="mt-5 flex flex-col items-center gap-4 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleAvatarClick}
                className="group relative h-24 w-24 overflow-hidden rounded-full border border-emerald-100 shadow-sm"
                aria-label="Change profile picture"
              >
                <img
                  src={profileImage}
                  alt="Profile avatar"
                  className="h-full w-full object-cover"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-zinc-900/0 text-white transition group-hover:bg-zinc-900/40">
                  <Camera
                    className="opacity-0 transition group-hover:opacity-100"
                    size={20}
                  />
                </span>
              </button>

              <div className="text-center sm:text-left">
                <h4 className="text-xl font-semibold text-zinc-900">
                  Abdullah Fahmaan
                </h4>
                <p className="text-sm text-zinc-500">abdullah@splendid.com</p>
                <p className="mt-2 inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  Account created: April 2026
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-zinc-900">
                Edit Profile
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                Update your personal information.
              </p>
            </div>

            <form className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
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
                  onChange={handleChange}
                  className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Last name"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2 flex justify-end pt-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </article>

          <article className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-zinc-900">Security</h3>
              <p className="mt-1 text-sm text-zinc-500">
                Update your password to keep your account secure.
              </p>
            </div>

            <form className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                  New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="sm:col-span-2 flex justify-end pt-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
                >
                  Update Password
                </button>
              </div>
            </form>
          </article>
        </div>

        <aside className="space-y-6">
          <article className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-lg font-semibold text-zinc-900">
              Account Details
            </h3>
            <dl className="mt-4 space-y-4 text-sm">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <dt className="text-zinc-500">Full Name</dt>
                <dd className="font-medium text-zinc-900">Abdullah Fahmaan</dd>
              </div>
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <dt className="text-zinc-500">Email</dt>
                <dd className="font-medium text-zinc-900">
                  abdullah@splendid.com
                </dd>
              </div>
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <dt className="text-zinc-500">Member Since</dt>
                <dd className="font-medium text-zinc-900">April 2026</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-zinc-500">Plan</dt>
                <dd className="font-medium text-emerald-700">Splendid Free</dd>
              </div>
            </dl>
          </article>

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
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-500"
                >
                  Logout
                </button>
              </div>
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
};

export default Profile;
