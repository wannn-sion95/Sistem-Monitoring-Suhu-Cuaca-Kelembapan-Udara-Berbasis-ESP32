
![ERK Group Banner](https://capsule-render.vercel.app/api?type=waving&color=0:0B132B,30:1C2541,60:3A506B,100:5BC0BE&height=280&section=header&text=Tambak%20Garam%20IoT&fontSize=58&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Real-Time%20Monitoring%20Dashboard%20by%20ERK%20Group&descAlignY=60&descSize=20)

<div align="center">

# 🌊 ERK Group — Tambak Garam IoT Dashboard

### Smart Monitoring Dashboard for Salt Farm Environment

Dashboard real-time berbasis **Next.js** untuk memantau kondisi tambak garam menggunakan sensor IoT dengan tampilan modern bergaya **Glassmorphism Dashboard UI**.

<img src="https://img.shields.io/badge/Next.js-14+-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/TailwindCSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/FramerMotion-EF008F?style=for-the-badge&logo=framer&logoColor=white" />
<img src="https://img.shields.io/badge/IoT-00C896?style=for-the-badge&logo=raspberrypi&logoColor=white" />

</div>

---

# ✨ Features

<table>
<tr>
<td width="50%">

## 📡 Real-Time Monitoring
- Polling data setiap 5 detik
- Live sensor tracking
- Dynamic trend indicator
- Automatic status calculation

</td>
<td width="50%">

## 🎨 Modern UI/UX
- Bento Grid Layout
- Glassmorphism effect
- Deep Ocean Dark Mode
- Smooth animation & hover glow

</td>
</tr>

<tr>
<td width="50%">

## 📊 Data Visualization
- Circular temperature gauge
- Water wave humidity meter
- Analytics chart
- Animated statistics

</td>
<td width="50%">

## ⚡ Performance
- Skeleton loading
- Error retry system
- Optimized rendering
- Lightweight custom chart

</td>
</tr>
</table>

---

# 🖼️ Dashboard Preview

```txt
🌡️ Temperature Gauge
💧 Water Wave Humidity
📈 Analytics Chart
🚨 Dynamic Status Detection
📊 Live Monitoring Cards
````

> UI didesain dengan konsep:
>
> **Oceanic · Futuristic · Minimal · Glassmorphism · SaaS Dashboard**

---

# 🚀 Installation

## 1. Clone Repository

```bash
git clone https://github.com/username/salt-farm-dashboard.git
```

## 2. Install Dependencies

```bash
npm install
```

atau

```bash
pnpm install
```

Install package tambahan:

```bash
npm install framer-motion lucide-react
```

---

# ⚙️ Environment Setup

Buat file `.env.local`

```bash
cp .env.example .env.local
```

Isi konfigurasi:

```env
NEXT_PUBLIC_API_URL=https://your-ngrok-url.ngrok-free.app/data
```

> Backend Go akan mengirim data sensor melalui endpoint JSON menggunakan Ngrok tunnel.

---

# ▶️ Run Development Server

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

# 🗂️ Project Structure

```bash
salt-farm-dashboard/
│
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── dashboard/
│   │   ├── Header.tsx
│   │   ├── StatusCard.tsx
│   │   ├── TemperatureCard.tsx
│   │   ├── HumidityCard.tsx
│   │   ├── AnalyticsCard.tsx
│   │   └── Footer.tsx
│   │
│   └── ui/
│       └── ErrorBanner.tsx
│
├── hooks/
│   └── useWeatherData.ts
│
├── types/
│   └── weather.ts
│
├── tailwind.config.ts
└── .env.example
```

---

# 📡 Backend Response Format

```json
{
  "suhu": 33.5,
  "kelembaban": 45.2,
  "timestamp": "2026-05-29T10:30:00Z"
}
```

---

# 🧠 Status Logic

| Condition                       | Status              |
| ------------------------------- | ------------------- |
| suhu >= 32 AND kelembaban <= 50 | 🟢 OPTIMAL · PANEN  |
| suhu < 26 OR kelembaban >= 75   | 🔴 KRITIS · WASPADA |
| lainnya                         | 🟡 STABIL           |

---

# 🛠️ Tech Stack

| Technology    | Usage              |
| ------------- | ------------------ |
| Next.js 14+   | Frontend Framework |
| TypeScript    | Type Safety        |
| Tailwind CSS  | Styling            |
| Framer Motion | Animation          |
| Lucide React  | Icons              |
| Ngrok         | Public Tunnel      |
| Go Backend    | Sensor API         |
| IoT Sensors   | Data Collection    |

---

# 🌌 UI Design Concept

* 🌊 Deep Ocean Theme
* 🪟 Glassmorphism Interface
* ⚡ Smooth Motion Animation
* 📱 Fully Responsive Layout
* 🧊 Neon Glow Accent
* 📊 Dashboard SaaS Experience

---

# 👨‍💻 Developed By

### ERK Group

Tugas Akhir Praktikum Mikroprosesor & Antarmuka — 2026

---

<div align="center">

### ⭐ If you like this project, give it a star on GitHub!

</div>

![Footer](https://capsule-render.vercel.app/api?type=waving\&color=0:5BC0BE,50:3A506B,100:0B132B\&height=120\&section=footer)

```
```
