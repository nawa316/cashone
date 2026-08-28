/**
 * Multi-Currency FX Rates (Pegged to 1 USD base)
 */
export const EXCHANGE_RATES_TO_USD: Record<string, number> = {
  USD: 1.0,
  EUR: 1.08,
  GBP: 1.28,
  JPY: 0.0065, // ~154 JPY per USD
  IDR: 0.0000625, // ~16,000 IDR per USD
  SGD: 0.74,
  CAD: 0.73,
  AUD: 0.65,
};

/**
 * Converts an amount from one currency to another using base rates
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string = "USD",
  toCurrency: string = "USD"
): number {
  const fromUpper = fromCurrency.toUpperCase();
  const toUpper = toCurrency.toUpperCase();

  if (fromUpper === toUpper) return amount;

  const fromRate = EXCHANGE_RATES_TO_USD[fromUpper] ?? 1.0;
  const toRate = EXCHANGE_RATES_TO_USD[toUpper] ?? 1.0;

  // Convert to USD base first, then convert to target currency
  const amountInUSD = amount * fromRate;
  const targetAmount = amountInUSD / toRate;

  return targetAmount;
}

/**
 * Calculates total converted net worth across multi-currency accounts
 */
export function calculateConsolidatedNetWorth(
  accounts: Array<{ balance: number; currency?: string }>,
  targetCurrency: string = "USD"
): number {
  return accounts.reduce((total, acc) => {
    const balance = Number(acc.balance || 0);
    const converted = convertCurrency(balance, acc.currency || "USD", targetCurrency);
    return total + converted;
  }, 0);
}
