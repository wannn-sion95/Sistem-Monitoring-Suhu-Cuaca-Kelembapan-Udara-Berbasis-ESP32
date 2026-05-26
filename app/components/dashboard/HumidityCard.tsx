"use client";

import { motion, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { Droplets, TrendingUp, TrendingDown, Minus } from "lucide-react";

// ─── Props ────────────────────────────────────────────────────────────────────

interface HumidityCardProps {
  kelembapan: number | null;
  previouskelembapan: number | null;
  isLoading: boolean;
}

// ─── Animated counter ─────────────────────────────────────────────────────────

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const from = parseFloat(node.textContent || "0");
    const ctrl = animate(from, value, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate(v) {
        node.textContent = v.toFixed(1);
      },
    });
    return () => ctrl.stop();
  }, [value]);

  return <span ref={ref}>{value.toFixed(1)}</span>;
}

// ─── Water Wave visual ────────────────────────────────────────────────────────

function WaterWave({ percentage }: { percentage: number }) {
  const clampedPct = Math.min(Math.max(percentage, 0), 100);

  // Colour transitions: dry → normal → humid → saturated
  const waterColor =
    clampedPct < 40
      ? "rgba(6,182,212,0.30)"
      : clampedPct < 70
        ? "rgba(6,182,212,0.45)"
        : "rgba(6,182,212,0.65)";

  const waterColor2 =
    clampedPct < 40
      ? "rgba(14,165,233,0.20)"
      : clampedPct < 70
        ? "rgba(14,165,233,0.35)"
        : "rgba(14,165,233,0.55)";

  return (
    <div className="relative h-28 w-full overflow-hidden rounded-2xl bg-slate-900/60 ring-1 ring-slate-700/30">
      {/* Animated water fill */}
      <motion.div
        className="absolute bottom-0 left-0 right-0"
        initial={{ height: "0%" }}
        animate={{ height: `${clampedPct}%` }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        {/* Wave layer 1 — faster */}
        <div
          className="absolute -top-4 h-8 w-[200%] animate-wave-scroll"
          style={{ animationDuration: "5s" }}
        >
          <svg
            viewBox="0 0 1200 32"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M0,16 C80,4 160,28 240,16 C320,4 400,28 480,16 C560,4 640,28 720,16 C800,4 880,28 960,16 C1040,4 1120,28 1200,16 L1200,32 L0,32 Z"
              fill={waterColor}
            />
          </svg>
        </div>

        {/* Wave layer 2 — slower, offset */}
        <div
          className="absolute -top-3 h-6 w-[200%] animate-wave-scroll"
          style={{ animationDuration: "8s", animationDelay: "-3s" }}
        >
          <svg
            viewBox="0 0 1200 24"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M0,12 C100,2 200,22 300,12 C400,2 500,22 600,12 C700,2 800,22 900,12 C1000,2 1100,22 1200,12 L1200,24 L0,24 Z"
              fill={waterColor2}
            />
          </svg>
        </div>

        {/* Solid body */}
        <div
          className="absolute inset-0 top-4"
          style={{
            background: `linear-gradient(to top, ${waterColor}, ${waterColor2})`,
          }}
        />
      </motion.div>

      {/* Percentage readout over wave */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono-data text-3xl font-700 text-cyan-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {clampedPct.toFixed(0)}
            <span className="text-base text-cyan-400 ml-0.5">%</span>
          </p>
          <p className="font-display text-[10px] font-600 tracking-widest uppercase text-cyan-400/70 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
            Kelembapan
          </p>
        </div>
      </div>

      {/* Level markers on the right edge */}
      {[25, 50, 75].map((level) => (
        <div
          key={level}
          className="absolute right-0 flex items-center gap-1"
          style={{ bottom: `${level}%`, transform: "translateY(50%)" }}
        >
          <span className="font-mono-data text-[9px] text-slate-600 pr-2">
            {level}%
          </span>
          <div className="h-px w-3 bg-slate-700/60" />
        </div>
      ))}
    </div>
  );
}

// ─── Trend badge ──────────────────────────────────────────────────────────────

function TrendBadge({
  current,
  previous,
}: {
  current: number;
  previous: number | null;
}) {
  if (previous === null) return null;
  const delta = current - previous;
  if (Math.abs(delta) < 0.5)
    return (
      <span className="flex items-center gap-1 text-slate-500 text-xs font-600">
        <Minus className="h-3 w-3" /> Stabil
      </span>
    );
  return delta > 0 ? (
    <span className="flex items-center gap-1 text-rose-400 text-xs font-600">
      <TrendingUp className="h-3 w-3" />+{delta.toFixed(1)}%
    </span>
  ) : (
    <span className="flex items-center gap-1 text-emerald-400 text-xs font-600">
      <TrendingDown className="h-3 w-3" />
      {delta.toFixed(1)}%
    </span>
  );
}

// ─── Segment labels ───────────────────────────────────────────────────────────

function HumidityLabel({ value }: { value: number }) {
  if (value < 40) return { label: "Kering", cls: "text-amber-400" };
  if (value < 60) return { label: "Normal", cls: "text-emerald-400" };
  if (value < 75) return { label: "Lembab", cls: "text-cyan-400" };
  return { label: "Sangat Lembab", cls: "text-rose-400" };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function HumidityCard({
  kelembapan,
  previouskelembapan,
  isLoading,
}: HumidityCardProps) {
  if (isLoading) return <HumSkeleton />;

  const value = kelembapan ?? 0;
  const { label, cls } = HumidityLabel({ value });

  return (
    <motion.div
      whileHover={{ scale: 1.015, y: -4 }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      className="glass-card glow-cyan relative overflow-hidden rounded-3xl p-6 ring-1 ring-cyan-500/20 transition-all duration-500"
    >
      {/* Ambient blob */}
      <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-4">
        {/* Card header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/15 ring-1 ring-cyan-500/30">
              <Droplets className="h-4 w-4 text-cyan-400" strokeWidth={2} />
            </div>
            <div>
              <p className="font-display text-[10px] font-600 uppercase tracking-[0.25em] text-slate-500">
                Kelembapan 
              </p>
              <p className={`font-display text-xs font-600 ${cls}`}>{label}</p>
            </div>
          </div>

          <TrendBadge current={value} previous={previouskelembapan} />
        </div>

        {/* Big number readout */}
        <div className="flex items-baseline gap-1 -mb-1">
          <p
            className="font-mono-data font-700 text-cyan-300 leading-none tabular-nums"
            style={{ fontSize: "2.8rem" }}
          >
            {kelembapan !== null ? <AnimatedNumber value={value} /> : "--"}
          </p>
          <p className="font-display text-lg font-600 text-slate-500">%</p>
        </div>

        {/* Wave visual */}
        <WaterWave percentage={value} />

        {/* Comfort zone indicator */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-display text-slate-600">
            <span>Zona ideal: 40–60%</span>
            <span className={`font-600 ${cls}`}>{label}</span>
          </div>
          <div className="relative h-1.5 rounded-full bg-slate-800 overflow-hidden">
            {/* Ideal zone highlight */}
            <div
              className="absolute h-full bg-emerald-500/20 rounded-full"
              style={{ left: "40%", width: "20%" }}
            />
            {/* Current position */}
            <motion.div
              className="absolute h-full w-1.5 -translate-x-1/2 rounded-full bg-cyan-400"
              initial={{ left: "0%" }}
              animate={{ left: `${value}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-[9px] font-mono-data text-slate-700">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function HumSkeleton() {
  return (
    <div className="glass-card rounded-3xl p-6 ring-1 ring-slate-700/30">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="skeleton h-8 w-8 rounded-xl" />
          <div className="skeleton h-4 w-28 rounded-full" />
        </div>
        <div className="skeleton h-10 w-32 rounded-lg" />
        <div className="skeleton h-28 w-full rounded-2xl" />
        <div className="skeleton h-1.5 w-full rounded-full" />
      </div>
    </div>
  );
}
