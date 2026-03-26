export type Dimension =
  | "pricing"
  | "frequency"
  | "aov"
  | "concentration"
  | "overhead"
  | "retention";

export type QuestionOption = {
  label: string;
  score: number; // 1 (significant leak) to 4 (strong)
};

export type Question = {
  id: number;
  dimension: Dimension;
  text: string;
  options: QuestionOption[];
};

export const DIMENSION_LABELS: Record<Dimension, string> = {
  pricing: "Pricing Power",
  frequency: "Purchase Frequency",
  aov: "AOV & Utilization",
  concentration: "Client Concentration",
  overhead: "Overhead Efficiency",
  retention: "Delivery & Retention",
};

export const QUESTIONS: Question[] = [
  // --- Pricing (2 questions) ---
  {
    id: 1,
    dimension: "pricing",
    text: "When was the last time you raised prices across your core services?",
    options: [
      { label: "More than 2 years ago (or never)", score: 1 },
      { label: "About 12–24 months ago", score: 2 },
      { label: "Within the last year", score: 3 },
      { label: "We review and adjust prices at least annually", score: 4 },
    ],
  },
  {
    id: 2,
    dimension: "pricing",
    text: "Do you offer tiered pricing or packaging for different service levels?",
    options: [
      { label: "No — we mostly custom-quote everything", score: 1 },
      { label: "We have some structure but it's inconsistent", score: 2 },
      { label: "We have clear packages but rarely upsell between them", score: 3 },
      { label: "We have defined tiers and actively guide clients to the right one", score: 4 },
    ],
  },

  // --- Frequency (2 questions) ---
  {
    id: 3,
    dimension: "frequency",
    text: "How often does your average client purchase from you?",
    options: [
      { label: "Once — most projects are one-and-done", score: 1 },
      { label: "Occasionally — some come back but it's not predictable", score: 2 },
      { label: "Regularly — most clients buy 2–3 times per year", score: 3 },
      { label: "Ongoing — majority of revenue is recurring or retainer-based", score: 4 },
    ],
  },
  {
    id: 4,
    dimension: "frequency",
    text: "What percentage of your revenue comes from recurring contracts or retainers?",
    options: [
      { label: "Less than 10%", score: 1 },
      { label: "10–30%", score: 2 },
      { label: "30–60%", score: 3 },
      { label: "More than 60%", score: 4 },
    ],
  },

  // --- AOV & Utilization (2 questions) ---
  {
    id: 5,
    dimension: "aov",
    text: "Over the past 12 months, has your average project size been growing, flat, or shrinking?",
    options: [
      { label: "Shrinking — we're taking smaller engagements to fill capacity", score: 1 },
      { label: "Flat — roughly the same as last year", score: 2 },
      { label: "Growing slightly", score: 3 },
      { label: "Growing meaningfully — we're moving upmarket", score: 4 },
    ],
  },
  {
    id: 6,
    dimension: "aov",
    text: "How utilized is your delivery team on billable or revenue-generating work?",
    options: [
      { label: "Below 50% — lots of idle or unbillable time", score: 1 },
      { label: "50–65% — there's meaningful slack", score: 2 },
      { label: "65–80% — solid but room for improvement", score: 3 },
      { label: "Above 80% — consistently well-utilized", score: 4 },
    ],
  },

  // --- Client Concentration (2 questions) ---
  {
    id: 7,
    dimension: "concentration",
    text: "What percentage of your total revenue comes from your top 3 clients?",
    options: [
      { label: "More than 60%", score: 1 },
      { label: "40–60%", score: 2 },
      { label: "20–40%", score: 3 },
      { label: "Less than 20%", score: 4 },
    ],
  },
  {
    id: 8,
    dimension: "concentration",
    text: "If your single largest client left tomorrow, how would your business be affected?",
    options: [
      { label: "It would be a crisis — we'd need to cut staff or costs immediately", score: 1 },
      { label: "Significant impact — we'd feel it for months", score: 2 },
      { label: "Manageable — it would hurt but we'd recover within a quarter", score: 3 },
      { label: "Minimal impact — no single client represents that much risk", score: 4 },
    ],
  },

  // --- Overhead Efficiency (2 questions) ---
  {
    id: 9,
    dimension: "overhead",
    text: "Roughly what percentage of your team's time goes to admin, internal meetings, or non-client work?",
    options: [
      { label: "More than 40%", score: 1 },
      { label: "25–40%", score: 2 },
      { label: "15–25%", score: 3 },
      { label: "Less than 15%", score: 4 },
    ],
  },
  {
    id: 10,
    dimension: "overhead",
    text: "How many different software tools does your team use to manage projects, communicate, and track work?",
    options: [
      { label: "10+ tools — everyone uses something different", score: 1 },
      { label: "6–10 tools — there's overlap and confusion", score: 2 },
      { label: "3–5 tools — mostly streamlined", score: 3 },
      { label: "1–2 core tools — tightly integrated", score: 4 },
    ],
  },

  // --- Delivery & Retention (2 questions) ---
  {
    id: 11,
    dimension: "retention",
    text: "What's your client retention rate year over year?",
    options: [
      { label: "Below 60% — we lose more clients than we keep", score: 1 },
      { label: "60–75% — decent but inconsistent", score: 2 },
      { label: "75–85% — strong with some churn", score: 3 },
      { label: "Above 85% — clients stay and expand", score: 4 },
    ],
  },
  {
    id: 12,
    dimension: "retention",
    text: "How often do your projects go over scope, over budget, or past deadline?",
    options: [
      { label: "Frequently — it's the norm, not the exception", score: 1 },
      { label: "Often — maybe half the time", score: 2 },
      { label: "Sometimes — a few per quarter", score: 3 },
      { label: "Rarely — we have strong scoping and change-order processes", score: 4 },
    ],
  },
];
