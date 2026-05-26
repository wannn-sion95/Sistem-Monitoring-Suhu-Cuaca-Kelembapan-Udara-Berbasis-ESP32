export interface WeatherData {
  suhu: number;
  kelembapan: number;
  timestamp: string;
}

export interface StatusConfig {
  type: "OPTIMAL" | "KRITIS" | "STABIL";
  label: string;
  sublabel: string;
  accentColor: string;
  textClass: string;
  borderClass: string;
  bgClass: string;
  glowClass: string;
  ringClass: string;
}

// Batas minimum dan maksimum suhu (untuk animasi chart)
export const TEMP_RANGE = {
  min: 10,
  max: 50,
};

// Logika Pakar Cuaca Tambak Garam
export function getStatus(suhu: number, kelembapan: number): StatusConfig {
  if (suhu >= 32.0 && kelembapan <= 50.0) {
    return {
      type: "OPTIMAL",
      label: "SIAP PANEN",
      sublabel: "Cuaca terik & kering. Sangat baik untuk kristalisasi.",
      accentColor: "emerald",
      textClass: "text-emerald-400",
      borderClass: "border-emerald-500/40",
      bgClass: "bg-emerald-500/10",
      glowClass: "shadow-emerald-500/20",
      ringClass: "ring-emerald-500/30",
    };
  }

  if (suhu < 26.0 || kelembapan >= 75.0) {
    return {
      type: "KRITIS",
      label: "WASPADA HUJAN",
      sublabel: "Suhu dingin/sangat lembab. Antisipasi cuaca buruk!",
      accentColor: "rose",
      textClass: "text-rose-500",
      borderClass: "border-rose-500/40",
      bgClass: "bg-rose-500/10",
      glowClass: "shadow-rose-500/20",
      ringClass: "ring-rose-500/30",
    };
  }

  return {
    type: "STABIL",
    label: "NORMAL",
    sublabel: "Kondisi stabil. Lanjutkan pemantauan rutin.",
    accentColor: "amber",
    textClass: "text-amber-400",
    borderClass: "border-amber-500/40",
    bgClass: "bg-amber-500/10",
    glowClass: "shadow-amber-500/20",
    ringClass: "ring-amber-500/30",
  };
}
