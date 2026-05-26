"use client";

import { motion } from "framer-motion";
import { Waves, ChevronRight, RefreshCw, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface HeaderProps {
  lastUpdated: Date | null;
  isConnected: boolean;
  onRefresh: () => void;
}

function formatTime(date: Date | null): string {
  if (!date) return "--:--:--";
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export default function Header({
  lastUpdated,
  isConnected,
  onRefresh,
}: HeaderProps) {
  // Logika Tema
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="glass-card sticky top-0 z-50 px-6 py-4"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* ── Left: Logo + Breadcrumb ── */}
        <div className="flex items-center gap-4">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 ring-1 ring-cyan-500/30">
            <Waves
              className="h-5 w-5 text-cyan-500 dark:text-cyan-400"
              strokeWidth={2}
            />
            <span className="absolute inset-0 rounded-xl ring-1 ring-cyan-400/20 animate-ping-ring" />
          </div>

          <div className="hidden sm:block">
            <p className="font-display text-sm font-extrabold tracking-widest text-slate-900 dark:text-slate-100 leading-none">
              ERK GROUP
            </p>
            <p className="font-display text-[10px] font-medium tracking-[0.2em] text-slate-500 mt-0.5 uppercase">
              Sistem Monitoring Suhu Cuaca Tambak Garam Berbasis ESP32
            </p>
          </div>

          <div className="hidden md:block h-7 w-px bg-slate-300 dark:bg-slate-700/60 mx-1" />

          <nav
            aria-label="breadcrumb"
            className="hidden md:flex items-center gap-1 text-xs text-slate-500 font-display"
          >
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Dashboard
            </span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600" />
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Data Sensor
            </span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600" />
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">
              Realtime
            </span>
          </nav>
        </div>

        {/* ── Right: Status + Controls ── */}
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <p className="hidden sm:block font-mono-data text-[11px] text-slate-500">
              Update:{" "}
              <span className="text-slate-600 dark:text-slate-400">
                {formatTime(lastUpdated)}
              </span>
            </p>
          )}

          <div
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold font-display tracking-wide
              ${isConnected ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/25" : "bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-1 ring-rose-500/25"}`}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span
                className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${isConnected ? "bg-emerald-400 animate-ping" : "bg-rose-400 animate-blink-slow"}`}
              />
              <span
                className={`relative inline-flex h-1.5 w-1.5 rounded-full ${isConnected ? "bg-emerald-500 dark:bg-emerald-400" : "bg-rose-500 dark:bg-rose-400"}`}
              />
            </span>
            <span className="hidden sm:inline">
              {isConnected ? "Live Server" : "Disconnected"}
            </span>
          </div>

          <button
            onClick={onRefresh}
            className="group flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200/60 dark:bg-slate-800/60 ring-1 ring-slate-300 dark:ring-slate-700/50 text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700/60 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all duration-200"
            aria-label="Refresh data"
          >
            <RefreshCw className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-180" />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
