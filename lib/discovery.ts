export const REVENUE_BANDS = [
  "Under $25M",
  "$25M – $50M",
  "$50M – $100M",
  "$100M – $250M",
  "$250M – $1B",
  "$1B+",
] as const

export type RevenueBand = (typeof REVENUE_BANDS)[number]

export function isRevenueBand(value: string): value is RevenueBand {
  return (REVENUE_BANDS as readonly string[]).includes(value)
}
