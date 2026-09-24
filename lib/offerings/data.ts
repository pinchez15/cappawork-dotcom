export type OfferingDetail = {
  label: string;
  text: string;
};

export type OfferingTier = {
  name: string;
  price: string;
  timeline: string;
  credit: string;
  bestFor: string;
};

export type OfferingPhase = {
  range: string;
  title: string;
  body: string;
  note?: string;
};

export type Offering = {
  slug: "discover" | "build" | "modernize" | "transformation";
  title: string;
  subtitle: string;
  subtitleNote?: string;
  price: string;
  priceNote: string;
  outcome: string;
  howItWorks: OfferingDetail[];
  deliverables: string[];
  whoBlock: string;
  tiers?: OfferingTier[];
  phases?: OfferingPhase[];
  proof?: { stat: string; label: string }[];
  billing?: string;
  guarantee?: string;
  afterEngagement?: string;
  pricingFaq?: string;
  inquiryKey: string;
  ctaText: string;
  ctaSub: string;
  termsNote: string;
  journeyPrev?: { label: string; href: string };
  journeyNext?: { label: string; href: string };
};

/** Shared Varick-style pricing line for engagement packages (not the Week 0 audit). */
export const PRICING_AFTER_AUDIT =
  "Engagements are scoped from the audit: pricing depends on the workflow, risk, complexity, and solution. We discuss investment after discovery once the work is clear.";

