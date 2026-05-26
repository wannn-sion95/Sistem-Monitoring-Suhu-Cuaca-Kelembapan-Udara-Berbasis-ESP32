"use client";

import { motion } from "framer-motion";
import { BarChart2, Thermometer, Droplets, Info } from "lucide-react";
import { useState, useEffect } from "react";
// Pastikan path import ini bener sesuai file types lu, atau hapus 'TEMP_RANGE' kalau lu ga punya file types-nya.
import { WeatherData, TEMP_RANGE } from "@/types/weather";

// ─── Props ────────────────────────────────────────────────────────────────────
interface AnalyticsCardProps {
  history: WeatherData[];
}

// ─── Seed mock data ───────────────────────────────────────────────────────────
function generateMockHistory(): WeatherData[] {
  const now = Date.now();
  return Array.from({ length: 20 }, (_, i) => ({
    suhu: 28 + Math.sin(i * 0.4) * 6 + Math.random() * 2,
    kelembapan: 55 + Math.cos(i * 0.3) * 18 + Math.random() * 4,
    timestamp: new Date(now - (19 - i) * 5000).toISOString(),
  }));
}

// ─── Bar ──────────────────────────────────────────────────────────────────────
function Bar({
  suhu,
  kelembapan,
  index,
  total,
  isMock,
}: {
  suhu: number;
  kelembapan: number;
  index: number;
  total: number;
  isMock: boolean;
}) {
  // Kalau TEMP_RANGE.max error karena lu ga punya file-nya, ganti aja jadi 50
  const maxTemp = TEMP_RANGE?.max || 50;
  const tempPct = Math.min((suhu / maxTemp) * 100, 100);
  const humPct = Math.min(kelembapan, 100);
  const isLatest = index === total - 1;

  return (
    <div className="group relative flex flex-col items-center gap-1 flex-1 min-w-0">
      {/* Tooltip on hover */}
      <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="whitespace-nowrap rounded-xl bg-slate-800 px-3 py-2 text-[10px] font-mono ring-1 ring-slate-600/50 shadow-xl">
          <p className="text-orange-400">🌡 {suhu.toFixed(1)}°C</p>
          <p className="text-cyan-400">💧 {kelembapan.toFixed(1)}%</p>
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
      </div>

      {/* Dual bar column */}
      <div className="flex items-end gap-2.5 h-24 w-full">
        <motion.div
          className={`flex-1 rounded-t-sm ${isMock ? "opacity-30" : "opacity-100"}
            ${isLatest ? "ring-1 ring-orange-400/40" : ""}
            ${suhu >= 32 ? "bg-rose-500" : suhu >= 26 ? "bg-orange-500" : "bg-cyan-500"}`}
          initial={{ height: 0 }}
          animate={{ height: `${tempPct}%` }}
          transition={{ duration: 0.6, delay: index * 0.03, ease: "easeOut" }}
          style={{ minHeight: "2px" }}
        />
        <motion.div
          className={`flex-1 rounded-t-sm ${isMock ? "opacity-30" : "opacity-100"}
            ${isLatest ? "ring-1 ring-cyan-400/40" : ""}
            ${kelembapan >= 75 ? "bg-rose-500/70" : kelembapan >= 50 ? "bg-cyan-500/70" : "bg-cyan-400/40"}`}
          initial={{ height: 0 }}
          animate={{ height: `${humPct}%` }}
          transition={{
            duration: 0.6,
            delay: index * 0.03 + 0.05,
            ease: "easeOut",
          }}
          style={{ minHeight: "2px" }}
        />
      </div>

      {/* Latest label */}
      {isLatest && (
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-semibold text-cyan-400 whitespace-nowrap">
          NOW
        </div>
      )}
    </div>
  );
}

