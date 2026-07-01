import type { ListSearchCriteria } from "@/lib/validators/list-builder";

export type IcpTemplate = {
  id: string;
  name: string;
  description: string;
  vertical_hint: string;
  recommended_offer: string;
  proof_projects: string[];
  criteria: ListSearchCriteria;
};

export const ICP_TEMPLATES: IcpTemplate[] = [
  {
    id: "healthcare-services",
    name: "Healthcare Services — Founder-Led",
    description:
      "Founder-led healthcare services businesses with operational complexity and admin burden.",
    vertical_hint: "Healthcare",
    recommended_offer: "Free Computer Work Audit → Discover Sprint",
    proof_projects: ["HealthcareAIO", "Karibu Health"],
    criteria: {
      industries: [
        "healthcare",
        "health care",
        "medical practice",
        "clinic",
        "therapy",
        "home health",
        "urgent care",
        "specialty care",
      ],
      geographies: [],
      employee_min: 10,
      employee_max: 250,
      company_keywords: ["practice", "clinic", "health", "medical", "care"],
      excluded_keywords: ["hospital", "pharma", "insurance"],
      technologies: [],
      job_titles: [
        "founder",
        "ceo",
        "coo",
        "operations director",
        "practice administrator",
        "owner",
      ],
      seniority_levels: ["owner", "c_suite", "vp", "director"],
      departments: ["operations", "executive"],
      website_keywords: ["patient intake", "scheduling", "appointment"],
      signals_required: ["hiring_admin", "new_location", "scheduling_pain"],
      signals_excluded: [],
      case_study_match: "HealthcareAIO",
      max_records: 100,
      enrichment_depth: "standard",
    },
  },
  {
    id: "property-management",
    name: "Property / Community Management",
    description:
      "Property and HOA management firms with vendor coordination and owner communication complexity.",
    vertical_hint: "Property Management",
    recommended_offer: "Free Computer Work Audit → Discover Sprint → Build",
    proof_projects: ["ArborKey"],
    criteria: {
      industries: [
        "property management",
        "real estate",
        "community association",
        "hoa",
      ],
      geographies: [],
      employee_min: 10,
      employee_max: 200,
      company_keywords: [
        "property management",
        "hoa",
        "community association",
        "condo",
        "homeowners",
      ],
      excluded_keywords: ["brokerage", "residential sales"],
      technologies: [],
      job_titles: [
        "founder",
        "ceo",
        "coo",
        "operations manager",
        "portfolio manager",
        "president",
      ],
      seniority_levels: ["owner", "c_suite", "vp", "director"],
      departments: ["operations", "executive"],
      website_keywords: ["vendor", "owner portal", "maintenance"],
      signals_required: ["new_community", "vendor_coordination"],
      signals_excluded: [],
      case_study_match: "ArborKey",
      max_records: 100,
      enrichment_depth: "standard",
    },
  },
  {
    id: "wealth-financial",
    name: "Wealth / Financial Advisory",
    description:
      "RIAs and wealth management firms with compliance, research, and client reporting workflows.",
    vertical_hint: "Wealth Management",
    recommended_offer: "Discover Deep → Build → Modernize",
    proof_projects: ["Wealth management CRM"],
    criteria: {
      industries: [
        "financial services",
        "wealth management",
        "financial advisory",
        "investment management",
      ],
      geographies: [],
      employee_min: 5,
      employee_max: 150,
      company_keywords: ["wealth", "advisory", "ria", "financial planning"],
      excluded_keywords: ["bank", "insurance"],
      technologies: [],
      job_titles: [
        "founder",
        "managing partner",
        "coo",
        "operations",
        "compliance",
        "ceo",
      ],
      seniority_levels: ["owner", "c_suite", "partner"],
      departments: ["operations", "compliance", "executive"],
      website_keywords: ["compliance", "client reporting", "portfolio"],
      signals_required: ["compliance_burden", "research_workflow"],
      signals_excluded: [],
      case_study_match: "Wealth management",
      max_records: 75,
      enrichment_depth: "deep",
    },
  },
  {
    id: "data-consulting",
    name: "Data / Consulting Firms",
    description:
      "Data consulting and professional services firms with client delivery and reporting complexity.",
    vertical_hint: "Data Consulting",
    recommended_offer: "Computer Work Audit → Discover Sprint → Build",
    proof_projects: ["Horizon Data Partners"],
    criteria: {
      industries: [
        "management consulting",
        "data analytics",
        "professional services",
        "information technology",
      ],
      geographies: [],
      employee_min: 5,
      employee_max: 100,
      company_keywords: [
        "data",
        "analytics",
        "consulting",
        "implementation",
        "professional services",
      ],
      excluded_keywords: ["staffing", "recruiting"],
      technologies: [],
      job_titles: [
        "founder",
        "ceo",
        "delivery lead",
        "operations",
        "client success",
        "managing director",
      ],
      seniority_levels: ["owner", "c_suite", "vp", "director"],
      departments: ["operations", "delivery", "executive"],
      website_keywords: ["client portal", "reporting", "dashboard"],
      signals_required: ["client_portal_need", "proposal_bottleneck"],
      signals_excluded: [],
      case_study_match: "Horizon Data Partners",
      max_records: 75,
      enrichment_depth: "standard",
    },
  },
];

export function getIcpTemplate(id: string): IcpTemplate | undefined {
  return ICP_TEMPLATES.find((t) => t.id === id);
}
