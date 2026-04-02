import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Casa Aluna - Alquiler Vacacional en Colombia",
  description: "Plataforma de reservas directas para alquileres vacacionales en Colombia. Encuentra tu alojamiento perfecto sin comisiones.",
  keywords: ["alquiler vacacional", "Colombia", "reservas directas", "hospedaje", "turismo"],
  authors: [{ name: "Casa Aluna" }],
  openGraph: {
    title: "Casa Aluna - Alquiler Vacacional en Colombia",
    description: "Plataforma de reservas directas para alquileres vacacionales en Colombia",
    type: "website",
    locale: "es_CO",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-CO"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
