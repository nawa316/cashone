import type { Metadata } from "next";
import { Suspense } from "react";
import { Catamaran, Inter } from "next/font/google";
import { NavigationProgress } from "@/components/layout/navigation-progress";
import "./globals.css";

const catamaran = Catamaran({
  variable: "--font-catamaran",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const viewport = {
  themeColor: "#0E1526",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Cashone — Personal Finance & Double-Entry Ledger",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Cashone",
  },

  description:
    "Institutional-grade personal finance ledger, multi-account liquid tracking, atomic transfers, category analytics, and receipt storage.",
  keywords: [
    "personal finance",
    "budget tracker",
    "double entry ledger",
    "cashflow analytics",
    "expense manager",
    "multi-currency tracking",
    "supabase finance",
  ],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Cashone — Personal Finance & Cashflow Tracker",
    description:
      "Manage multi-account cash flows with atomic double-entry balance integrity and category analytics.",
    type: "website",
    siteName: "Cashone",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cashone — Personal Finance & Cashflow Tracker",
    description:
      "Manage multi-account cash flows with atomic double-entry balance integrity and category analytics.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${catamaran.variable} ${inter.variable} dark h-full antialiased`}
    >
      <body className="min-h-screen bg-[#0B0F19] text-slate-100 antialiased font-sans flex flex-col">
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
