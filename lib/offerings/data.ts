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
  slug: "discover" | "build" | "modernize";
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
  inquiryKey: string;
  ctaText: string;
  ctaSub: string;
  termsNote: string;
  journeyPrev?: { label: string; href: string };
  journeyNext?: { label: string; href: string };
};

export const OFFERINGS: Offering[] = [
  {
    slug: "discover",
    title: "Discover",
    subtitle:
      "Build the right roadmap before you build the wrong software.",
    subtitleNote: "Most AI projects fail because the wrong problem got solved first.",
    price: "",
    priceNote: "Sprint · 2 weeks  ·  Deep · 4–6 weeks",
    outcome:
      "A prioritized roadmap your leadership team can execute, with build vs. buy answered and ROI ranked.",
    tiers: [
      {
        name: "Discover Sprint",
        price: "",
        timeline: "2 weeks",
        credit: "",
        bestFor: "You need a prioritized plan before committing build budget.",
      },
      {
        name: "Discover Deep",
        price: "",
        timeline: "4–6 weeks",
        credit: "",
        bestFor: "Complex operations, or a build decision that needs a clear sequence behind it.",
      },
    ],
    howItWorks: [
      {
        label: "Start with context.",
        text: "We review your tools, workflows, and goals, often building on a free working session where we have already found the sharpest pain point.",
      },
      {
        label: "Map where time and margin leak.",
        text: "We trace how work actually flows and where busywork is crowding out judgment.",
      },
      {
        label: "Rank opportunities by ROI.",
        text: "Every recommendation is sequenced by impact vs. effort, with a clear build vs. buy call.",
      },
      {
        label: "Deliver a roadmap you can execute.",
        text: "Written deliverable, executive readout, and a recommendation on Build or Modernize as the next step.",
      },
    ],
    deliverables: [
      "AI modernization roadmap",
      "Workflow and process analysis",
      "Product opportunity assessment",
      "Technical architecture recommendation",
      "Prioritized implementation plan",
      "Executive presentation and next-step plan",
      "Build vs. buy recommendation",
    ],
    whoBlock:
      "You know AI should change how you operate but are unsure what to build first, what to buy, or what is worth the investment.",
    inquiryKey: "Discover",
    ctaText: "Book a Discovery Call",
    ctaSub: "A working session on how the operation runs, and whether Discover is the right next step.",
    termsNote:
      "When you book Discover, you are holding dedicated capacity that another business could fill.",
    journeyNext: { label: "Build", href: "/build" },
  },
  {
    slug: "build",
    title: "Build",
    subtitle: "Production software designed around your business.",
    subtitleNote: "Off-the-shelf tools force your team to adapt; we build software that fits how you already work.",
    price: "",
    priceNote: "You own the IP. We host and maintain.",
    outcome:
      "Production-ready software with AI handling busywork inside the system and your team trained to own it.",
    phases: [
      {
        range: "Month 1",
        title: "Strategy and design.",
        body: "Product strategy, architecture, wireframes, and sign-off with scope and success metrics locked before code.",
      },
      {
        range: "Month 2",
        title: "Build and test.",
        body: "Full-stack development, integrations, AI workflows, and client UAT with working software every week.",
      },
      {
        range: "Month 3",
        title: "Launch and stabilize.",
        body: "Production deployment, team training, go-live monitoring, and handoff of software you fully own.",
      },
    ],
    howItWorks: [
      {
        label: "One primary system.",
        text: "Client portal, operational CRM, dashboard, or workflow hub scoped to one bounded product with clear success metrics.",
      },
      {
        label: "AI where work already happens.",
        text: "Drafting, routing, summarizing, and follow-up built into the system so your team recovers time for human work.",
      },
      {
        label: "Production from day one.",
        text: "Real infrastructure, security, and users on a modern stack chosen for what the product requires.",
      },
      {
        label: "You own it.",
        text: "Full IP transfer with CappaWork hosting, securing, and maintaining what we ship.",
      },
    ],
    deliverables: [
      "Product strategy and UX/UI design",
      "AI workflow design",
      "Full-stack web application development",
      "Systems integration",
      "Testing, deployment, and launch support",
      "Team training and documentation",
      "30-day post-launch stabilization",
    ],
    proof: [
      { stat: "In production", label: "Advisor CRM, research workflow, and the work around it, wealth management" },
      { stat: "16 weeks", label: "Scoping through production deployment" },
      { stat: "You own it", label: "Advisor CRM, client portal, and AI monitoring, fully transferred" },
    ],
    whoBlock:
      "You know what needs to be built and want one senior partner from architecture through launch, without an agency handoff.",
    inquiryKey: "Build",
    ctaText: "Book a Discovery Call",
    ctaSub: "We align on scope and timeline before any commitment.",
    termsNote:
      "When you commit to a build, you are reserving dedicated capacity.",
    journeyPrev: { label: "Discover", href: "/discover" },
    journeyNext: { label: "Modernize", href: "/modernize" },
  },
  {
    slug: "modernize",
    title: "Modernize",
    subtitle: "A senior AI product engineer embedded in your business.",
    subtitleNote: "For when the work outgrows a single scoped project.",
    price: "",
    priceNote: "You own everything built. The system stays on call.",
    outcome:
      "A business that gets faster and more AI-native every month, with software built in your environment and adoption that sticks.",
    phases: [
      {
        range: "Month 1",
        title: "Embed and plan.",
        body: "A week inside your operation, then a modernization roadmap with ROI, priorities, and success metrics before the first build sprint.",
      },
      {
        range: "Months 2–4",
        title: "Build and integrate.",
        body: "Continuous delivery inside your existing systems: legacy modernization, automation, internal tools, and AI implementations.",
      },
      {
        range: "Months 5–6",
        title: "Adopt and stabilize.",
        body: "Team training, hardening, and technical leadership while you retain the infrastructure, code, and IP.",
      },
    ],
    howItWorks: [
      {
        label: "Embedded in your business.",
        text: "A senior AI product engineer alongside your leadership team, scoping and shipping inside your environment.",
      },
      {
        label: "Continuous opportunity finding.",
        text: "We keep identifying where computer work is eating human work and building the next fix.",
      },
      {
        label: "Built in your stack.",
        text: "Everything ships inside your existing software environment and you own the infrastructure, code, and IP.",
      },
      {
        label: "Adoption is the deliverable.",
        text: "Technical leadership and team training so the organization actually uses what we build.",
      },
    ],
    deliverables: [
      "AI implementation across departments",
      "Legacy system modernization",
      "Internal software and workflow automation",
      "Product development on ongoing priorities",
      "Technical leadership and architecture guidance",
      "Team adoption and training",
      "Hosting, security, and maintenance",
    ],
    whoBlock:
      "You have an existing stack, a team that needs capacity, and multiple problems to solve over six months.",
    inquiryKey: "Modernize",
    ctaText: "Book a Discovery Call",
    ctaSub: "We will talk through the workflow and whether this is the right model.",
    termsNote:
      "Capacity is limited. Scope is set on the discovery call.",
    journeyPrev: { label: "Build", href: "/build" },
  },
];

export function getOffering(slug: string): Offering | undefined {
  return OFFERINGS.find((o) => o.slug === slug);
}
