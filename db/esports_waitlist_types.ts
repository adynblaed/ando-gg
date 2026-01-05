/* ============================================
 * Ando eSports Waitlist Signup (LTS)
 * 1:1 TypeScript types to match waitlist-signup.v1 JSON Schema
 * ============================================ */

export type BBRegion =
  | "Reno"
  | "Sparks"
  | "Carson City"
  | "Tahoe/Truckee"
  | "Fernley"
  | "Fallon"
  | "Other Northern Nevada"
  | "Not Local";

export type BBMembership =
  | "Tier 1 (Free) Registered Local"
  | "Tier 2 ($3/mo) Player Profile"
  | "Tier 3 ($5/mo) Captain Profile"
  | "Coach / Leadership Track Interest";

export type BBPlayIntent = "Casual" | "Competitive" | "Both";

export type BBPreferredPlayTime = "Weeknights" | "Weekends" | "Late Nights" | "Flexible";

export type BBSkillSelfReport = "New" | "Casual" | "Ranked" | "High Ranked" | "Prefer Not To Say";

export type BBPlatform = "PC" | "PlayStation" | "Xbox" | "Switch" | "Mobile" | "Other";

export type BBProInterest = "Yes" | "Maybe" | "Not right now";

export interface AndoConnectedUsernames {
  discordUsername?: string;
  steamUsername?: string;
  riotUsername?: string;
}

export interface AndoLocality {
  isNorthernNevadaLocal: boolean;
  region: BBRegion;
  zipCode?: string;
}

export interface AndoGameEnrollment {
  gameId: string; // slug: ^[a-z0-9]+(?:-[a-z0-9]+)*$
  gameName: string;
  platforms?: BBPlatform[];
  primaryHandle?: string;
  skillSelfReport?: BBSkillSelfReport;
  roleOrStyle?: string;
}

export interface AndoConsent {
  emailUpdates: true; // const true in schema
  privacyAcknowledgement: true; // const true in schema
}

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

export interface AndoWaitlistSignup {
  email: string;
  clubUsername: string;
  connectedUsernames?: AndoConnectedUsernames;

  locality: AndoLocality;

  games: AndoGameEnrollment[];

  desiredMembership: BBMembership;
  playIntent: BBPlayIntent;
  preferredPlayTimes: BBPreferredPlayTime[];

  proInterest?: BBProInterest;
  eventInterest?: boolean;
  notes?: string;

  consent: AndoConsent;

  marketingAttribution?: AndoMarketingAttribution;
  metadata?: AndoMetadata;
}
