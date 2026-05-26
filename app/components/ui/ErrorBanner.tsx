"use client";

import { motion } from "framer-motion";
import { WifiOff, RefreshCw } from "lucide-react";

interface ErrorBannerProps {
  onRetry: () => void;
}

export default function ErrorBanner({ onRetry }: ErrorBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-7xl px-4 sm:px-6"
    >
      <div className="flex items-center justify-between gap-4 rounded-2xl bg-rose-500/10 px-5 py-3.5 ring-1 ring-rose-500/25">
        <div className="flex items-center gap-3">
          <WifiOff className="h-4 w-4 text-rose-400 shrink-0" />
          <p className="font-display text-sm font-500 text-rose-300">
            Gagal terhubung ke server. Pastikan backend Go dan Ngrok sudah
            berjalan.
          </p>
        </div>
        <button
          onClick={onRetry}
          className="flex items-center gap-2 rounded-xl bg-rose-500/20 px-3 py-1.5 text-xs font-600 font-display text-rose-300
            hover:bg-rose-500/30 ring-1 ring-rose-500/30 transition-all duration-200 shrink-0"
        >
          <RefreshCw className="h-3 w-3" />
          Coba Lagi
        </button>
      </div>
    </motion.div>
  );
}
