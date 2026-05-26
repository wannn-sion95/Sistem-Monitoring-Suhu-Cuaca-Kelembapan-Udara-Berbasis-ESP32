# 🌊 ERK Group — Tambak Garam IoT Dashboard

Dashboard real-time berbasis **Next.js** untuk memantau kondisi cuaca tambak
garam melalui sensor IoT. Data dikonsumsi dari backend **Go** via **Ngrok**.

---

## ✨ Fitur Utama

| Fitur                 | Keterangan                                 |
| --------------------- | ------------------------------------------ |
| **Real-time Polling** | Data diperbarui setiap 5 detik             |
| **Bento Grid Layout** | Tata letak kartu modern & responsif        |
| **Glassmorphism UI**  | Transparansi blur premium                  |
| **Dark Mode**         | Tema Deep Space Oceanic                    |
| **Circular Gauge**    | Progress arc SVG animasi untuk suhu        |
| **Water Wave**        | Visualisasi gelombang air untuk kelembaban |
| **Status Dinamis**    | Logika OPTIMAL / STABIL / KRITIS otomatis  |
| **Trend Arrows**      | Indikator naik/turun antar pembacaan       |
| **Analytics Chart**   | Bar chart 20 data terakhir (no library)    |
| **Skeleton Loading**  | Shimmer placeholder saat pertama load      |
| **Error Banner**      | Notifikasi koneksi gagal + retry           |
| **Framer Motion**     | Stagger entrance + hover glow + spring     |

---

## 🚀 Cara Setup

### 1. Install Dependencies

```bash
npm install
# atau
pnpm install
```

Pastikan package berikut sudah terpasang:

```bash
npm install framer-motion lucide-react
```

### 2. Konfigurasi Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://abc123.ngrok-free.app/data
```

> **Tip:** Jika backend Go berjalan di port 8080 dan Ngrok di-forward ke sana,
> URL-nya biasanya `https://xxxx.ngrok-free.app/data`.

### 3. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

---

## 🗂️ Struktur Folder

```
salt-farm-dashboard/
├── app/
│   ├── globals.css       ← Tailwind + custom keyframes + glassmorphism
│   ├── layout.tsx        ← Root layout + metadata
│   └── page.tsx          ← Halaman utama — orchestrates semua komponen
│
├── components/
│   ├── dashboard/
│   │   ├── Header.tsx         ← Logo, breadcrumb, Live indicator
│   │   ├── StatusCard.tsx     ← Status OPTIMAL / KRITIS / STABIL + animasi
│   │   ├── TemperatureCard.tsx ← SVG circular gauge + animated counter
│   │   ├── HumidityCard.tsx   ← Water wave + level marker + trend
│   │   ├── AnalyticsCard.tsx  ← Bar chart 20 readings + stats row
│   │   └── Footer.tsx         ← Copyright + tech pills + social icons
│   └── ui/
│       └── ErrorBanner.tsx    ← Banner koneksi gagal
│
├── hooks/
│   └── useWeatherData.ts  ← Polling hook dengan history buffer
│
├── types/
│   └── weather.ts         ← Interface data + getStatus() logic
│
├── tailwind.config.ts     ← Custom animations, fonts, glow shadows
└── .env.example           ← Template variabel lingkungan
```

---

## 📡 Format Data Backend

Hook mengharapkan response JSON dari endpoint:

```json
{
  "suhu": 33.5,
  "kelembaban": 45.2,
  "timestamp": "2024-11-15T10:30:00Z"
}
```

---

## 🎨 Logika Status

| Kondisi                             | Status               | Warna              |
| ----------------------------------- | -------------------- | ------------------ |
| `suhu >= 32` AND `kelembaban <= 50` | **OPTIMAL · PANEN**  | 🟢 Emerald         |
| `suhu < 26` OR `kelembaban >= 75`   | **KRITIS · WASPADA** | 🔴 Rose (berkedip) |
| Selain itu                          | **STABIL**           | 🟡 Amber           |

---

## 🛠️ Tech Stack

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS v3**
- **Framer Motion** — animasi & spring physics
- **Lucide React** — icon library
- **Google Fonts** — Syne (UI) + Space Mono (angka)

---

© 2026 ERK Group — Tugas Akhir Matakuliah Praktikum Mikroprosesor & Antarmuka
