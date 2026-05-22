import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Navigate, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Packages from "./pages/Packages";
import Register from "./user/Register";
import Login from "./user/Login";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import Budget from "./pages/Budget";
import TransactionForm from "./pages/TransactionForm";
import EditTransactionModal from "./components/transactions/EditTransactionModal";
import { Toaster } from "react-hot-toast";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import SubscriptionGuard from "./routes/SubscriptionGuard";
import AdminRoute from "./routes/AdminRoute";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import AdminProfits from "./pages/admin/AdminProfits";
import AdminSettings from "./pages/admin/AdminSettings";


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/packages" element={<Packages />} />

        <Route element={<PublicRoute />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Dashboard */}
        <Route element={<PrivateRoute />}>
          <Route element={<SubscriptionGuard />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />

              <Route path="transactions">
                <Route index element={<Transactions />} />
                <Route path="add" element={<TransactionForm />} />
                <Route path="edit" element={<EditTransactionModal />} />
              </Route>

              <Route path="profile" element={<Profile />} />
              <Route path="budgets" element={<Budget />} />
              <Route path="budget" element={<Navigate to="/dashboard/budgets" replace />} />
            </Route>
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/transactions" element={<AdminTransactions />} />
            <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
            <Route path="/admin/profits" element={<AdminProfits />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>

        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>

      <Toaster position="top-right" />
    </BrowserRouter>
  );
};

export default App;
