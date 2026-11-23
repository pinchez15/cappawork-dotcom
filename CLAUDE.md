# CappaWork

## Project Overview

CappaWork is the embedded product team for healthcare and life sciences. This repo is both the marketing site and the internal/client tools: admin CRM and Pipeline, discovery, list builder, client portal, and SOW signing.

**Deployed at:** https://cappawork.com (Vercel)

## Key Business Context

- **Positioning:** The embedded product team for healthcare and life sciences. We turn stuck initiatives into shipped products.
- **ICP:** Healthcare and life sciences companies above ~$30M revenue (patient recruitment, agencies/medcomms, CROs and site networks, LTC/specialty pharmacy, provider groups, emerging biotech). Buyer: CEO, President, or COO with a stalled initiative.
- **Engagement model:** One-week sprints (Strategy, Product, UX, UI, Build). A full product is 5 to 6 sprints back to back. $7,500 per sprint (one focused week). Plus an embedded team retainer: $20,000 a month, anchored to an SVP of Product or AI salary, with sprints added on top. Internally scoped at about 40 hours a month, but **never publish hours**: pricing is on output, not time. Think and write in weeks of work and outputs.
- **Primary CTA:** "Book a Strategy Sprint" (scrolls to the `#discovery` form on the homepage, which posts to `/api/service-inquiry`). Use this label for every primary CTA.
- **Philosophy:** AI for speed, scale, and capability; never for truth, joy, or relationships. Groundwork (AI runs it) / Teamwork (AI drafts, a qualified person decides) / Lifework (never AI).
- **Guardrails:** Never use the FDA logo. No invented statistics. Founder experience is career history, not a client list.
- **Tone:** Direct, confident, specific. No jargon, no hype.
- **Signup model:** Invite-only for client portal (Clerk signup link hidden)

Retired offers (do not build on or link to): the $3M+ service-business ICP, "Book a Diagnostic Call", the profit calculator, the Profit Leak Scorecard, the AI cohorts, and the $30K+ engagement pricing. Some of their pages still exist pending removal; treat them as legacy.

## Design System (navy/gold editorial)

- **Colors:** navy `#0A0F1C` (dark sections), warm-white `#FAFAF8` and card-light `#F5F4F0` (light sections), gold `#D4A853` (accent and buttons), card-dark `#12172A` (cards on navy), card-border `#E5E2DB`. Stone scale for body text. Do not use blue-600, green, or plain stone palettes on marketing pages.
- **Fonts:** Instrument Serif for headings (`font-display`, `--font-display`), DM Sans for body (`font-body`, `--font-body`), loaded via `next/font/google`.
- **Headings:** `font-display tracking-tight`. Eyebrows, when used: `text-gold uppercase tracking-widest text-sm font-semibold`. Not every section needs an eyebrow.
- **Buttons:** gold pill, `bg-gold text-navy rounded-full hover:bg-gold/90`.
- **Body text:** `text-stone-600` on light, `text-white/70` on navy.
- **Cards:** `rounded-2xl border-card-border bg-warm-white` (light) / `bg-card-dark border-white/10` (dark).
- **Sections:** alternate navy and light, `py-24`; `max-w-7xl` (or `max-w-3xl` for prose) with `px-4 sm:px-6 lg:px-8`.
- **Craft benchmark:** the redesign borrows type scale, content placement, and motion discipline from spectrumscience.com while keeping this brand. Teardown: https://claude.ai/artifact/JKRaSVZgQAoW1qXM9KhTQf. Aim for large jumps between type tiers, few homepage sections with one job each, and one consistent motion timing. Avoid the AI-template look: eyebrow + heading + card grid on every section, icon-in-a-circle cards, gradient blobs.

### Executive-ready on desktop and mobile
- Buyers read on desktop and between meetings on their phone. Every page must work on mobile.
- Touch targets at least 44px. No hover-only interactions.
- Short paragraphs, clear headings. The CTA is reachable without excessive scrolling.
- Specific outcomes over vague promises. No stock photos of teams in meetings; use real product screenshots or abstract visuals.

## Tech Stack

- **Framework:** Next.js 16 (App Router) with React 19 and TypeScript
- **Styling:** Tailwind CSS 3.4 with CSS variables (HSL color system)
- **Components:** shadcn/ui (Radix UI primitives)
- **Icons:** Lucide React
- **Auth:** Clerk
- **Database:** Supabase
- **Background jobs:** Inngest
- **Animations:** GSAP + CSS `animate-in` classes (framer-motion only in `motion-wrapper.tsx`)
- **Package manager:** pnpm (`pnpm-lock.yaml` is the only lockfile; do not use npm)
- **Deployment:** Vercel

## Code Conventions

### File Structure
```
app/
  components/       # Landing page / marketing components
  (admin)/          # Admin: CRM, Pipeline, discovery, list builder, projects
  (portal)/         # Client portal
  api/              # API routes (webhooks and /.well-known are called externally)
components/
  ui/               # shadcn/ui primitives (do not modify directly)
  admin/            # Admin-specific components
  client/           # Client portal components
lib/                # Utilities, DB client, helpers
server/             # Server-side repos, actions, services
```

### Styling Rules
- Use Tailwind utility classes. No inline styles except for dynamic values (e.g., `perspective`, `--progress-value`).
- Use the design-system tokens above, not raw hex values.

### Component Patterns
- Marketing page components go in `app/components/`
- Use `"use client"` only when needed (event handlers, hooks, browser APIs)
- Prefer server components by default
- Icons: import individually from `lucide-react` (e.g., `import { ArrowRight } from "lucide-react"`)
- Images: use `next/image` with explicit `width`/`height`

### Responsive Breakpoints
- Mobile-first: base styles are mobile
- `sm:` (640px) minor spacing, `md:` (768px) layout shifts, `lg:` (1024px) wider padding and max-widths

### Accessibility
- Semantic HTML: `<section>`, `<nav>`, `<main>`, `<button>` (not div-with-onClick)
- All images require meaningful `alt` text
- Interactive elements need visible focus states
- Respect `prefers-reduced-motion` for all animation

## Common Commands

```bash
pnpm dev          # Local dev server (port 3011)
pnpm build        # Production build
pnpm exec tsc --noEmit   # Type check
```

## Git Workflow

- Main branch: `main`
- Single repo, no submodules