export const OFFERINGS: Offering[] = [
  {
    slug: "discover",
    title: "Discover",
    subtitle: "Map Computer Work vs Human Work before you spend on the wrong build.",
    subtitleNote:
      "Most AI projects fail because the wrong problem got solved first. Discover answers what to fix, in what order, and why.",
    price: "$2,500",
    priceNote: "Computer Work Audit (Week 0) · credited toward Transformation · longer Discover scopes available",
    outcome:
      "A prioritized scope your leadership team can execute — with baselines, build vs. buy answered, and ROI ranked.",
    tiers: [
      {
        name: "Computer Work Audit (Week 0)",
        price: "$2,500",
        timeline: "One department · pre-contract",
        credit: "Fully credited toward a 6-Week AI Transformation",
        bestFor:
          "You need a baseline before signing a transformation: hours/week on the workflow, cycle time, and error/rework rate. No baseline → no guarantee.",
      },
      {
        name: "Discover Sprint",
        price: "Scoped after audit",
        timeline: "About 2 weeks",
        credit: "Credited toward Transformation or Build within 90 days",
        bestFor: "You need a prioritized plan before committing transformation or product-sprint budget.",
      },
      {
        name: "Discover Deep",
        price: "Scoped after audit",
        timeline: "About 4–6 weeks",
        credit: "Credited toward Transformation or Build within 90 days",
        bestFor: "Complex operations or a product decision that needs numbers and architecture behind it.",
      },
    ],
    howItWorks: [
      {
        label: "Start with one department.",
        text: "We shadow the workflow, pull truth from your existing stack, and separate Computer Work from Human Work.",
      },
      {
        label: "Baseline three numbers.",
        text: "Hours per week on the workflow, cycle time, and error/rework rate — the same baselines the Transformation guarantee requires.",
      },
      {
        label: "Rank opportunities by leverage.",
        text: "Every recommendation is sequenced by revenue, cost, or risk impact versus effort, with a clear build vs. buy call.",
      },
      {
        label: "Deliver a scope you can sign.",
        text: "Written deliverable, executive readout, and a recommendation on Transformation or Build as the next step.",
      },
    ],
    deliverables: [
      "Computer Work vs Human Work map",
      "Baseline metrics (hours, cycle time, error/rework)",
      "Prioritized workflow opportunities",
      "Build vs. buy recommendation",
      "Technical architecture notes",
      "Executive presentation and next-step plan",
      "Signed one-page scope path into Transformation (when ready)",
    ],
    pricingFaq: PRICING_AFTER_AUDIT,
    whoBlock:
      "You run a business over ~$50M in revenue (or a department that size), know AI should change how you operate, and want clarity before a larger commitment.",
    inquiryKey: "Discover",
    ctaText: "Book a Computer Work Audit",
    ctaSub:
      "Week 0 is $2,500 and credits toward Transformation. We will scope Sprint or Deep on the call if a longer Discover is the right fit.",
    termsNote:
      "When you book Discover, you are holding dedicated capacity that another business could fill.",
    journeyNext: { label: "6-Week Transformation", href: "/transformation" },
  },
  {
    slug: "build",
    title: "Build",
    subtitle: "A product sprint for software your team — or your customers — will use.",
    subtitleNote:
      "Discrete product development: internal tools or external customer-facing products. External products are typically fuller scope. Internal workflow AI that is really a department transform belongs in Transformation, not Build.",
    price: "Scoped after audit",
    priceNote: "Product sprint · timeline depends on scope · you own the IP",
    outcome:
      "Production-ready product software with AI where it belongs in the workflow — and your team trained to own it.",
    phases: [
      {
        range: "Phase 1",
        title: "Strategy and design.",
        body: "Product strategy, architecture, wireframes, and sign-off with scope and success metrics locked before code.",
      },
      {
        range: "Phase 2",
        title: "Build and test.",
        body: "Full-stack development, integrations, AI workflows, and client UAT with working software every week.",
      },
      {
        range: "Phase 3",
        title: "Launch and stabilize.",
        body: "Production deployment, team training, go-live monitoring, and handoff of software you fully own.",
      },
    ],
    howItWorks: [
      {
        label: "A product, not a department rewrite.",
        text: "Client portal, operational CRM, dashboard, or customer-facing app scoped as one bounded product. If the need is 2–4 workflows inside one department in six weeks, that is Transformation.",
      },
      {
        label: "Internal or external.",
        text: "Internal products serve your team. External products serve your customers and are typically more robust — auth, multi-tenant concerns, and production hardening included.",
      },
      {
        label: "AI where work already happens.",
        text: "Drafting, routing, summarizing, and follow-up built into the product so people recover time for Human Work.",
      },
      {
        label: "You own it.",
        text: "Full IP transfer with CappaWork hosting, securing, and maintaining what we ship as agreed.",
      },
    ],
    deliverables: [
      "Product strategy and UX/UI design",
      "AI workflow design where it fits the product",
      "Full-stack web application development",
      "Systems integration",
      "Testing, deployment, and launch support",
      "Team training and documentation",
      "Post-launch stabilization window",
    ],
    proof: [
      { stat: "Live in production", label: "SEC-compliant CRM + AI research engine for wealth management" },
      { stat: "Full handoff", label: "Scoping through production deployment with your team trained" },
      { stat: "You own it", label: "Advisor CRM, client portal, and AI monitoring, fully transferred" },
    ],
    pricingFaq: PRICING_AFTER_AUDIT,
    whoBlock:
      "You know what product needs to be built — internal tool or external customer software — and want one senior partner from architecture through launch. For a single department and 2–4 workflows in six weeks, see Transformation.",
    inquiryKey: "Build",
    ctaText: "Book a Computer Work Audit",
    ctaSub: "We align on product scope and timeline after discovery — before any commitment.",
    termsNote: "When you commit to a build, you are reserving dedicated capacity.",
    journeyPrev: { label: "Discover", href: "/discover" },
    journeyNext: { label: "6-Week Transformation", href: "/transformation" },
  },
  {
    slug: "transformation",
    title: "6-Week AI Transformation",
    subtitle: "One department. 2–4 workflows. Production in six weeks — not a year of transformation theater.",
    subtitleNote:
      "An experienced operator with cutting-edge AI judgment, integrated into your systems — not a pile of seats and token spend that never hits the bottom line.",
    price: "Scoped after audit",
    priceNote: "Six weeks · one department · 2–4 workflows · you own the IP",
    outcome:
      "Live throughput on 2–4 high-leverage workflows in one department — designed for ROI within about six months (directional; we do not promise guaranteed savings).",
    phases: [
      {
        range: "Week 0",
        title: "Computer Work Audit.",
        body: "Paid $2,500 audit, fully credited to the engagement. One department. Baseline three numbers: hours/week on the workflow, cycle time, and error/rework rate. No baseline → no guarantee.",
      },
      {
        range: "Weeks 1–2",
        title: "Discover.",
        body: "Shadow, map Computer Work vs Human Work, pull truth from your existing stack. Deliverable: a signed one-page scope (2–4 workflows, baseline, target). Nothing is built until that scope is signed.",
      },
      {
        range: "Weeks 3–5",
        title: "Build.",
        body: "Production on your environment, integrated to your stack, with a parallel run from week 4. Live throughput — not a demo.",
      },
      {
        range: "Week 6",
        title: "Adopt.",
        body: "Cutover, train your team, deliver a runbook, and transfer client-owned IP. Go-live measured against the Week 0 baseline.",
      },
    ],
    howItWorks: [
      {
        label: "One department, 2–4 workflows.",
        text: "We find high-leverage work that increases revenue, reduces cost, or reduces risk — then create, deploy, and test inside six weeks. This is department transformation, not a standalone product sprint.",
      },
      {
        label: "Best tools in your stack.",
        text: "Agents and automation integrated into the systems you already run, leaving a durable process your team can operate.",
      },
      {
        label: "50/50 billing.",
        text: "50% at signature, 50% at go-live. No net-30 on the back half.",
      },
      {
        label: "You own the IP.",
        text: "Code, runbooks, and process documentation transfer to you at go-live.",
      },
    ],
    deliverables: [
      "Week 0 baseline (hours, cycle time, error/rework)",
      "Signed one-page scope for 2–4 workflows",
      "Production agents/workflows in your environment",
      "Parallel-run evidence before cutover",
      "Team training and operational runbook",
      "Full IP ownership at go-live",
      "12-month narrow fix guarantee on shipped workflows",
    ],
    billing:
      "50% due at signature. 50% due at go-live. The Week 0 Computer Work Audit ($2,500) is credited to the engagement. No net-30 on the second half. Engagement investment is quoted after the audit.",
    guarantee:
      "For twelve months after go-live, the workflows we shipped keep working as specified. If a model, API, or vendor change breaks them, we fix within two business days at no charge. This is not a guarantee of savings. It does not cover new workflows, scope changes, or systems turned off. Included fix capacity is capped at roughly six hours per month; work beyond that moves to the Modernize retainer.",
    afterEngagement:
      "Optional Modernize retainer after go-live: unlimited fixes on shipped work plus one new workflow per month. Scoped and priced after Transformation.",
    pricingFaq: PRICING_AFTER_AUDIT,
    whoBlock:
      "Operators, founders, and executives at businesses over ~$50 million in revenue who want production results in one department — not a slide deck, and not a multi-month product build when the need is workflow transformation.",
    inquiryKey: "6-Week AI Transformation",
    ctaText: "Book a Computer Work Audit",
    ctaSub:
      "Week 0 is $2,500 and credits toward the engagement. We confirm fit and department scope on the call; Transformation investment is quoted after discovery.",
    termsNote:
      "Transformation engagements reserve dedicated capacity. Week 0 is required before Weeks 1–6 begin.",
    journeyPrev: { label: "Discover", href: "/discover" },
    journeyNext: { label: "Modernize retainer", href: "/modernize" },
  },
  {
    slug: "modernize",
    title: "Modernize",
    subtitle: "Optional retainer after Transformation — keep shipped work healthy and add one new workflow a month.",
    subtitleNote:
      "Not the primary engagement. Modernize is the ongoing partnership after a 6-Week AI Transformation (or a comparable Build).",
    price: "Optional retainer",
    priceNote: "After go-live · unlimited fixes on shipped work · one new workflow per month · scoped after Transformation",
    outcome:
      "Shipped workflows stay production-ready, and your team keeps compounding capacity without restarting a full engagement.",
    phases: [
      {
        range: "Ongoing",
        title: "Fix and extend.",
        body: "Unlimited fixes on workflows we already shipped, plus capacity for one new workflow each month — scoped, built, and handed off in your environment.",
      },
    ],
    howItWorks: [
      {
        label: "Protect what shipped.",
        text: "When models, APIs, or vendors change, we keep your production workflows working — beyond the included Transformation guarantee capacity.",
      },
      {
        label: "One new workflow per month.",
        text: "Steady expansion of Computer Work removal without another six-week reboot.",
      },
      {
        label: "Still your IP.",
        text: "Everything built under Modernize remains yours. We host and maintain as agreed.",
      },
      {
        label: "After Transformation.",
        text: "Designed as the natural next step once Weeks 1–6 are live — not a substitute for the six-week package.",
      },
    ],
    deliverables: [
      "Unlimited fixes on previously shipped workflows",
      "One new workflow per month",
      "Hosting, security, and maintenance as scoped",
      "Continued team support and light training",
      "Priority response when production breaks",
    ],
    pricingFaq: PRICING_AFTER_AUDIT,
    whoBlock:
      "You completed a Transformation (or Build), want the shipped system protected, and have a backlog of the next Computer Work to remove.",
    inquiryKey: "Modernize",
    ctaText: "Talk about Modernize",
    ctaSub: "Best after Transformation. We confirm retainer fit and scope after go-live.",
    termsNote:
      "Modernize is an optional post-engagement retainer, not the primary Transformation path. Capacity is limited.",
    journeyPrev: { label: "6-Week Transformation", href: "/transformation" },
  },
];

export function getOffering(slug: string): Offering | undefined {
  return OFFERINGS.find((o) => o.slug === slug);
}