// ─── Stat summary ─────────────────────────────────────────────────────────────
function StatPill({
  icon,
  label,
  value,
  unit,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-slate-900/60 px-4 py-3 ring-1 ring-slate-700/30 flex-1">
      <span className={color}>{icon}</span>
      <div>
        <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-500">
          {label}
        </p>
        <p className={`font-mono text-sm font-bold ${color} leading-tight`}>
          {value}
          <span className="text-slate-500 ml-0.5 text-[10px]">{unit}</span>
        </p>
      </div>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function AnalyticsCard({ history }: AnalyticsCardProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [mockData, setMockData] = useState<WeatherData[]>([]);

  // KUNCI JAWABAN HYDRATION ERROR ADA DI SINI
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
      setMockData(generateMockHistory()); // Data palsu baru dibuat SETELAH browser nge-load web lu
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Tembok Penghalang: Kalau masih dirender sama server, kasih skeleton animasi loading
  if (!isMounted) {
    return (
      <div className="h-80 w-full animate-pulse rounded-3xl bg-slate-900/50 border border-slate-800 flex items-center justify-center">
        <span className="text-sm font-semibold tracking-widest text-slate-600 uppercase">
          Memuat Grafik Analitik...
        </span>
      </div>
    );
  }

  // Logika Data
  const isMock = history?.length < 3;
  const displayData = isMock ? mockData : history.slice(-20);

  const temps = displayData.map((d) => d.suhu);
  const hums = displayData.map((d) => d.kelembapan);

  const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
  const maxTemp = Math.max(...temps);
  const minTemp = Math.min(...temps);
  const avgHum = hums.reduce((a, b) => a + b, 0) / hums.length;
  const maxHum = Math.max(...hums);

  return (
    <motion.div
      whileHover={{ scale: 1.008, y: -3 }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      className="relative overflow-hidden rounded-3xl p-6 ring-1 ring-slate-700/30 transition-all duration-500 hover:ring-slate-600/40 hover:shadow-xl bg-slate-900/40 backdrop-blur-xl"
    >
      {/* Ambient */}
      <div className="absolute right-0 top-0 h-32 w-64 rounded-full bg-cyan-500/5 blur-3xl" />
      <div className="absolute left-0 bottom-0 h-24 w-48 rounded-full bg-orange-500/5 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800/80 ring-1 ring-slate-700/50">
              <BarChart2 className="h-4 w-4 text-slate-400" strokeWidth={2} />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">
                Data Sensor
              </p>
              <p className="text-sm font-bold text-slate-200">
                Riwayat 20 Data Terakhir
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                <span className="h-2 w-2 rounded-sm bg-orange-500 inline-block" />
                Suhu
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                <span className="h-2 w-2 rounded-sm bg-cyan-500/70 inline-block" />
                Kelembaban
              </span>
            </div>

            {isMock && (
              <div className="flex items-center gap-1 rounded-lg bg-amber-500/10 px-2 py-1 ring-1 ring-amber-500/20">
                <Info className="h-3 w-3 text-amber-400" />
                <span className="text-[10px] font-semibold text-amber-400">
                  Demo
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Y-axis labels + chart */}
        <div className="flex gap-3">
          <div className="flex flex-col justify-between pb-5 text-[9px] font-mono text-slate-600 text-right w-7 shrink-0">
            <span>100%</span>
            <span>75%</span>
            <span>50%</span>
            <span>25%</span>
            <span>0%</span>
          </div>

          <div className="flex-1 flex flex-col gap-1">
            <div className="relative h-24 mb-5">
              {[0, 25, 50, 75, 100].map((pct) => (
                <div
                  key={pct}
                  className="absolute left-0 right-0 border-t border-slate-800/60"
                  style={{ bottom: `${pct}%` }}
                />
              ))}
              <div className="absolute inset-0 flex items-end gap-0.5 px-0">
                {displayData.map((d, i) => (
                  <Bar
                    key={i}
                    suhu={d.suhu}
                    kelembapan={d.kelembapan}
                    index={i}
                    total={displayData.length}
                    isMock={isMock}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-between px-0 mt-2">
              {[
                0,
                Math.floor(displayData.length / 2),
                displayData.length - 1,
              ].map((idx) => (
                <span key={idx} className="text-[9px] font-mono text-slate-500">
                  {new Date(displayData[idx].timestamp).toLocaleTimeString(
                    "id-ID",
                    { hour: "2-digit", minute: "2-digit" },
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatPill
            icon={<Thermometer className="h-4 w-4" />}
            label="Rata Suhu"
            value={avgTemp.toFixed(1)}
            unit="°C"
            color="text-orange-400"
          />
          <StatPill
            icon={<Thermometer className="h-4 w-4" />}
            label="Maks/Min"
            value={`${maxTemp.toFixed(0)}/${minTemp.toFixed(0)}`}
            unit="°C"
            color="text-rose-400"
          />
          <StatPill
            icon={<Droplets className="h-4 w-4" />}
            label="Rata Lembab"
            value={avgHum.toFixed(1)}
            unit="%"
            color="text-cyan-400"
          />
          <StatPill
            icon={<Droplets className="h-4 w-4" />}
            label="Puncak"
            value={maxHum.toFixed(1)}
            unit="%"
            color="text-cyan-300"
          />
        </div>
      </div>
    </motion.div>
  );
}
