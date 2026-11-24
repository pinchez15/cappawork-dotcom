export const REVENUE_BANDS = [
  "Under $10M",
  "$10M to $50M",
  "$50M to $250M",
  "$250M to $1B",
  "Over $1B",
] as const

export type RevenueBand = (typeof REVENUE_BANDS)[number]

export function isRevenueBand(value: string): value is RevenueBand {
  return (REVENUE_BANDS as readonly string[]).includes(value)
}
