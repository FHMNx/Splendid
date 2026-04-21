import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, Phone, Sparkles } from "lucide-react";
import {
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import logo from "../assets/splendid.png";

const Footer = () => {
  const quickLinks = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about-us" },
    { label: "Contact", to: "/contact-us" },
  ];

  const socialLinks = [
    {
      label: "GitHub",
      href: "https://github.com/FHMNx",
      icon: FaGithub,
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/fhmn/",
      icon: FaLinkedinIn,
    },
    { label: "YouTube", href: "#", icon: FaYoutube },
    { label: "Instagram", href: "#", icon: FaInstagram },
    { label: "Facebook", href: "#", icon: FaFacebookF },
  ];

  return (
    <footer className="relative mt-5 overflow-hidden bg-gray-950 text-green-800">
<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.22),transparent_35%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_28%),linear-gradient(to_bottom_right,rgba(255,255,255,0.03),transparent_40%)]" />      <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-green-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-4">
        <div className=" shadow-2xl shadow-black/20 backdrop-blur-xl md:p-10">
          <div className="grid gap-10 md:grid-cols-[1.3fr_0.8fr_0.9fr]">
            <div>
              <div className="flex items-center justify-center gap-3 md:justify-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                  <img
                    src={logo}
                    alt="Splendid Logo"
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-green-300/80">
                    Splendid
                  </p>
                  <h2 className="text-md font-semibold text-white">
                    Expense tracking with clarity.
                  </h2>
                </div>
              </div>

              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300 md:text-left text-center">
                Splendid helps you track income and expenses with a clean,
                modern workflow. Keep control of your money, spot trends faster,
                and make better financial decisions.
              </p>

              <div className="mt-4 flex flex-wrap justify-center gap-3 md:justify-start">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200">
                  <Sparkles size={14} className="text-green-300" />
                  Modern UI
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200">
                  Track spending
                </span>
              </div>
            </div>

            <div className="text-center md:text-left">
              <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-green-300/80">
                Quick Links
              </h3>
              <div className="mt-5 flex flex-col gap-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-green-400/40 hover:bg-green-400/10 hover:text-white md:justify-start"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={16}
                      className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                ))}
              </div>
            </div>

            <div className="text-center md:text-left">
              <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-green-300/80">
                Contact
              </h3>

              <div className="mt-5 space-y-3">
                <p className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 md:justify-start">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-400/15 text-green-300">
                    <Phone size={16} />
                  </span>
                  +94 753 837 635
                </p>

                <p className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 md:justify-start">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-400/15 text-green-300">
                    <Mail size={16} />
                  </span>
                  fhmnx35888@gmail.com
                </p>
              </div>

              <div className="mt-2">
                <p className="text-sm font-medium text-slate-300">Follow Us</p>
                <div className="mt-2 flex justify-center gap-3 md:justify-start">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;

                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target={
                          social.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel={
                          social.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        aria-label={social.label}
                        className="group flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:-translate-y-0.5 hover:border-green-400/40 hover:bg-green-400/15 hover:text-white"
                      >
                        <Icon className="text-[18px] transition group-hover:scale-110" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-5 text-center text-xs text-slate-400 md:flex-row">
          <p>© 2026 Splendid. Designed & developed by Fahman.</p>
          <p className="text-slate-500">
            Built for clarity, speed, and a cleaner financial workflow.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
