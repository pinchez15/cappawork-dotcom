# CappaWork Front-End Developer Skill

## Project Overview

CappaWork is an operational analytics and automation consultancy targeting founder-led service businesses doing $3M+ in annual revenue. The website serves as both a marketing site and a client portal (SaaS).

**Deployed at:** https://cappawork.com

## Ideal Customer Profile (ICP)

- **Role:** President or CEO
- **Company size:** $3M+ revenue/year (sweet spot $3M-$10M)
- **Industry:** Service-based businesses (consulting, agencies, professional services, trades, staffing)
- **Mindset:** Operationally focused, profit-margin conscious, growth-stage
- **Pain:** Scaling problems — margin compression, workflow inefficiency, software sprawl, no visibility into unit economics
- **Devices:** Desktop (primary work device) and mobile (on-the-go review, meetings, travel)

## Design Principles for ICP

### Visual Authority
- Clean, restrained design that signals competence — not flashy startup energy
- This audience runs real businesses. The site should feel like a trusted advisor, not a pitch deck
- Minimal decoration. Let content and whitespace do the work
- Professional typography hierarchy: Inter (sans) for body, Crimson Text (serif) for editorial accents

### Mobile-First, Executive-Ready
- CEOs check things between meetings on their phone. Every page must be fully functional on mobile
- Touch targets minimum 44px. No hover-dependent interactions without mobile fallbacks
- Content must be scannable — short paragraphs, clear headings, bullet points over walls of text
- CTAs visible without excessive scrolling on both desktop and mobile

### Conversion-Oriented
- Primary CTA: "Book a Diagnostic Call" (Calendly link)
- Every section should build toward the CTA. Do not add decorative sections that dilute the funnel
- Social proof and credibility markers matter to this audience — they evaluate vendors carefully
- Pricing is transparent and premium ($30K+ engagements). The design should match that price point

### Trust Signals That Matter to CEOs
- Clarity over cleverness in copy
- Specific dollar figures and outcomes over vague promises
- No stock photos of "diverse teams in meetings" — use real product screenshots or abstract visuals
- Professional, corporate-adjacent aesthetic (think McKinsey meets modern SaaS, not Y Combinator demo day)

## Tech Stack

- **Framework:** Next.js 16 (App Router) with React 19 and TypeScript
- **Styling:** Tailwind CSS 3.4 with CSS variables (HSL color system)
- **Components:** shadcn/ui (Radix UI primitives)
- **Icons:** Lucide React
- **Auth:** Clerk
- **Database:** Supabase
- **Animations:** GSAP + CSS `animate-in` classes
- **Fonts:** Inter (sans), Crimson Text (serif) via `next/font/google`
- **Deployment:** Vercel

## Code Conventions

### File Structure
```
app/
  components/       # Landing page / marketing components
  (admin)/          # Admin layout group
  (portal)/         # Client portal layout group
  api/              # API routes
components/
  ui/               # shadcn/ui primitives (do not modify directly)
  admin/            # Admin-specific components
  client/           # Client portal components
lib/                # Utilities, DB client, helpers
server/             # Server-side repos, actions, services
```

### Styling Rules
- Use Tailwind utility classes exclusively. No inline styles except for dynamic values (e.g., `perspective`, `--progress-value`)
- Color palette: `stone-50` through `stone-900` for neutrals, `blue-500`/`blue-600` for brand/primary, `green-500` for success
- Backgrounds: `bg-white` and `bg-stone-50` alternate between sections
- Max content width: `max-w-7xl` with `px-4 sm:px-6 lg:px-8` padding
- Border radius: `rounded-2xl` for cards, `rounded-full` for buttons/badges
- Buttons: `rounded-full` with `bg-blue-600 hover:bg-blue-700` for primary CTAs
- Section spacing: `py-24` standard, `py-16` for tighter sections
- Text sizes: `text-5xl md:text-7xl` for hero h1, `text-2xl sm:text-3xl` for section headings, `text-xl` for subheadings

### Component Patterns
- Marketing page components go in `app/components/`
- Use `"use client"` only when needed (event handlers, hooks, browser APIs)
- Prefer server components by default
- Calendly link sourced from `process.env.NEXT_PUBLIC_CALENDLY_LINK` with hardcoded fallback
- Icons: Import individually from `lucide-react` (e.g., `import { ArrowRight } from "lucide-react"`)
- Images: Use `next/image` with explicit `width`/`height`

### Responsive Breakpoints
- Mobile-first: base styles are mobile
- `md:` (768px) — tablet/desktop layout shifts (grid columns, font size bumps)
- `lg:` (1024px) — wider padding, larger max-widths
- `sm:` (640px) — minor padding/spacing adjustments
- Hide/show with `hidden md:block` / `md:hidden` patterns

### Accessibility
- Semantic HTML: `<section>`, `<nav>`, `<main>`, `<button>` (not div-with-onClick)
- All images require meaningful `alt` text
- Interactive elements need visible focus states
- `prefers-reduced-motion` respected for animations
- Color contrast: stone-600 on white minimum for body text, stone-900 for headings

## Key Business Context

- **Value prop:** "Your operations are the most expensive thing you're not measuring"
- **Engagement model:** Phase 1 Diagnostic ($30K, 4-6 weeks) then Phase 2 Implementation ($50K+)
- **Positioning:** Analytics-first, not code-first. Clarity before capital allocation
- **Tone:** Direct, confident, specific. No jargon, no hype. Speaks CFO language (margins, unit economics, ROI)
- **Signup model:** Invite-only for client portal (Clerk signup link hidden)

## Common Commands

```bash
npm run dev     # Local dev server
npx next build  # Production build
npx tsc         # Type check
```

## Git Workflow

- Main branch: `main`
- Single repo — no submodules
