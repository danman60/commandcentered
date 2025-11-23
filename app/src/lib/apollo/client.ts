/**
 * Apollo.io API Client
 *
 * Integration with Apollo.io for lead generation:
 * - Search for companies/organizations
 * - Get contact information
 * - Enrich lead data
 *
 * API Documentation: https://apolloio.github.io/apollo-api-docs/
 */

interface ApolloSearchParams {
  q_organization_domains?: string;
  page?: number;
  per_page?: number;
  organization_locations?: string[];
  organization_num_employees_ranges?: string[];
  q_keywords?: string;
}

interface ApolloOrganization {
  id: string;
  name: string;
  website_url?: string;
  primary_domain?: string;
  sanitized_phone?: string;
  linkedin_url?: string;
  city?: string;
  state?: string;
  country?: string;
  industry?: string;
  keywords?: string[];
  estimated_num_employees?: number;
  annual_revenue?: number;
  technologies?: string[];
}

interface ApolloSearchResponse {
  breadcrumbs?: any[];
  partial_results_only?: boolean;
  disable_eu_prospecting?: boolean;
  partial_results_limit?: number;
  pagination?: {
    page: number;
    per_page: number;
    total_entries: number;
    total_pages: number;
  };
  organizations?: ApolloOrganization[];
  people?: any[];
}

/**
 * Apollo.io API Client
 */
export class ApolloClient {
  private apiKey: string;
  private baseUrl = 'https://api.apollo.io/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Search for organizations matching criteria
   */
  async searchOrganizations(params: ApolloSearchParams): Promise<ApolloSearchResponse> {
    const response = await fetch(`${this.baseUrl}/mixed_companies/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Api-Key': this.apiKey,
      },
      body: JSON.stringify({
        ...params,
        page: params.page || 1,
        per_page: params.per_page || 25,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Apollo.io API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  /**
   * Convert Apollo organization to our Lead format
   */
  static formatOrganization(org: ApolloOrganization) {
    const location = [org.city, org.state, org.country].filter(Boolean).join(', ');

    let revenue = '';
    if (org.annual_revenue) {
      const revenueM = org.annual_revenue / 1000000;
      if (revenueM >= 1) {
        revenue = `Est. $${revenueM.toFixed(0)}M`;
      } else {
        const revenueK = org.annual_revenue / 1000;
        revenue = `Est. $${revenueK.toFixed(0)}K`;
      }
    }

    let employees = '';
    if (org.estimated_num_employees) {
      employees = `${org.estimated_num_employees} employees`;
    }

    const tags = [
      org.industry,
      ...(org.keywords || []),
      ...(org.technologies || []).slice(0, 3), // Limit to 3 technologies
    ].filter(Boolean) as string[];

    return {
      id: org.id,
      name: org.name,
      location,
      website: org.website_url || org.primary_domain || '',
      email: '', // Apollo doesn't return email at organization level
      employees,
      revenue,
      tags: tags.slice(0, 5), // Limit to 5 tags
    };
  }
}

/**
 * Get Apollo client for tenant
 * Requires API key to be configured in leadSourceConfig
 */
export function createApolloClient(apiKey: string): ApolloClient {
  if (!apiKey) {
    throw new Error('Apollo.io API key is required');
  }
  return new ApolloClient(apiKey);
}
