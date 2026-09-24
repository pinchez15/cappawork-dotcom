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
    description:
      "Audits and the client relationship moved into one system. An agent runs the review. The team keeps the judgment.",
    industry: "Healthcare",
    mode: "agent",
    modeLabel: "Agent in the workflow",
  },
  {
    name: "ArborKey",
    url: "https://www.arborkeysoftware.com",
    description:
      "Association firms were running the practice across disconnected tools. The operating work now lives in one system the team actually uses.",
    industry: "Property management",
    mode: "workflow",
    modeLabel: "How the work runs",
  },
  {
    name: "Karibu Health",
    url: "https://karibu.health",
    description:
      "Clinicians speak the visit. The record is written from the conversation, so documentation stops crowding out the patient.",
    industry: "Healthcare",
    mode: "agent",
    modeLabel: "Agent in the workflow",
  },
  {
    name: "Horizon Data Partners",
    url: "https://www.horizondatapartners.com",
    description:
      "Client delivery stopped being a manual assembly job. Analysis and the work around it now move through a system built for how the firm delivers.",
    industry: "Data consulting",
    mode: "workflow",
    modeLabel: "How the work runs",
  },
]

export const FEATURED_TESTIMONIAL: PortfolioTestimonial = {
  quote:
    "Nate identified gaps in our vision and helped bring HealthcareAIO to a viable state. We highly recommend CappaWork.",
  name: "Stephen Fogg",
  title: "Founder",
  company: "Fogg Media",
  projectName: "HealthcareAIO",
  projectUrl: "https://healthcareaio.com",
}
