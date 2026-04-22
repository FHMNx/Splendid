import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Register from "./user/Register";
import Login from "./user/Login";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import TransactionForm from "./pages/TransactionForm";
import EditTransactionModal from "./components/transactions/EditTransactionModal";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />

          <Route path="transactions">
            <Route index element={<Transactions />} />
            <Route path="add" element={<TransactionForm />} />
            <Route path="edit" element={<EditTransactionModal />} />
          </Route>

          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
