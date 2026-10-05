export type PortfolioProject = {
  name: string
  url: string
  description: string
  industry: string
  /** How the engagement shows up in the work. */
  mode: "agent" | "workflow"
  modeLabel: string
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
    name: "HealthcareAIO",
    url: "https://healthcareaio.com",
    description: "Audits and the client relationship, in one system.",
    industry: "Healthcare",
    mode: "agent",
    modeLabel: "Agent in the workflow",
  },
  {
    name: "ArborKey",
    url: "https://www.arborkeysoftware.com",
    description: "The practice, in one system.",
    industry: "Property management",
    mode: "workflow",
    modeLabel: "How the work runs",
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
