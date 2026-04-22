import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      {/* Sidebar */}
      <Sidebar isMobileOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Overlay (mobile only) */}
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Main Content */}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Header onToggleSidebar={openSidebar} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;