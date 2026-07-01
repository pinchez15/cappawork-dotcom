import type { ListSearchCriteria } from "@/lib/validators/list-builder";
import { getProviderApiKey } from "@/server/repos/provider-settings";

const APOLLO_BASE = "https://api.apollo.io/api/v1";

export type ApolloOrganization = {
  id: string;
  name: string;
  website_url: string | null;
  linkedin_url: string | null;
  industry: string | null;
  estimated_num_employees: number | null;
  annual_revenue_printed: string | null;
  short_description: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  keywords: string[];
  founded_year: number | null;
};

export type ApolloPerson = {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  title: string | null;
  email: string | null;
  linkedin_url: string | null;
  seniority: string | null;
  departments: string[];
  organization_name: string | null;
};

async function apolloFetch<T>(
  endpoint: string,
  body: Record<string, unknown>
): Promise<T> {
  const apiKey = await getProviderApiKey("apollo");
  if (!apiKey) {
    throw new Error(
      "Apollo API key not configured. Set APOLLO_API_KEY env var or add in Provider Settings."
    );
  }

  const res = await fetch(`${APOLLO_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      "X-Api-Key": apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Apollo API error ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

function buildLocationFilter(geographies: string[]): Record<string, unknown> | undefined {
  if (!geographies.length) return undefined;
  return {
    organization_locations: geographies,
  };
}

export function criteriaToApolloSearch(
  criteria: ListSearchCriteria
): Record<string, unknown> {
  const search: Record<string, unknown> = {
    page: 1,
    per_page: Math.min(criteria.max_records || 100, 100),
  };

  if (criteria.industries.length) {
    search.organization_industry_tag_ids = criteria.industries;
    // Also use keyword search as fallback since tag IDs require Apollo mapping
    search.q_organization_keyword_tags = criteria.industries;
  }

  if (criteria.company_keywords.length) {
    search.q_organization_keyword_tags = [
      ...((search.q_organization_keyword_tags as string[]) || []),
      ...criteria.company_keywords,
    ];
  }

  if (criteria.employee_min || criteria.employee_max) {
    search.organization_num_employees_ranges = [
      `${criteria.employee_min || 1},${criteria.employee_max || 10000}`,
    ];
  }

  const location = buildLocationFilter(criteria.geographies);
  if (location) Object.assign(search, location);

  if (criteria.technologies.length) {
    search.currently_using_any_of_technology_uids = criteria.technologies;
  }

  return search;
}

export async function searchOrganizations(
  criteria: ListSearchCriteria
): Promise<{ organizations: ApolloOrganization[]; credits: number }> {
  const search = criteriaToApolloSearch(criteria);

  try {
    const result = await apolloFetch<{
      organizations: ApolloOrganization[];
      pagination: { total_entries: number };
    }>("/mixed_companies/search", search);

    return {
      organizations: result.organizations || [],
      credits: 1,
    };
  } catch (err) {
    // If Apollo fails (no key, rate limit), return demo data for dev
    if (process.env.NODE_ENV === "development" || !process.env.APOLLO_API_KEY) {
      return {
        organizations: generateDemoOrganizations(criteria),
        credits: 0,
      };
    }
    throw err;
  }
}

export async function searchPeople(
  organizationId: string,
  criteria: ListSearchCriteria
): Promise<{ people: ApolloPerson[]; credits: number }> {
  const search: Record<string, unknown> = {
    organization_ids: [organizationId],
    page: 1,
    per_page: 10,
  };

  if (criteria.job_titles.length) {
    search.person_titles = criteria.job_titles;
  }
  if (criteria.seniority_levels.length) {
    search.person_seniorities = criteria.seniority_levels;
  }
  if (criteria.departments.length) {
    search.person_departments = criteria.departments;
  }

  try {
    const result = await apolloFetch<{
      people: ApolloPerson[];
    }>("/mixed_people/search", search);

    return {
      people: result.people || [],
      credits: 1,
    };
  } catch {
    return { people: [], credits: 0 };
  }
}

export async function enrichOrganization(
  domain: string
): Promise<{ organization: ApolloOrganization | null; credits: number }> {
  try {
    const result = await apolloFetch<{
      organization: ApolloOrganization;
    }>("/organizations/enrich", { domain });

    return { organization: result.organization || null, credits: 1 };
  } catch {
    return { organization: null, credits: 0 };
  }
}

function generateDemoOrganizations(
  criteria: ListSearchCriteria
): ApolloOrganization[] {
  const industries = criteria.industries.length
    ? criteria.industries
    : ["Professional Services"];
  const count = Math.min(criteria.max_records || 20, 25);

  const names = [
    "Summit Health Partners",
    "Coastal Property Group",
    "Meridian Advisory",
    "DataBridge Consulting",
    "Pinnacle Operations",
    "Harbor View Management",
    "Atlas Financial Group",
    "ClearPath Analytics",
    "Northstar Community HOA",
    "VitalCare Clinics",
    "Keystone Wealth",
    "FlowState Consulting",
    "Greenfield Property Services",
    "Precision Health Systems",
    "BridgePoint Advisors",
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `demo-${i + 1}`,
    name: names[i % names.length] + (i >= names.length ? ` ${i}` : ""),
    website_url: `https://${names[i % names.length].toLowerCase().replace(/\s+/g, "")}.com`,
    linkedin_url: null,
    industry: industries[i % industries.length],
    estimated_num_employees:
      (criteria.employee_min || 10) +
      Math.floor(Math.random() * ((criteria.employee_max || 200) - (criteria.employee_min || 10))),
    annual_revenue_printed: "$5M-$15M",
    short_description: `A founder-led ${industries[0]} company with operational complexity.`,
    city: "Atlanta",
    state: "GA",
    country: "United States",
    keywords: criteria.company_keywords.slice(0, 3),
    founded_year: 2010 + (i % 12),
  }));
}

export function normalizeApolloOrg(org: ApolloOrganization) {
  const domain = org.website_url
    ? org.website_url.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0]
    : null;

  return {
    company_name: org.name,
    domain,
    linkedin_url: org.linkedin_url,
    industry: org.industry,
    location: [org.city, org.state, org.country].filter(Boolean).join(", ") || null,
    employee_count: org.estimated_num_employees,
    revenue_estimate: org.annual_revenue_printed,
    description: org.short_description,
    apollo_id: org.id,
    provider_data: org as unknown as Record<string, unknown>,
  };
}

export function normalizeApolloPerson(person: ApolloPerson) {
  return {
    name: person.name || `${person.first_name} ${person.last_name}`.trim(),
    title: person.title,
    email: person.email,
    linkedin_url: person.linkedin_url,
    seniority: person.seniority,
    department: person.departments?.[0] || null,
    apollo_id: person.id,
    provider_data: person as unknown as Record<string, unknown>,
  };
}
