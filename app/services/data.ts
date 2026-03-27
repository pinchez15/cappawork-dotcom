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

export type Service = {
  slug: string;
  title: string;
  subtitle: string;
  price: string;
  priceNote: string;
  cardDescription: string;
  ctaText: string;
  ctaSub: string;
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
  {
    slug: "ai-reskilling-cohort",
    title: "AI Re-skilling Cohort",
    subtitle:
      'Four weeks. Small group. Go from "I\'ve heard of it" to "I know exactly what to use, when, and why."',
    price: "$3,500",
    priceNote: "per person \u00b7 4 sessions \u00b7 10\u201315 per cohort",
    cardDescription:
      "Four-week small-group program for mid-career leaders. Go from AI-curious to AI-fluent with hands-on training calibrated to your role.",
    ctaText: "Apply for the Next Cohort",
    ctaSub:
      "Cohorts run with 10\u201315 people. Apply and we\u2019ll confirm your spot.",
    howItWorks: [
      {
        label: "Before we start,",
        text: "you take a short survey rating your familiarity with 10+ AI tools and concepts \u2014 from Claude to code generation to video GPUs. Scale of 1 to 5. This calibrates the curriculum to the room so nobody\u2019s bored and nobody\u2019s lost.",
      },
      {
        label: "Four weekly sessions,",
        text: "one hour of structured curriculum plus open Q&A that runs until every question is answered. All sessions recorded.",
      },
      {
        label: "You leave with",
        text: "a custom AI toolkit built for your specific role \u2014 not generic advice, but the exact tools, workflows, and approaches that matter for what you actually do.",
      },
    ],
    whatWeCover: [
      {
        label: "",
        text: "The real differences between models \u2014 Claude vs. ChatGPT vs. Gemini, and when each one wins",
      },
      {
        label: "",
        text: "Developer tools vs. business tools \u2014 Claude Code, Cursor, and what you can build without writing code",
      },
      {
        label: "",
        text: "Deep research, agents, and automation \u2014 what\u2019s real, what\u2019s hype, and what you can use today",
      },
      {
        label: "",
        text: "How to think about AI in your work \u2014 not just the tools, but the judgment layer on top",
      },
    ],
    whoBlock:
      'You\u2019re mid-career \u2014 director, VP, CXO \u2014 and you know AI is reshaping your industry, but you\u2019re not sure what\u2019s real and what\u2019s noise. You want to learn from someone who builds with these tools every day, in a small group where you can ask the questions you wouldn\u2019t ask in a company all-hands. No judgment. No selling. Just clarity.',
    aboutNate:
      "Founder of CappaWork. MBA, four years in management consulting, C-suite strategy work up to $2B+. Full-stack AI product builder \u2014 not a theorist. Helped a founder go from $1.5M revenue / $45K profit to $1.8M / $225K profit in one year.",
    termsNote:
      "When you enroll, you are holding a spot that another professional could fill.",
  },
  {
    slug: "ai-strategy-advisory",
    title: "AI Strategy Advisory",
    subtitle:
      "Your products work. Your users are real. Now you need AI integrated the right way \u2014 without breaking what\u2019s already working.",
    price: "$4,000",
    priceNote: "half-day engagement \u00b7 written deliverable",
    cardDescription:
      "Half-day deep dive into your products, team, and constraints. You get a written strategy memo with specific AI recommendations your leadership team can act on immediately.",
    ctaText: "Schedule Your Advisory Session",
    ctaSub:
      "We\u2019ll align on scope before the session so the half day is focused.",
    howItWorks: [
      {
        label: "We go deep for half a day",
        text: "\u2014 your products, your team, your users, your constraints. I come in with questions. You come in with the problem, or I find it.",
      },
      {
        label: "Two lenses, one session.",
        text: "Strategy: where does AI create the most value across your product set, and how do you sequence the rollout? Tactical: which models, what architecture, how do you tune outputs, and where do you avoid wasting tokens on things that won\u2019t work.",
      },
      {
        label: "You get a written strategy memo",
        text: "\u2014 specific recommendations you can circulate to your leadership team and act on immediately.",
      },
    ],
    callout: {
      title: "The change management problem nobody talks about.",
      paragraphs: [
        "AI adoption isn\u2019t like previous technology changes. You\u2019re not replacing a workflow \u2014 you\u2019re replacing what feels like the person. That triggers a much stronger resistance than a new CRM or a new dashboard ever did.",
        "If you try to change the workflow before you solidify the person in their role, the rollout fails. My approach addresses both sides: the human layer and the technical layer.",
      ],
    },
    whoBlock:
      'You lead strategy or product at a company with established products and a real user base. You\u2019ve been asked to "figure out the AI thing" or you\u2019re already in flight with AI features that aren\u2019t landing the way you expected. You need someone who\u2019s built AI products \u2014 not just advised on them \u2014 to sit across from you for half a day and give you a real plan.',
    aboutNate:
      "Founder of CappaWork. MBA, four years in management consulting, C-suite strategy work up to $2B+. Full-stack AI product builder \u2014 not a theorist. Helped a founder go from $1.5M revenue / $45K profit to $1.8M / $225K profit in one year.",
    termsNote:
      "When you book, you are holding a spot that another leader could fill.",
  },
  {
    slug: "org-ai-training",
    title: "Organizational AI Training",
    subtitle:
      "Get your entire team to the same baseline in a single session. Stop watching half your org excel at AI while the other half falls behind.",
    price: "$5,000\u2013$10,000",
    priceNote: "single session \u00b7 10\u201325 people \u00b7 scoped to your org",
    cardDescription:
      "Half-day or full-day hands-on training for 10\u201325 people. Your team leaves with specific action items and a shared AI baseline \u2014 not another lecture.",
    ctaText: "Book a Scoping Call",
    ctaSub:
      "We\u2019ll size the session to your team and align on content before the day.",
    howItWorks: [
      {
        label: "One session, half-day or full-day,",
        text: "with 10\u201325 people from your organization. Everyone in the same room, learning the same things at the same time.",
      },
      {
        label: "Hands-on, not lecture.",
        text: "I teach your team how to think about AI in their actual work \u2014 not abstract use cases, but the specific workflows and tools that apply to what they do every day.",
      },
      {
        label: "Every participant leaves with a specific action",
        text: "\u2014 something they do in the week after the session that locks in the learning and starts building the habit.",
      },
      {
        label: "The real value:",
        text: "your team implements together. They help each other. The person who \u201cgets it\u201d becomes a resource for the person who\u2019s still figuring it out. Adoption compounds when it\u2019s shared.",
      },
    ],
    frameworkBlock: {
      label: "The learning framework",
      steps: [
        {
          label: "See one.",
          text: "I demonstrate exactly how AI applies to a workflow your team recognizes \u2014 no toy examples, no generic demos.",
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
      "You\u2019re the CEO, VP, or department head who\u2019s been pushing AI adoption and it\u2019s landing unevenly. A few people on your team are flying with it. Others aren\u2019t touching it. You\u2019ve tried sharing articles and encouraging experimentation, but what you actually need is someone to come in, train everyone at once, and give them a reason to start using it together \u2014 this week.",
    aboutNate:
      "Founder of CappaWork. MBA, four years in management consulting, C-suite strategy work up to $2B+. Full-stack AI product builder \u2014 not a theorist. Helped a founder go from $1.5M revenue / $45K profit to $1.8M / $225K profit in one year.",
    termsNote:
      "When you book, you are holding a spot that another organization could fill.",
  },
  {
    slug: "dev-team-workshop",
    title: "Dev Team Workshop",
    subtitle:
      "Everything your engineering team believes about process was built for a world where code was expensive to write and slow to fix. That world is over.",
    price: "$5,000\u2013$10,000",
    priceNote: "workshop \u00b7 mid-market engineering teams",
    cardDescription:
      "Live demonstration of AI-assisted development at production speed. Your engineering team sees firsthand what\u2019s possible when process catches up to tooling.",
    ctaText: "Book a Scoping Call",
    ctaSub:
      "We\u2019ll align on your team\u2019s current workflow and what they need to see.",
    howItWorks: [
      {
        label: "I show your team how I actually build.",
        text: "Not slides about AI-assisted development. A live demonstration of the workflow that lets me ship production-grade AI products at a pace your team won\u2019t believe until they see it.",
      },
      {
        label: "We talk about what\u2019s changed",
        text: "\u2014 not in theory, but in practice. The cost of tokens and the speed of AI-assisted development have fundamentally altered the calculus on traditional safeguards. You can fix faster than you can break.",
      },
      {
        label: "Your team leaves",
        text: "understanding not just the tools, but the mindset shift required to move at the speed AI now makes possible.",
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
      title: "This isn\u2019t recklessness. It\u2019s a different calculus.",
      paragraphs: [
        "When AI can generate, test, and fix code faster than traditional review cycles can approve it, the overhead of those cycles becomes the bottleneck \u2014 not the protection. The question isn\u2019t whether this is safe. The question is whether your team can afford to keep moving at the old speed while your competitors figure this out.",
      ],
    },
    whoBlock:
      "You\u2019re a VP of Engineering or CTO at a mid-market company with 10\u201330 developers, and you suspect your team is moving slower than the tools now allow. You\u2019ve seen individual developers 10x their output with AI, but your team processes \u2014 code reviews, branching strategies, deployment pipelines \u2014 haven\u2019t caught up. You want someone who lives on the bleeding edge to show your team what\u2019s actually possible.",
    aboutNate:
      "Founder of CappaWork. MBA, four years in management consulting, C-suite strategy work up to $2B+. Full-stack AI product builder shipping production products daily with the workflow described above. Not a theorist \u2014 a practitioner who builds this way every single day.",
    termsNote:
      "When you book, you are holding a spot that another team could fill.",
  },
  {
    slug: "full-build",
    title: "Full Build",
    subtitle:
      "You know what you need. You don\u2019t have the team to build it. I do this every day \u2014 strategy through shipping \u2014 and the product is in your hands in 12\u201316 weeks.",
    price: "$50,000\u2013$100,000",
    priceNote: "custom AI product build \u00b7 12\u201316 weeks",
    cardDescription:
      "End-to-end custom AI product build. Strategy through architecture through shipping. Production-deployed and ready for your users in 12\u201316 weeks.",
    ctaText: "Start a Conversation",
    ctaSub:
      "Builds are scoped on a discovery call before any commitment.",
    howItWorks: [
      {
        label: "We scope it together.",
        text: "I work with you to define exactly what gets built, what order it ships in, and what success looks like. Strategy, architecture, and product decisions \u2014 not just code.",
      },
      {
        label: "I build it.",
        text: "Full-stack: Next.js, Supabase, Clerk, Vercel. AI agents, client portals, CRMs, research engines, automation systems \u2014 whatever the product requires. You see working software every week.",
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
          text: "Advisor CRM, client portal, research engine with AI-powered EPS revision signal monitoring \u2014 built for a firm managing $21M in AUM",
        },
      ],
    },
    whoBlock:
      "You\u2019re a founder or executive who needs a custom AI product built \u2014 not an off-the-shelf tool configured, but a real product designed for your specific business, your users, and your workflows. You need someone who understands both the business strategy and the technical build, and can own the entire process from first conversation to production deployment.",
    aboutNate:
      "Founder of CappaWork. MBA, four years in management consulting, C-suite strategy work up to $2B+. Full-stack AI product builder shipping production products for clients across wealth management, healthcare, recruiting, and professional services. Helped a founder go from $1.5M revenue / $45K profit to $1.8M / $225K profit in one year.",
    termsNote:
      "When you commit to a build, you are reserving dedicated capacity.",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
