import type { Metadata } from "next";
import { Catamaran, Inter } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Cashone — Personal Finance & Cashflow Tracker",
  description: "Institutional-grade personal finance ledger, multi-account liquid tracking, and double-entry transfers.",
  icons: {
    icon: "/favicon.ico",
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
        {children}
      </body>
    </html>
  );
}
