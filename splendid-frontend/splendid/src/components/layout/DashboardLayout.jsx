import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";
import { getProfile } from "../../features/auth/authAPI";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const res = await getProfile();
        setProfileImageUrl(res.data?.profileImageUrl || null);
      } catch {
        setProfileImageUrl(null);
      }
    };
    fetchProfileImage();
  }, []);

  const fullName = user ? `${user.firstName} ${user.lastName}` : "User";
  const avatarUrl = profileImageUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=d1fae5&color=065f46&size=80`;

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <Sidebar isMobileOpen={isSidebarOpen} onClose={closeSidebar} />

      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Header
          onToggleSidebar={openSidebar}
          userName={fullName}
          userAvatar={avatarUrl}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;