/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { motion, useSpring, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { Thermometer, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { TEMP_RANGE } from "@/types/weather";

// ─── Props ────────────────────────────────────────────────────────────────────

interface TemperatureCardProps {
  suhu: number | null;
  previousSuhu: number | null;
  isLoading: boolean;
}

// ─── Circular SVG Progress ────────────────────────────────────────────────────

const CX = 100;
const CY = 100;
const R = 78;
const CIRC = 2 * Math.PI * R; // ≈ 490
// We use a 270° arc (leaving 90° gap at the bottom)
const ARC_RATIO = 0.75;
const TRACK_LENGTH = CIRC * ARC_RATIO; // ≈ 367.5
const GAP_LENGTH = CIRC - TRACK_LENGTH;

function CircularProgress({ value }: { value: number }) {
  const pct = Math.min(Math.max(value / TEMP_RANGE.max, 0), 1);
  const progressLength = TRACK_LENGTH * pct;

  // Colour: cool cyan → warm orange → hot rose
  const strokeColor =
    value < 26 ? "#06b6d4" : value < 35 ? "#f97316" : "#f43f5e";
  const glowColor =
    value < 26
      ? "rgba(6,182,212,0.6)"
      : value < 35
        ? "rgba(249,115,22,0.6)"
        : "rgba(244,63,94,0.6)";

  return (
    <svg
      viewBox="0 0 200 200"
      className="w-full h-full"
      style={{ overflow: "visible" }}
    >
      {/* Background track */}
      <circle
        cx={CX}
        cy={CY}
        r={R}
        fill="none"
        stroke="rgba(51,65,85,0.6)"
        strokeWidth="10"
        strokeDasharray={`${TRACK_LENGTH} ${GAP_LENGTH}`}
        strokeLinecap="round"
        /* -135° = start from 7:30 position for a 270° arc */
        transform={`rotate(-135 ${CX} ${CY})`}
      />

      {/* Outer subtle ring */}
      <circle
        cx={CX}
        cy={CY}
        r={R + 12}
        fill="none"
        stroke="rgba(51,65,85,0.2)"
        strokeWidth="1"
      />

      {/* Inner subtle ring */}
      <circle
        cx={CX}
        cy={CY}
        r={R - 14}
        fill="none"
        stroke="rgba(51,65,85,0.2)"
        strokeWidth="1"
      />

      {/* Glow filter */}
      <defs>
        <filter id="arc-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="arc-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.5" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Progress arc */}
      <motion.circle
        cx={CX}
        cy={CY}
        r={R}
        fill="none"
        stroke="url(#arc-gradient)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${progressLength} ${CIRC - progressLength}`}
        transform={`rotate(-135 ${CX} ${CY})`}
        filter="url(#arc-glow)"
        initial={{ strokeDasharray: `0 ${CIRC}` }}
        animate={{
          strokeDasharray: `${progressLength} ${CIRC - progressLength}`,
          stroke: strokeColor,
        }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={
          {
            "--glow": glowColor,
            filter: `drop-shadow(0 0 8px ${glowColor})`,
          } as React.CSSProperties
        }
      />

      {/* Tick marks at 0, 25%, 50%, 75%, 100% of the arc */}
      {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => {
        const angleDeg = -135 + frac * 270;
        const rad = (angleDeg * Math.PI) / 180;
        const x1 = CX + (R + 14) * Math.cos(rad);
        const y1 = CY + (R + 14) * Math.sin(rad);
        const x2 = CX + (R + 20) * Math.cos(rad);
        const y2 = CY + (R + 20) * Math.sin(rad);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="rgba(100,116,139,0.5)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
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

  return (
    <span ref={ref} className="tabular-nums">
      {value.toFixed(1)}
    </span>
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
  if (Math.abs(delta) < 0.1)
    return (
      <span className="flex items-center gap-1 text-slate-500 text-xs font-600">
        <Minus className="h-3 w-3" /> Stabil
      </span>
    );
  return delta > 0 ? (
    <span className="flex items-center gap-1 text-rose-400 text-xs font-600">
      <TrendingUp className="h-3 w-3" />+{delta.toFixed(1)}°
    </span>
  ) : (
    <span className="flex items-center gap-1 text-cyan-400 text-xs font-600">
      <TrendingDown className="h-3 w-3" />
      {delta.toFixed(1)}°
    </span>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function TemperatureCard({
  suhu,
  previousSuhu,
  isLoading,
}: TemperatureCardProps) {
  if (isLoading) return <TempSkeleton />;

  const value = suhu ?? 0;
  const displayColor =
    value < 26
      ? "text-cyan-400"
      : value < 35
        ? "text-orange-400"
        : "text-rose-400";
  const glowClass =
    value < 26 ? "glow-cyan" : value < 35 ? "glow-orange" : "glow-rose";
  const ringClass =
    value < 26
      ? "ring-cyan-500/25"
      : value < 35
        ? "ring-orange-500/25"
        : "ring-rose-500/25";
  const labelText = value >= 35 ? "Panas" : value >= 28 ? "Hangat" : "Sejuk";

  return (
    <motion.div
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      className={`glass-card relative overflow-hidden rounded-3xl p-6 ring-1 ${ringClass} ${glowClass} transition-all duration-500`}
    >
      {/* Ambient blob */}
      <div
        className={`absolute -bottom-10 -right-10 h-40 w-40 rounded-full blur-3xl opacity-15
          ${value < 26 ? "bg-cyan-500" : value < 35 ? "bg-orange-500" : "bg-rose-500"}`}
      />

      <div className="relative z-10 flex flex-col h-full gap-4">
        {/* Card header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-xl
              ${value < 26 ? "bg-cyan-500/15" : value < 35 ? "bg-orange-500/15" : "bg-rose-500/15"}
              ring-1 ${ringClass}`}
            >
              <Thermometer
                className={`h-4 w-4 ${displayColor}`}
                strokeWidth={2}
              />
            </div>
            <div>
              <p className="font-display text-[10px] font-600 uppercase tracking-[0.25em] text-slate-500">
                Suhu Udara
              </p>
              <p className={`font-display text-xs font-600 ${displayColor}`}>
                {labelText}
              </p>
            </div>
          </div>

          <TrendBadge current={value} previous={previousSuhu} />
        </div>

        {/* Circular gauge */}
        <div className="relative mx-auto w-40 h-40">
          <CircularProgress value={value} />
          {/* Centred readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p
              className={`font-mono-data font-700 leading-none tabular-nums ${displayColor}`}
              style={{ fontSize: "2.4rem" }}
            >
              {suhu !== null ? <AnimatedNumber value={value} /> : "--"}
            </p>
            <p className="font-display text-sm font-600 text-slate-500 mt-0.5">
              °C
            </p>
          </div>
        </div>

        {/* Range bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-mono-data text-slate-600">
            <span>{TEMP_RANGE.min}°C</span>
            <span>{TEMP_RANGE.max}°C</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${value < 26 ? "bg-cyan-500" : value < 35 ? "bg-orange-500" : "bg-rose-500"}`}
              initial={{ width: "0%" }}
              animate={{ width: `${(value / TEMP_RANGE.max) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function TempSkeleton() {
  return (
    <div className="glass-card rounded-3xl p-6 ring-1 ring-slate-700/30">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="skeleton h-8 w-8 rounded-xl" />
          <div className="skeleton h-4 w-24 rounded-full" />
        </div>
        <div className="skeleton mx-auto h-40 w-40 rounded-full" />
        <div className="skeleton h-1.5 w-full rounded-full" />
      </div>
    </div>
  );
}
