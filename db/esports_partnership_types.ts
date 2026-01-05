/* ============================================
 * Ando eSports Partnership Lead (LTS)
 * 1:1 TypeScript types to match partnership-lead.v1 JSON Schema
 * ============================================ */

export interface AndoMarketingAttribution {
  source?: string;
  campaign?: string;
  medium?: string;
}

export interface AndoMetadata {
  createdAt?: string; // date-time (server-generated)
  updatedAt?: string; // date-time (server-generated)
  schemaVersion?: "1.0.0";
}

export interface AndoPartnershipLead {
  email: string;
  notes?: string;
  marketingAttribution?: AndoMarketingAttribution;
  metadata?: AndoMetadata;
}


