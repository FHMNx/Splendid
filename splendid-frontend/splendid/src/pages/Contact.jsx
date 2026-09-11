import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Mail,
  Phone,
  Clock,
  Send,
  Lock,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Loader2,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { submitContactMessage } from "../features/contact/contactAPI";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";

const Contact = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const fullName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || "Valued User"
    : "";

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject.trim()) {
      toast.error("Please enter a subject");
      return;
    }

    if (!formData.message.trim()) {
      toast.error("Please enter your message");
      return;
    }

    try {
      setLoading(true);
      const res = await submitContactMessage({
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      toast.success(
        res?.message || "Message sent successfully! We'll get back to you shortly."
      );
      setFormData({ subject: "", message: "" });
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        "Failed to send your message. Please try again later.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PageTitle title="Contact Us - Splendid" />
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900 py-16 sm:py-20 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.3),transparent_50%)]" />
          <div className="relative max-w-6xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-700/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-200 backdrop-blur-md mb-4">
              <Sparkles size={14} className="text-emerald-300" />
              Support & Inquiries
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              We&apos;re Here to Help
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-emerald-100/90 leading-relaxed">
              Have questions regarding your subscription, feature requests, or technical assistance? Send our team a message and we&apos;ll be in touch right away.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Contact Details & Info */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Get in Touch
                </h2>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  Our dedicated support team is available to assist you with any questions or account inquiries.
                </p>
              </div>

              <div className="space-y-4">
                {/* Email Info Card */}
                <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md hover:border-emerald-200">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Email Us</h3>
                    <p className="text-xs text-gray-500 mt-0.5">For general & support inquiries</p>
                    <a
                      href="mailto:support@moonfleet.lk"
                      className="text-sm font-medium text-emerald-600 hover:text-emerald-700 mt-1 inline-block"
                    >
                      support@moonfleet.lk
                    </a>
                  </div>
                </div>

                {/* Phone / WhatsApp Card */}
                <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md hover:border-emerald-200">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Call / WhatsApp</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Monday - Friday, 9am - 6pm</p>
                    <p className="text-sm font-medium text-gray-800 mt-1">
                      +94 753 837 635
                    </p>
                  </div>
                </div>

                {/* Response Time Card */}
                <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md hover:border-emerald-200">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Quick Response Time</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      We usually respond to inquiries within 2 to 4 business hours.
                    </p>
                  </div>
                </div>
              </div>

              {/* Help tip box */}
              <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-100 flex items-start gap-3">
                <HelpCircle size={18} className="text-emerald-700 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-900 leading-relaxed">
                  <strong>Need instant answers?</strong> You can also chat with <strong>Penny</strong>, our AI financial assistant, directly within your dashboard.
                </p>
              </div>
            </div>

            {/* Right Column: Form or Auth Guard */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
                
                {/* When User is NOT Authenticated */}
                {!isAuthenticated ? (
                  <div className="text-center py-10 px-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4 ring-8 ring-emerald-50/50">
                      <Lock size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Please Log In to Contact Support
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                      To help us resolve your questions efficiently and keep your account details secure, please log in before sending a support message.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                      >
                        Log In Now
                        <ArrowRight size={16} />
                      </button>
                      <Link
                        to="/register"
                        className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                      >
                        Create Account
                      </Link>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                      <ShieldCheck size={14} className="text-emerald-600" />
                      <span>Direct verification via authenticated session</span>
                    </div>
                  </div>
                ) : (
                  /* When User IS Authenticated */
                  <div>
                    <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Send a Message
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Connected as <span className="font-semibold text-gray-700">{user?.email}</span>
                        </p>
                      </div>
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Authenticated
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                      {/* Name & Email (Pre-filled & Read Only) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={fullName}
                            readOnly
                            disabled
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 cursor-not-allowed select-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={user?.email || ""}
                            readOnly
                            disabled
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 cursor-not-allowed select-none"
                          />
                        </div>
                      </div>

                      {/* Subject Field */}
                      <div>
                        <label
                          htmlFor="subject"
                          className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
                        >
                          Subject <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="subject"
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="e.g., Question about my subscription / Feature request"
                          required
                          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>

                      {/* Message Field */}
                      <div>
                        <label
                          htmlFor="message"
                          className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5"
                        >
                          Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Please provide as much detail as possible so we can assist you quickly..."
                          required
                          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-y"
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>Sending message...</span>
                          </>
                        ) : (
                          <>
                            <Send size={18} />
                            <span>Send Message</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
