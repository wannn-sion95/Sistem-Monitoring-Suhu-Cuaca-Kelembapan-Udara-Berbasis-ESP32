"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  Activity,
  Droplets,
  Thermometer,
  Clock,
} from "lucide-react";
import { WeatherData, StatusConfig, getStatus } from "@/types/weather";

// ─── Props ────────────────────────────────────────────────────────────────────

interface StatusCardProps {
  data: WeatherData | null;
  isLoading: boolean;
}

// ─── Icon map ─────────────────────────────────────────────────────────────────

const StatusIcon = ({ config }: { config: StatusConfig }) => {
  const iconCls = `h-8 w-8 ${config.textClass}`;
  switch (config.type) {
    case "OPTIMAL":
      return <CheckCircle2 className={iconCls} strokeWidth={1.5} />;
    case "KRITIS":
      return <AlertTriangle className={iconCls} strokeWidth={1.5} />;
    default:
      return <Activity className={iconCls} strokeWidth={1.5} />;
  }
};

// ─── Mini metric pill ─────────────────────────────────────────────────────────

function MetricPill({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | null;
  unit: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-slate-900/60 px-4 py-3 ring-1 ring-slate-700/40">
      <span className="text-slate-500">{icon}</span>
      <div>
        <p className="font-display text-[10px] font-500 uppercase tracking-widest text-slate-500">
          {label}
        </p>
        <p className="font-mono-data text-base font-700 text-slate-200 leading-tight">
          {value !== null ? `${value.toFixed(1)}${unit}` : "---"}
        </p>
      </div>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function StatusCard({ data, isLoading }: StatusCardProps) {
  if (isLoading) return <StatusSkeleton />;

  // Default to STABIL if no data yet
  const config: StatusConfig = data
    ? getStatus(data.suhu, data.kelembapan)
    : {
        type: "STABIL",
        label: "MENUNGGU DATA",
        sublabel: "Menghubungkan ke server…",
        accentColor: "amber",
        textClass: "text-amber-400",
        borderClass: "border-amber-500/40",
        bgClass: "bg-amber-500/10",
        glowClass: "shadow-amber-500/20",
        ringClass: "ring-amber-500/30",
      };

  const isCritical = config.type === "KRITIS";
  const isOptimal = config.type === "OPTIMAL";

  // Timestamp display
  const timeStr = data?.timestamp
    ? new Date(data.timestamp).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "medium",
      })
    : null;

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.012, y: -4 }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      className={`glass-card relative overflow-hidden rounded-3xl p-7
        ring-1 ${config.ringClass}
        ${isOptimal ? "glow-emerald" : isCritical ? "glow-rose" : "glow-amber"}
        ${isCritical ? "animate-pulse-border" : ""}
        transition-all duration-500`}
    >
      {/* ── Ambient glow blob ── */}
      <div
        className={`absolute -right-12 -top-12 h-48 w-48 rounded-full blur-3xl opacity-20
          ${isOptimal ? "bg-emerald-500" : isCritical ? "bg-rose-500" : "bg-amber-500"}`}
      />
      <div
        className={`absolute -bottom-16 -left-8 h-40 w-40 rounded-full blur-3xl opacity-10
          ${isOptimal ? "bg-emerald-400" : isCritical ? "bg-rose-400" : "bg-amber-400"}`}
      />

      {/* ── Content ── */}
      <div className="relative z-10 flex h-full flex-col gap-6">
        {/* Header row */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Icon with ring */}
            <div
              className={`relative flex h-14 w-14 items-center justify-center rounded-2xl ${config.bgClass} ring-1 ${config.ringClass}`}
            >
              <span
                className={`${isCritical ? "animate-blink-slow" : "animate-float"}`}
              >
                <StatusIcon config={config} />
              </span>
              {isCritical && (
                <span
                  className={`absolute inset-0 rounded-2xl ${config.bgClass} animate-ping opacity-60`}
                />
              )}
            </div>

            <div>
              <p className="font-display text-[10px] font-600 uppercase tracking-[0.3em] text-slate-500">
                Status Tambak
              </p>
              {/* Animated status label */}
              <AnimatePresence mode="wait">
                <motion.h2
                  key={config.type}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.3 }}
                  className={`font-display text-2xl font-800 tracking-tight leading-tight mt-0.5 ${config.textClass}`}
                >
                  {config.label}
                </motion.h2>
              </AnimatePresence>
            </div>
          </div>

          {/* Status badge */}
          <span
            className={`rounded-full px-3 py-1 text-[10px] font-700 tracking-widest uppercase ${config.bgClass} ${config.textClass} ring-1 ${config.ringClass}`}
          >
            {config.type}
          </span>
        </div>

        {/* Sublabel */}
        <AnimatePresence mode="wait">
          <motion.p
            key={config.sublabel}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="font-display text-sm font-400 text-slate-400 leading-relaxed -mt-2"
          >
            {config.sublabel}
          </motion.p>
        </AnimatePresence>

        {/* Metric pills */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <MetricPill
            icon={<Thermometer className="h-4 w-4" />}
            label="Suhu"
            value={data?.suhu ?? null}
            unit="°C"
          />
          <MetricPill
            icon={<Droplets className="h-4 w-4" />}
            label="Kelembapan"
            value={data?.kelembapan ?? null}
            unit="%"
          />
        </div>

        {/* Timestamp */}
        {timeStr && (
          <div className="flex items-center gap-2 -mt-2">
            <Clock className="h-3 w-3 text-slate-600" />
            <p className="font-mono-data text-[10px] text-slate-600">
              {timeStr}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function StatusSkeleton() {
  return (
    <div className="glass-card rounded-3xl p-7 ring-1 ring-slate-700/30">
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-3">
          <div className="skeleton h-14 w-14 rounded-2xl" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="skeleton h-3 w-24 rounded-full" />
            <div className="skeleton h-7 w-48 rounded-lg" />
          </div>
        </div>
        <div className="skeleton h-4 w-56 rounded-full" />
        <div className="grid grid-cols-2 gap-3">
          <div className="skeleton h-16 rounded-xl" />
          <div className="skeleton h-16 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
