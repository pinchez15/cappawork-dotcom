export type PortfolioProject = {
  name: string;
  url: string;
  description: string;
  industry: string;
};

export type PortfolioTestimonial = {
  quote: string;
  name: string;
  title: string;
  company: string;
  projectName: string;
  projectUrl: string;
};

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    name: "HealthcareAIO",
    url: "https://healthcareaio.com",
    description: "AI audit platform with CRM for healthcare practices.",
    industry: "Healthcare",
  },
  {
    name: "ArborKey",
    url: "https://www.arborkeysoftware.com",
    description: "Practice management for community association firms.",
    industry: "Property management",
  },
  {
    name: "Karibu Health",
    url: "https://karibu.health",
    description:
      "Voice-first clinical documentation for rural clinics in Uganda.",
    industry: "Healthcare",
  },
  {
    name: "Horizon Data Partners",
    url: "https://www.horizondatapartners.com",
    description: "Analytics and client delivery for a data consultancy.",
    industry: "Data consulting",
  },
];

export const FEATURED_TESTIMONIAL: PortfolioTestimonial = {
  quote:
    "Nate identified gaps in our vision and helped bring HealthcareAIO to a viable state. We highly recommend CappaWork.",
  name: "Stephen Fogg",
  title: "Founder",
  company: "Fogg Media",
  projectName: "HealthcareAIO",
  projectUrl: "https://healthcareaio.com",
};
