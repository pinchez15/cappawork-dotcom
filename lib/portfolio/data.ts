export type PortfolioProject = {
  name: string
  /** Omit for confidential work; the card renders without a link. */
  url?: string
  description: string
  industry: string
  /** How the engagement shows up in the work. */
  mode: "agent" | "workflow"
  modeLabel: string
  /** Before → after result, shown in gold. Only numbers the client would confirm. */
  metric?: string
  /** ISO timestamp; the project stays hidden on the site until then. */
  publishAfter?: string
}

export type PortfolioTestimonial = {
  quote: string
  name: string
  title: string
  company: string
  projectName: string
  projectUrl: string
}

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    name: "Enterprise trial and communications platform",
    metric: "8 months stalled → working executive demo in 21 days",
    description:
      "Embedded with leadership at a $50M+ life sciences agency to restart a stalled platform initiative. A live demo in front of leadership in three weeks, then production modules shipped into their enterprise stack.",
    industry: "Life sciences · Client confidential",
    mode: "workflow",
    modeLabel: "Embedded product team",
    // Hidden until the client engagement can be referenced publicly.
    publishAfter: "2026-12-20T00:00:00-05:00",
  },
  {
    name: "Karibu Health",
    url: "https://karibu.health",
    description: "The visit is spoken. The record is written.",
    industry: "Healthcare",
    mode: "agent",
    modeLabel: "Agent in the workflow",
  },
  {
    name: "HealthcareAIO",
    url: "https://healthcareaio.com",
    description: "Audits and the client relationship, in one system.",
    industry: "Healthcare",
    mode: "agent",
    modeLabel: "Agent in the workflow",
  },
  {
    name: "Horizon Data Partners",
    url: "https://www.horizondatapartners.com",
    description: "Delivery stopped being a manual assembly job.",
    industry: "Data consulting",
    mode: "workflow",
    modeLabel: "How the work runs",
  },
]

export const FEATURED_TESTIMONIAL: PortfolioTestimonial = {
  quote:
    "CappaWork identified gaps in our vision and helped bring HealthcareAIO to a viable state. We highly recommend them.",
  name: "Stephen Fogg",
  title: "Founder",
  company: "Fogg Media",
  projectName: "HealthcareAIO",
  projectUrl: "https://healthcareaio.com",
}

/** Projects that are live on the site right now (respects publishAfter). */
export function visibleProjects(now: Date = new Date()): PortfolioProject[] {
  return PORTFOLIO_PROJECTS.filter(
    (project) => !project.publishAfter || now >= new Date(project.publishAfter)
  )
}
