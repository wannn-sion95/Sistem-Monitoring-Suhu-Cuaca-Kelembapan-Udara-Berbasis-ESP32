/* eslint-disable react-hooks/refs */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef } from "react";

// ── Components ────────────────────────────────────────────────────────────────
import Header from "./components/dashboard/Header";
import StatusCard from "./components/dashboard/StatusCard";
import TemperatureCard from "./components/dashboard/TemperatureCard";
import HumidityCard from "./components/dashboard/HumidityCard";
import AnalyticsCard from "./components/dashboard/AnalyticsCard";
import Footer from "./components/dashboard/Footer";
import ErrorBanner from "./components/ui/ErrorBanner";

// ── Hook ──────────────────────────────────────────────────────────────────────
import { useWeatherData } from "@/hooks/useWeatherData";

// ─── Framer Motion Variants ───────────────────────────────────────────────────

/** Grid wrapper: stagger children in */
const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

/** Each card: fade + slide up */
const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 280,
      damping: 26,
    },
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data, history, isLoading, isError, lastUpdated, refresh } =
    useWeatherData();

  // Keep a one-step-back snapshot for trend arrows
  const prevDataRef = useRef<{ suhu: number; kelembapan: number } | null>(null);
  const previousData = prevDataRef.current;
  if (data) {
    prevDataRef.current = { suhu: data.suhu, kelembapan: data.kelembapan };
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Header ── */}
      <Header
        lastUpdated={lastUpdated}
        isConnected={!isError}
        onRefresh={refresh}
      />

      {/* ── Main ── */}
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col gap-6">
          {/* ── Error banner ── */}
          <AnimatePresence>
            {isError && <ErrorBanner onRetry={refresh} />}
          </AnimatePresence>

          {/* ── Page title ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="flex flex-col gap-0.5"
          >
            <p className="font-display text-[10px] font-600 uppercase tracking-[0.35em] text-slate-600">
              Pemantauan Real-time
            </p>
            <h1 className="font-display text-2xl font-800 tracking-tight text-slate-100">
              Kondisi Suhu Cuaca{" "}
              <span className="bg-linear-to-r from-cyan-400 to-sky-400 bg-clip-text text-transparent">
                Tambak Garam
              </span>
            </h1>
          </motion.div>

          {/* ── Bento Grid ── */}
          <motion.div
            variants={gridVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {/* ── Status Card — wide (2 cols) ── */}
            <motion.div
              variants={cardVariants}
              className="sm:col-span-2 lg:col-span-2"
            >
              <StatusCard data={data} isLoading={isLoading} />
            </motion.div>

            {/* ── Temperature Card ── */}
            <motion.div variants={cardVariants}>
              <TemperatureCard
                suhu={data?.suhu ?? null}
                previousSuhu={previousData?.suhu ?? null}
                isLoading={isLoading}
              />
            </motion.div>

            {/* ── Humidity Card ── */}
            <motion.div variants={cardVariants}>
              <HumidityCard
                kelembapan={data?.kelembapan ?? null}
                previouskelembapan={previousData?.kelembapan ?? null}
                isLoading={isLoading}
              />
            </motion.div>

            {/* ── Analytics Card — full width ── */}
            <motion.div
              variants={cardVariants}
              className="sm:col-span-2 lg:col-span-4"
            >
              <AnalyticsCard history={history} />
            </motion.div>
          </motion.div>

          {/* ── Data stream info ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex items-center justify-center gap-2 text-[11px] font-display text-slate-700"
          >
            <span className="h-1 w-1 rounded-full bg-cyan-500/50" />
            <span>Data diperbarui otomatis setiap 10 detik dari Backend</span>
            <span className="h-1 w-1 rounded-full bg-cyan-500/50" />
          </motion.div>
        </div>
      </main>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}
