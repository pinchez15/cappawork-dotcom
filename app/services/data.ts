export type ServiceDetail = {
  label: string;
  text: string;
};

export type ServiceCallout = {
  title: string;
  paragraphs: string[];
};

export type ServiceProofItem = {
  stat?: string;
  text: string;
};

export type ServiceFrameworkStep = {
  label: string;
  text: string;
};

export type ServiceProvocationItem = {
  number: string;
  text: string;
};

export type ServiceSection = "coaching" | "audit-build" | "training";

export type Service = {
  slug: string;
  title: string;
  subtitle: string;
  price: string;
  priceNote: string;
  cardDescription: string;
  ctaText: string;
  ctaSub: string;
  section: ServiceSection;
  howItWorks: ServiceDetail[];
  whatWeCover?: ServiceDetail[];
  whoBlock: string;
  aboutNate: string;
  termsNote: string;
  callout?: ServiceCallout;
  proofBlock?: { label: string; items: ServiceProofItem[] };
  frameworkBlock?: { label: string; steps: ServiceFrameworkStep[] };
  provocationBlock?: { label: string; items: ServiceProvocationItem[] };
};

export const SERVICES: Service[] = [
  // ─── SECTION 1: COACHING ───
  {
    slug: "executive-ai-advisor",
    title: "Executive AI Advisor",
    subtitle:
      "A retained advisor in your corner — behind an NDA, embedded with your leadership team, looking for what you can't see.",
    price: "$4,000/hour",
    priceNote: "retained · C-suite · under NDA",
    section: "coaching",
    cardDescription:
      "A retained advisor in your corner — behind an NDA, embedded with your leadership team, looking for what you can't see. You get someone who builds AI products full-time and has spent a career in business strategy, with no incentive other than making you right. Typical engagement: 3–6 months.",
    ctaText: "Start a Conversation",
    ctaSub:
      "We'll discuss your situation and whether this is the right fit.",
    howItWorks: [
      {
        label: "Embedded, not external.",
        text: "I work under NDA as part of your leadership team — not as an outside consultant giving advice from a distance. I see what you see, and I look for what you can't.",
      },
      {
        label: "Strategy meets execution.",
        text: "MBA, four years in management consulting, C-suite strategy work up to $2B+ companies — combined with hands-on AI product building every day. Not theory. Practice.",
      },
      {
        label: "Typical engagement: 3–6 months.",
        text: "Long enough to see around corners. Short enough to stay focused. You get an advisor whose only job is to be honest, informed, and looking out for your business.",
      },
    ],
    whoBlock:
      "You're a CEO or founder making high-stakes decisions about AI — where to invest, what to build, how to position your company. You need someone who builds AI products full-time and has real business strategy experience, not a vendor trying to sell you something. You want objectivity, deep fluency, and someone who will tell you the truth.",
    aboutNate:
      "Founder of CappaWork. MBA, four years in management consulting, C-suite strategy work up to $2B+. Full-stack AI product builder — not a theorist. Helped a founder go from $1.5M revenue / $45K profit to $1.8M / $225K profit in one year.",
    termsNote:
      "Advisory engagements are scoped individually based on your needs.",
  },
  {
    slug: "ai-literacy-cohort",
    title: "AI Literacy Cohort",
    subtitle:
      "Six weeks. Small group. For leaders who don't build but need to understand what's being built.",
    price: "$3,500",
    priceNote: "per person · 6 weeks · 10–15 per cohort",
    section: "coaching",
    cardDescription:
      "Six-week small-group program for leaders who don't build but need to understand what's being built. You'll learn what the models actually are, how they differ, what tools like Claude Code do, what's safe and what's not, and how to evaluate AI investments your team is making — so you stop nodding along in meetings and start making informed decisions.",
    ctaText: "Apply for the Next Cohort",
    ctaSub:
      "Cohorts run with 10–15 people. Apply and we'll confirm your spot.",
    howItWorks: [
      {
        label: "Before we start,",
        text: "you take a short survey rating your familiarity with AI tools and concepts. This calibrates the curriculum to the room so nobody's bored and nobody's lost.",
      },
      {
        label: "Six weekly sessions,",
        text: "structured curriculum plus open Q&A that runs until every question is answered. All sessions recorded.",
      },
      {
        label: "You leave with",
        text: "the fluency to evaluate AI investments, ask the right questions, and make informed decisions — not the ability to code, but the judgment to lead.",
      },
    ],
    whatWeCover: [
      {
        label: "",
        text: "What the models actually are — Claude, ChatGPT, Gemini — and how they differ",
      },
      {
        label: "",
        text: "What tools like Claude Code and Cursor do, and what you can build without writing code",
      },
      {
        label: "",
        text: "What's safe and what's not — data privacy, security, and where the real risks are",
      },
      {
        label: "",
        text: "How to evaluate AI investments your team is making — so you stop nodding along and start leading",
      },
    ],
    whoBlock:
      "You're a leader who doesn't build but needs to understand what's being built. You know AI is reshaping your industry, but you're not sure what's real and what's noise. You want to learn from someone who builds with these tools every day, in a small group where you can ask the questions you wouldn't ask in a company all-hands.",
    aboutNate:
      "Founder of CappaWork. MBA, four years in management consulting, C-suite strategy work up to $2B+. Full-stack AI product builder — not a theorist. Helped a founder go from $1.5M revenue / $45K profit to $1.8M / $225K profit in one year.",
    termsNote:
      "When you enroll, you are holding a spot that another professional could fill.",
  },

  // ─── SECTION 2: AUDIT & BUILD ───
  {
    slug: "ai-audit-diagnosis",
    title: "AI Audit & Diagnosis",
    subtitle:
      "Full audit of your workflows, team, and technology. You get a written diagnosis with exactly what to change, what to build, and the expected profit impact.",
    price: "Starting at $30,000",
    priceNote: "1–2 week engagement · written deliverable",
    section: "audit-build",
    cardDescription:
      "Full audit of your workflows, team, and technology. You get a written diagnosis with exactly what to change, what to build, and the expected profit impact — with enough detail that your team can act on it independently. You don't have to build with us, but you can.",
    ctaText: "Schedule Your Audit",
    ctaSub:
      "We'll align on scope before the engagement so the audit is focused.",
    howItWorks: [
      {
        label: "We go deep for 1–2 weeks",
        text: "— your workflows, your team, your technology, your constraints. I watch how work actually flows through your business.",
      },
      {
        label: "You get a written diagnosis",
        text: "— exactly what to change, what to build, and the expected profit impact. Specific enough that your team can act on it independently.",
      },
      {
        label: "You don't have to build with us.",
        text: "The diagnosis stands alone. Execute internally, bring us in for The Build, or hire someone else. Our job is clarity before capital allocation.",
      },
    ],
    callout: {
      title: "This is not a half-day strategy session.",
      paragraphs: [
        "This is a full operational audit — watching workflows, analyzing data, quantifying where profit leaks. The deliverable is specific: exactly what to build, in what order, with expected ROI.",
        "You don't have to build with us, but you can.",
      ],
    },
    whoBlock:
      "You're a founder or executive at a $5–10M service business. You know AI should be changing how you operate, but you're not sure where to start or what's actually worth building. You need someone who understands operations and can build the systems to fix them — to give you a clear diagnosis before you spend capital.",
    aboutNate:
      "Founder of CappaWork. MBA, four years in management consulting, C-suite strategy work up to $2B+. Full-stack AI product builder — not a theorist. Helped a founder go from $1.5M revenue / $45K profit to $1.8M / $225K profit in one year.",
    termsNote:
      "When you book, you are holding a spot that another business could fill.",
  },
  {
    slug: "the-build",
    title: "The Build",
    subtitle:
      "End-to-end custom AI product build. From architecture through shipping — production-deployed and ready for your users.",
    price: "Starting at $50,000",
    priceNote: "custom AI product build · 12–16 weeks",
    section: "audit-build",
    cardDescription:
      "End-to-end custom AI product build. From architecture through shipping — production-deployed and ready for your users. Typically follows an Audit & Diagnosis, so we're building exactly the right thing from day one.",
    ctaText: "Start a Conversation",
    ctaSub:
      "Builds are scoped on a discovery call before any commitment.",
    howItWorks: [
      {
        label: "We scope it together.",
        text: "I work with you to define exactly what gets built, what order it ships in, and what success looks like. Strategy, architecture, and product decisions — not just code.",
      },
      {
        label: "I build it.",
        text: "Full-stack: Next.js, Supabase, Clerk, Vercel. AI agents, client portals, CRMs, research engines, automation systems — whatever the product requires. You see working software every week.",
      },
      {
        label: "You own it.",
        text: "Production-deployed, fully functional, ready for your users. Not a prototype. Not a demo. A real product.",
      },
    ],
    proofBlock: {
      label: "Recent build",
      items: [
        {
          text: "SEC-compliant CRM + AI research engine for a wealth management firm",
        },
        {
          stat: "$85,000",
          text: "Full engagement value",
        },
        {
          stat: "16 weeks",
          text: "From scoping to production deployment",
        },
        {
          stat: "Complete platform",
          text: "Advisor CRM, client portal, research engine with AI-powered EPS revision signal monitoring — built for a firm managing $21M in AUM",
        },
      ],
    },
    whoBlock:
      "You're a founder or executive who needs a custom AI product built — not an off-the-shelf tool configured, but a real product designed for your specific business, your users, and your workflows. Ideally, you've done an Audit & Diagnosis first, so we're building exactly the right thing from day one.",
    aboutNate:
      "Founder of CappaWork. MBA, four years in management consulting, C-suite strategy work up to $2B+. Full-stack AI product builder shipping production products for clients across wealth management, healthcare, recruiting, and professional services. Helped a founder go from $1.5M revenue / $45K profit to $1.8M / $225K profit in one year.",
    termsNote:
      "When you commit to a build, you are reserving dedicated capacity.",
  },

  // ─── SECTION 3: TRAINING ───
  {
    slug: "internal-ai-training",
    title: "Internal AI Training",
    subtitle:
      "Three sessions over six weeks, designed around your team's actual codebase and development environment.",
    price: "Starting at $5,000",
    priceNote: "3 sessions · 6 weeks · scoped to your team and codebase",
    section: "training",
    cardDescription:
      "Three sessions over six weeks, designed around your team's actual codebase and development environment. Your engineering team learns AI-assisted development by applying it to the work they're already doing — not a generic lecture with toy examples.",
    ctaText: "Book a Scoping Call",
    ctaSub:
      "We'll size the engagement to your team and align on content before we start.",
    howItWorks: [
      {
        label: "Three sessions over six weeks,",
        text: "designed around your team's actual codebase and development environment. Not generic examples — your real work.",
      },
      {
        label: "Hands-on, not lecture.",
        text: "Your team learns AI-assisted development by applying it to the work they're already doing. They leave each session with something they built.",
      },
      {
        label: "Adoption compounds",
        text: "when it's shared. Your team implements together, helps each other, and builds the habits that make AI-assisted development stick.",
      },
    ],
    frameworkBlock: {
      label: "The learning framework",
      steps: [
        {
          label: "See one.",
          text: "I demonstrate exactly how AI applies to a workflow your team recognizes — no toy examples, no generic demos.",
        },
        {
          label: "Do one.",
          text: "Your team applies it in the session. Real work, real tools, real results before they leave the room.",
        },
        {
          label: "Teach one.",
          text: "Each person gets an assignment to show a colleague what they learned. Teaching solidifies understanding and spreads adoption organically.",
        },
      ],
    },
    whoBlock:
      "You're a head of engineering or CTO who wants your team to adopt AI-assisted development — not through generic training, but by applying it to your actual codebase. You want someone to come in, work in your environment, and train your team on the workflows that matter for your specific work.",
    aboutNate:
      "Founder of CappaWork. MBA, four years in management consulting, C-suite strategy work up to $2B+. Full-stack AI product builder — not a theorist. Helped a founder go from $1.5M revenue / $45K profit to $1.8M / $225K profit in one year.",
    termsNote:
      "When you book, you are holding a spot that another team could fill.",
  },
  {
    slug: "ai-development-workshop",
    title: "AI Development Workshop",
    subtitle:
      "Live demonstration of AI-assisted development at production speed, using your team's real problems.",
    price: "Starting at $5,000",
    priceNote: "live build session · your team watches and learns",
    section: "training",
    cardDescription:
      "Live demonstration of AI-assisted development at production speed, using your team's real problems. Your engineering leaders see firsthand how an experienced AI developer approaches architecture, prompting, and shipping — then we debrief on what to adopt and what to skip.",
    ctaText: "Book a Scoping Call",
    ctaSub:
      "We'll align on your team's current workflow and what they need to see.",
    howItWorks: [
      {
        label: "I show your team how I actually build.",
        text: "Not slides about AI-assisted development. A live demonstration of the workflow that lets me ship production-grade AI products at a pace your team won't believe until they see it.",
      },
      {
        label: "Using your real problems.",
        text: "We pick something from your actual work — a feature, a bug, a system — and I build or fix it live, narrating my process the entire time.",
      },
      {
        label: "Then we debrief.",
        text: "What to adopt. What to skip. How this applies to your team's specific context. Your leaders leave understanding not just the tools, but the mindset shift required.",
      },
    ],
    provocationBlock: {
      label: "How I build every day",
      items: [
        { number: "01", text: "Push directly to main. Every time." },
        { number: "02", text: "Straight to production. No staging." },
        { number: "03", text: "No local development environment." },
        { number: "04", text: "No branches." },
        { number: "05", text: "No pull requests." },
      ],
    },
    callout: {
      title: "This isn't recklessness. It's a different calculus.",
      paragraphs: [
        "When AI can generate, test, and fix code faster than traditional review cycles can approve it, the overhead of those cycles becomes the bottleneck — not the protection. The question isn't whether this is safe. The question is whether your team can afford to keep moving at the old speed while your competitors figure this out.",
      ],
    },
    whoBlock:
      "You're a VP of Engineering or CTO who wants your team to see what's possible with AI-assisted development — not through slides, but by watching someone who does this every day. You want a second set of eyes, a live demonstration, and an honest debrief on what makes sense for your team.",
    aboutNate:
      "Founder of CappaWork. MBA, four years in management consulting, C-suite strategy work up to $2B+. Full-stack AI product builder shipping production products daily with the workflow described above. Not a theorist — a practitioner who builds this way every single day.",
    termsNote:
      "When you book, you are holding a spot that another team could fill.",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
