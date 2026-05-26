import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ERK Group · Tambak Garam IoT Monitor",
  description:
    "Dashboard real-time pemantauan kondisi cuaca tambak garam berbasis sensor IoT",
};

export const viewport: Viewport = {
  themeColor: "#020617",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="antialiased bg-[#020617]">{children}</body>
    </html>
  );
}
