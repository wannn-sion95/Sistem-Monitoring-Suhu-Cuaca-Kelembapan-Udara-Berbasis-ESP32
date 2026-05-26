"use client";

import { motion } from "framer-motion";
import { Waves } from "lucide-react";

// ─── Custom Brand Icons (Bypass Lucide-React limitation) ───────────────

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4" />
  </svg>
);

// ─── Social links ─────────────────────────────────────────────────────────────

const SOCIALS = [
  {
    icon: <GithubIcon className="h-4 w-4" />,
    label: "GitHub",
    href: "https://github.com/wannn-sion95/Sistem-Monitoring-Suhu-Cuaca-Kelembapan-Udara-Berbasis-ESP32",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="glass-card mt-8 border-t border-slate-800/60 px-6 py-5"
    >
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* ── Left: Branding + copyright ── */}
        <div className="flex flex-col items-center sm:items-start gap-1">
          <div className="flex items-center gap-2">
            <Waves className="h-4 w-4 text-cyan-500" />
            <span className="font-display text-sm font-700 tracking-wide text-slate-300">
              ERK Group
            </span>
          </div>
          <p className="font-display text-[11px] text-slate-600 text-center sm:text-left">
            © {year} ERK Group · Tugas Akhir Praktikum Mikroprosesor & Antarmuka
          </p>
        </div>

        {/* ── Right: Social icons ── */}
        <div className="flex items-center gap-2">
          {SOCIALS.map(({ icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="group flex h-8 w-8 items-center justify-center rounded-xl
                bg-slate-800/60 ring-1 ring-slate-700/40 text-slate-500
                hover:bg-cyan-500/15 hover:text-cyan-400 hover:ring-cyan-500/30
                transition-all duration-200"
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </motion.footer>
  );
}
