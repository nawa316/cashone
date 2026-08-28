import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale?: string
): string {
  const curr = currency ? currency.toUpperCase() : "USD";
  const defaultLocale =
    locale ||
    (curr === "IDR"
      ? "id-ID"
      : curr === "EUR"
      ? "de-DE"
      : curr === "GBP"
      ? "en-GB"
      : curr === "JPY"
      ? "ja-JP"
      : curr === "SGD"
      ? "en-SG"
      : curr === "CAD"
      ? "en-CA"
      : curr === "AUD"
      ? "en-AU"
      : "en-US");

  const noDecimals = ["IDR", "JPY", "KRW"].includes(curr);

  return new Intl.NumberFormat(defaultLocale, {
    style: "currency",
    currency: curr,
    minimumFractionDigits: noDecimals ? 0 : 2,
    maximumFractionDigits: noDecimals ? 0 : 2,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}
