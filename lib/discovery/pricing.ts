import { parseUsd } from "./gate";
import type { Extraction } from "./schema";

// Impact pricing with an hours cap, computed in code so every number in the proposal traces back.
// Price is a share of the first year's unlocked value, so a bigger business that unlocks more pays more.
// The hours cap is price ÷ minimum hourly rate: scope beyond it gets cut or phased, never absorbed.
// These are starting assumptions. Tune them as deals close.

export const IMPACT_SHARE = { low: 0.1, target: 0.15, high: 0.2 } as const;
export const PRICE_FLOOR_USD = 30_000;
export const MIN_HOURLY_USD = 300;

export type PricingAnchors = {
  unlocked_monthly: number | null;
  unlocked_year_one: number | null;
  impact_share: typeof IMPACT_SHARE;
  price_low: number;
  price_target: number;
  price_high: number;
  price_floor: number;
  likely_price: number; // what Nate entered before the call
  likely_price_share: number | null; // likely price as a share of year-one value
  min_hourly: number;
  hours_cap: number; // at the target price
  payback_months: number | null; // target price ÷ monthly unlocked value
};

const roundTo = (n: number, step: number) => Math.round(n / step) * step;

export function computePricing(result: Extraction, likelyPriceUsd: number): PricingAnchors {
  const monthly = parseUsd(result.deal.unlocked_value_monthly.value);
  const yearOne = monthly != null ? monthly * 12 : null;
  const at = (share: number) =>
    yearOne != null ? Math.max(PRICE_FLOOR_USD, roundTo(yearOne * share, 2_500)) : Math.max(PRICE_FLOOR_USD, likelyPriceUsd);

  const target = at(IMPACT_SHARE.target);
  return {
    unlocked_monthly: monthly,
    unlocked_year_one: yearOne,
    impact_share: IMPACT_SHARE,
    price_low: at(IMPACT_SHARE.low),
    price_target: target,
    price_high: at(IMPACT_SHARE.high),
    price_floor: PRICE_FLOOR_USD,
    likely_price: likelyPriceUsd,
    likely_price_share: yearOne ? Number((likelyPriceUsd / yearOne).toFixed(3)) : null,
    min_hourly: MIN_HOURLY_USD,
    hours_cap: Math.floor(target / MIN_HOURLY_USD),
    payback_months: monthly ? Number((target / monthly).toFixed(1)) : null,
  };
}
