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
    description:
      "AI optimization audit platform for healthcare practices with built-in CRM and practice workflow tooling.",
    industry: "Healthcare",
  },
  {
    name: "ArborKey",
    url: "https://www.arborkeysoftware.com",
    description:
      "Practice management software for community association management businesses.",
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
    description:
      "Custom analytics and client delivery platform for a boutique data strategy consultancy.",
    industry: "Data consulting",
  },
];

export const FEATURED_TESTIMONIAL: PortfolioTestimonial = {
  quote:
    "CappaWork was a pleasure to work with, and Nate went above and beyond to help us with a GTM strategy. When we approached CappaWork about building HealthcareAIO, we had a very specific vision. During our initial discovery session, Nate identified some gaps in this vision and helped bring our solution to a viable state, including an added built-in CRM! We plan to continue to work with Nate and CappaWork in the future and highly recommend them!",
  name: "Stephen Fogg",
  title: "Founder",
  company: "Fogg Media",
  projectName: "HealthcareAIO",
  projectUrl: "https://healthcareaio.com",
};
