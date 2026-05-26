import { useState, useEffect, useCallback } from "react";
import { WeatherData } from "@/types/weather";

// Fungsi membuat riwayat awal dengan variasi acak yang luas agar mencakup 3 kondisi
function generateInitialMock(): WeatherData[] {
  const now = Date.now();
  return Array.from({ length: 20 }, (_, i) => {
    // Memperluas jangkauan suhu (23 - 36) dan kelembapan (40 - 85)
    const suhu = Number((23 + (i % 3) * 4.5 + Math.random() * 2).toFixed(1));
    const kelembapan = Number(
      (40 + (i % 3) * 15 + Math.random() * 5).toFixed(1),
    );
    return {
      suhu,
      kelembapan,
      timestamp: new Date(now - (19 - i) * 5000).toISOString(),
    };
  });
}

export function useWeatherData() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [history, setHistory] = useState<WeatherData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refresh = useCallback(() => {
    setIsLoading(true);

    const initialTimer = setTimeout(() => {
      const initialHistory = generateInitialMock();
      setHistory(initialHistory);
      setData(initialHistory[initialHistory.length - 1]);
      setLastUpdated(new Date());
      setIsLoading(false);
      setIsError(false);
    }, 800);

    return () => clearTimeout(initialTimer);
  }, []);

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      refresh();
    }, 0);

    // Simulasi generator cuaca dinamis yang berganti-ganti di 3 zona kondisi
    const interval = setInterval(() => {
      // Kita buat pengondisian acak agar bisa berpindah di antara 3 status utama
      const rollDice = Math.random();
      let suhu = 29.5;
      let kelembapan = 60.0;

      if (rollDice < 0.33) {
        // 1. Memicu Kondisi OPTIMAL (Hijau): Terik & Kering
        suhu = Number((32.5 + Math.random() * 3).toFixed(1)); // Rentang: 32.5°C - 35.5°C
        kelembapan = Number((38.0 + Math.random() * 10).toFixed(1)); // Rentang: 38% - 48%
      } else if (rollDice < 0.66) {
        // 2. Memicu Kondisi KRITIS (Merah): Dingin atau Sangat Lembab
        suhu = Number((23.0 + Math.random() * 2.5).toFixed(1)); // Rentang: 23°C - 25.5°C
        kelembapan = Number((76.0 + Math.random() * 10).toFixed(1)); // Rentang: 76% - 86%
      } else {
        // 3. Memicu Kondisi STABIL (Kuning): Normal / Transisi
        suhu = Number((27.0 + Math.random() * 4).toFixed(1)); // Rentang: 27°C - 31°C
        kelembapan = Number((52.0 + Math.random() * 15).toFixed(1)); // Rentang: 52% - 67%
      }

      const newData: WeatherData = {
        suhu,
        kelembapan,
        timestamp: new Date().toISOString(),
      };

      setData(newData);
      setLastUpdated(new Date());
      setHistory((prev) => [...prev.slice(-19), newData]);
    }, 5000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [refresh]);

  return { data, history, isLoading, isError, lastUpdated, refresh };
}
