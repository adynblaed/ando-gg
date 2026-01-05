// app/page.tsx
"use client";

// Landing page for Ando eSports: waitlist intake, launch info, and partnerships CTA.
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import type {
  BBMembership,
  BBPlayIntent,
  BBPreferredPlayTime,
  BBProInterest,
  BBRegion,
  AndoGameEnrollment,
  AndoWaitlistSignup,
  BBPlatform,
} from "../db/esports_waitlist_types";
import { SignUpButton } from "@clerk/nextjs";
import { SiteFooter } from "./_components/SiteFooter";
import { SiteHeader } from "./_components/SiteHeader";
import { Card, ErrorText, Input, Label, Pill, Select, Textarea, cx } from "./_components/ui";

/* ============================================================
   Constants (single source of truth for UI options)
============================================================ */

const MEMBERSHIP_OPTIONS: BBMembership[] = [
  "Tier 1 (Free) Registered Local",
  "Tier 2 ($3/mo) Player Profile",
  "Tier 3 ($5/mo) Captain Profile",
  "Coach / Leadership Track Interest",
];

const REGION_OPTIONS: BBRegion[] = [
  "Reno",
  "Sparks",
  "Carson City",
  "Tahoe/Truckee",
  "Fernley",
  "Fallon",
  "Other Northern Nevada",
  "Not Local",
];

const PLAY_INTENT_OPTIONS: BBPlayIntent[] = ["Casual", "Competitive", "Both"];

const PLAY_TIME_OPTIONS: BBPreferredPlayTime[] = [
  "Weeknights",
  "Weekends",
  "Late Nights",
  "Flexible",
];

const PLATFORM_OPTIONS: BBPlatform[] = [
  "PC",
  "PlayStation",
  "Xbox",
  "Switch",
  "Mobile",
  "Other",
];

const AVAILABILITY_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const AVAILABILITY_BLOCKS = [
  { id: "morning", label: "Morning", range: "8a–12p" },
  { id: "afternoon", label: "Afternoon", range: "12p–5p" },
  { id: "evening", label: "Evening", range: "5p–10p" },
  { id: "late", label: "Late", range: "10p–2a" },
] as const;

type LaunchGame = {
  gameId: string;
  gameName: string;
  imageSrc: string;
  imageAlt: string;
};

type CommunityChoiceGame = {
  gameId: string;
  gameName: string;
};

type HighSchoolBadge = {
  schoolId: string;
  schoolName: string;
  city: string;
  badgeSrc: string;
  description: string;
  website: string;
};

const LAUNCH_GAMES: LaunchGame[] = [
  {
    gameId: "arc-raiders",
    gameName: "ARC Raiders",
    imageSrc: "/images/arc_raiders_thumbnail.jpg",
    imageAlt: "ARC Raiders key art",
  },
  {
    gameId: "valorant",
    gameName: "Valorant",
    imageSrc: "/images/valorant_thumbnail.jpg",
    imageAlt: "Valorant key art",
  },
  {
    gameId: "league-of-legends",
    gameName: "League of Legends",
    imageSrc: "/images/league_of_legends_thumbnail.jpg",
    imageAlt: "League of Legends key art",
  },
  {
    gameId: "marvel-rivals",
    gameName: "Marvel Rivals",
    imageSrc: "/images/marvel_rivals_thumbnail.jpg",
    imageAlt: "Marvel Rivals key art",
  },
];

const COMMUNITY_CHOICE_GAMES: CommunityChoiceGame[] = [
  {
    gameId: "community-choice-1",
    gameName: "Community Choice",
  },
  {
    gameId: "community-choice-2",
    gameName: "Community Choice",
  },
];

const INVITED_HIGH_SCHOOLS: HighSchoolBadge[] = [
  {
    schoolId: "damonte-ranch-high",
    schoolName: "Damonte Ranch High School",
    city: "Reno",
    badgeSrc: "/images/damonte_hs_badge.jpg",
    description: "A WCSD public high school in south Reno. Building a tradition of excellence in academics, athletics, and student activities.",
    website: "https://damonteranch.washoeschools.net/",
  },
  {
    schoolId: "galena-high",
    schoolName: "Galena High School",
    city: "Reno",
    badgeSrc: "/images/galena_hs_badge.jpg",
    description: "A WCSD public high school in Reno. Recognized for academic rigor, competitive athletics, and comprehensive extracurricular programs.",
    website: "https://galena.washoeschools.net/",
  },
  {
    schoolId: "incline-high",
    schoolName: "Incline High School",
    city: "Incline Village",
    badgeSrc: "/images/incline_hs_badge.jpg",
    description: "A WCSD public high school in Incline Village (Lake Tahoe area). Serving the North Lake Tahoe community with comprehensive educational programs.",
    website: "https://inclinehs.washoeschools.net/",
  },
  {
    schoolId: "innovations-high",
    schoolName: "Innovations High School",
    city: "Reno",
    badgeSrc: "/images/innovations_hs_badge.jpg",
    description: "A WCSD public 'School of Choice' high school in Reno. Offers alternative educational pathways and personalized learning approaches.",
    website: "https://innovations.washoeschools.net/",
  },
  {
    schoolId: "mcqueen-high",
    schoolName: "McQueen High School",
    city: "Reno",
    badgeSrc: "/images/mcqueen_hs_badge.jpg",
    description: "A WCSD public high school in Reno (Robert McQueen HS). Emphasizing innovation, student achievement, and comprehensive academic programs.",
    website: "https://mcqueen.washoeschools.net/",
  },
  {
    schoolId: "north-valleys-high",
    schoolName: "North Valleys High School",
    city: "Reno",
    badgeSrc: "/images/north_valleys_hs_badge.jpg",
    description: "A WCSD public high school in Reno's north valleys. Serving the North Valleys community with diverse academic and extracurricular opportunities.",
    website: "https://northvalleys.washoeschools.net/",
  },
  {
    schoolId: "hug-high",
    schoolName: "Procter R. Hug High School",
    city: "Sparks",
    badgeSrc: "/images/hug_hs_badge.jpg",
    description: "The new WCSD public high school in Sparks. Fostering academic excellence, student leadership, and community engagement.",
    website: "https://hug.washoeschools.net/",
  },
  {
    schoolId: "reed-high",
    schoolName: "Edward C. Reed High School",
    city: "Sparks",
    badgeSrc: "/images/reed_hs_badge.jpg",
    description: "A WCSD public high school in Sparks. Committed to academic achievement, character development, and preparing students for post-secondary success.",
    website: "https://reed.washoeschools.net/",
  },
  {
    schoolId: "sparks-high",
    schoolName: "Sparks High School",
    city: "Sparks",
    badgeSrc: "/images/sparks_hs_badge.jpg",
    description: "A WCSD public high school in Sparks. Home of the Railroaders, committed to academic excellence, student achievement, and comprehensive educational programs.",
    website: "https://sparkshs.washoeschools.net/",
  },
  {
    schoolId: "spanish-springs-high",
    schoolName: "Spanish Springs High School",
    city: "Spanish Springs",
    badgeSrc: "/images/spanish_springs_hs_badge.jpg",
    description: "A WCSD public high school in Spanish Springs (Sparks area). Providing comprehensive educational programs and strong community connections.",
    website: "https://spanishspringshs.washoeschools.net/",
  },
  {
    schoolId: "tmcc-high",
    schoolName: "Truckee Meadows CC High School",
    city: "Reno",
    badgeSrc: "/images/tmcc_hs_badge.jpg",
    description: "A WCSD public magnet high school at TMCC. Provides college credit opportunities and prepares students for post-secondary education.",
    website: "https://tmcchs.washoeschools.net/",
  },
  {
    schoolId: "wooster-high",
    schoolName: "Earl Wooster High School",
    city: "Reno",
    badgeSrc: "/images/wooster_hs_badge.jpg",
    description: "A WCSD public high school in southwest Reno. Committed to student success, community engagement, and comprehensive educational excellence.",
    website: "https://wooster.washoeschools.net/",
  },
];

/** Matches the JSON schema clubUsername regex */
const CLUB_USERNAME_REGEX = /^[A-Za-z0-9][A-Za-z0-9 _\-\.]{0,22}[A-Za-z0-9]$/;

/* ============================================================
   Utilities
============================================================ */

function clampArray<T>(arr: T[], max: number) {
  return arr.slice(0, Math.max(0, max));
}

function getUtmFromUrl(): { source?: string; medium?: string; campaign?: string } {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const source = params.get("utm_source") || undefined;
  const medium = params.get("utm_medium") || undefined;
  const campaign = params.get("utm_campaign") || undefined;
  return { source, medium, campaign };
}

/**
 * Parses school name to display name without "High School" suffix
 * Handles special cases like TMCC and full names
 */
function getSchoolDisplayName(schoolName: string): string {
  // Special cases first
  if (schoolName.includes("Truckee Meadows CC")) {
    return "TMCC High";
  }
  
  // For names with parentheses, prefer the abbreviation if it exists
  const parenMatch = schoolName.match(/^(.+?)\s*\(([^)]+)\)$/);
  if (parenMatch) {
    return parenMatch[2]; // Return the abbreviation
  }
  
  // Remove "High School" and variations
  let displayName = schoolName
    .replace(/\s+High\s+School$/i, "")
    .replace(/\s+CC\s+High\s+School$/i, "")
    .replace(/\s+High$/i, "")
    .trim();
  
  return displayName;
}

/* ============================================================
   Form state + validation
============================================================ */

type FieldErrors = Partial<Record<string, string>>;

type State = {
  email: string;
  clubUsername: string;

  isLocal: boolean;
  region: BBRegion;
  zipCode: string;

  desiredMembership: BBMembership;
  playIntent: BBPlayIntent;
  preferredPlayTimes: BBPreferredPlayTime[];

  selectedGameIds: string[];
  otherGames: Array<{ name: string; id: string }>;

  gameDetails: Record<string, Partial<AndoGameEnrollment>>;

  // Optional
  showOptional: boolean;
  discordUsername: string;
  steamUsername: string;
  riotUsername: string;

  proInterest: BBProInterest;
  eventInterest: boolean;
  notes: string;
  availabilitySlots: string[];

  // Coach / Pro Track
  coachProGames: Array<{
    gameId: string;
    gameName: string;
    rank: string;
    rankProofUrl: string;
    wantsToCoach: boolean;
    wantsToCompete: boolean;
    wantsToShowcase: boolean;
  }>;

  // Tier 2 Coaching
  tier2CoachingGames: Array<{
    gameId: string;
    gameName: string;
    currentRank: string;
    desiredRank: string;
    notes: string;
  }>;

  consentEmail: boolean;
  consentPrivacy: boolean;
};

type SetAction = {
  [K in keyof State]: { type: "set"; key: K; value: State[K] };
}[keyof State];

type CoachProGame = State["coachProGames"][number];
type Tier2CoachingGame = State["tier2CoachingGames"][number];

type Action =
  | SetAction
  | { type: "toggleGame"; gameId: string }
  | { type: "togglePlayTime"; value: BBPreferredPlayTime }
  | { type: "toggleAvailabilitySlot"; value: string }
  | { type: "setGameField"; gameId: string; patch: Partial<AndoGameEnrollment> }
  | { type: "normalizeLocality" }
  | { type: "addOtherGame" }
  | { type: "removeOtherGame"; index: number }
  | { type: "updateOtherGame"; index: number; field: "name" | "id"; value: string }
  | { type: "addCoachProGame"; gameId: string; gameName: string }
  | { type: "removeCoachProGame"; index: number }
  | { type: "updateCoachProGame"; index: number; field: keyof CoachProGame; value: unknown }
  | { type: "addTier2CoachingGame"; gameId: string; gameName: string }
  | { type: "removeTier2CoachingGame"; index: number }
  | { type: "updateTier2CoachingGame"; index: number; field: keyof Tier2CoachingGame; value: unknown };

const initialState: State = {
  email: "",
  clubUsername: "",

  isLocal: true,
  region: "Reno",
  zipCode: "",

  desiredMembership: "Tier 1 (Free) Registered Local",
  playIntent: "Both",
  preferredPlayTimes: ["Weeknights"],

  selectedGameIds: ["valorant"],
  otherGames: [],

  gameDetails: {},

  showOptional: false,
  discordUsername: "",
  steamUsername: "",
  riotUsername: "",

  proInterest: "Maybe",
  eventInterest: true,
  notes: "",
  availabilitySlots: [],

  coachProGames: [],

  tier2CoachingGames: [],

  consentEmail: true,
  consentPrivacy: true,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "set":
      // Clear coach/pro games if switching away from Coach / Pro Track Interest
      // Clear tier 2 coaching games if switching away from Tier 2
      if (action.key === "desiredMembership") {
        const updates: Partial<State> = { [action.key]: action.value };
        if (action.value !== "Coach / Leadership Track Interest") {
          updates.coachProGames = [];
        }
        if (action.value !== "Tier 3 ($5/mo) Captain Profile") {
          updates.tier2CoachingGames = [];
        }
        return { ...state, ...updates };
      }
      return { ...state, [action.key]: action.value };

    case "toggleGame": {
      const exists = state.selectedGameIds.includes(action.gameId);
      let next = exists
        ? state.selectedGameIds.filter((id) => id !== action.gameId)
        : [...state.selectedGameIds, action.gameId];

      // Schema maxItems=6
      next = clampArray(Array.from(new Set(next)), 6);

      // If toggling off "other", clear otherGames
      if (action.gameId === "other" && exists) {
        return { ...state, selectedGameIds: next, otherGames: [] };
      }

      // If toggling on "other" and no games exist, add first slot
      if (action.gameId === "other" && !exists && state.otherGames.length === 0) {
        return {
          ...state,
          selectedGameIds: next,
          otherGames: [{ name: "", id: `other-${Date.now()}` }],
        };
      }

      return { ...state, selectedGameIds: next };
    }

    case "togglePlayTime": {
      const exists = state.preferredPlayTimes.includes(action.value);
      let next = exists
        ? state.preferredPlayTimes.filter((t) => t !== action.value)
        : [...state.preferredPlayTimes, action.value];

      // UX cap (schema max 3 in this version)
      next = clampArray(Array.from(new Set(next)), 3);

      return { ...state, preferredPlayTimes: next };
    }

    case "toggleAvailabilitySlot": {
      const exists = state.availabilitySlots.includes(action.value);
      let next = exists
        ? state.availabilitySlots.filter((v) => v !== action.value)
        : [...state.availabilitySlots, action.value];

      return { ...state, availabilitySlots: Array.from(new Set(next)) };
    }

    case "setGameField":
      return {
        ...state,
        gameDetails: {
          ...state.gameDetails,
          [action.gameId]: {
            ...(state.gameDetails[action.gameId] || {}),
            ...action.patch,
          },
        },
      };

    case "normalizeLocality": {
      // Keep region consistent with isLocal intent
      if (!state.isLocal) return { ...state, region: "Not Local" };
      if (state.isLocal && state.region === "Not Local") return { ...state, region: "Reno" };
      return state;
    }

    case "addOtherGame": {
      if (state.otherGames.length >= 3) return state;
      return {
        ...state,
        otherGames: [...state.otherGames, { name: "", id: `other-${Date.now()}` }],
      };
    }

    case "removeOtherGame": {
      const next = state.otherGames.filter((_, i) => i !== action.index);
      return { ...state, otherGames: next };
    }

    case "updateOtherGame": {
      const next = [...state.otherGames];
      next[action.index] = { ...next[action.index], [action.field]: action.value };
      return { ...state, otherGames: next };
    }

    case "addCoachProGame": {
      return {
        ...state,
        coachProGames: [
          ...state.coachProGames,
          {
            gameId: action.gameId,
            gameName: action.gameName,
            rank: "",
            rankProofUrl: "",
            wantsToCoach: false,
            wantsToCompete: false,
            wantsToShowcase: false,
          },
        ],
      };
    }

    case "removeCoachProGame": {
      return {
        ...state,
        coachProGames: state.coachProGames.filter((_, i) => i !== action.index),
      };
    }

    case "updateCoachProGame": {
      const next = [...state.coachProGames];
      next[action.index] = { ...next[action.index], [action.field]: action.value };
      return { ...state, coachProGames: next };
    }

    case "addTier2CoachingGame": {
      return {
        ...state,
        tier2CoachingGames: [
          ...state.tier2CoachingGames,
          {
            gameId: action.gameId,
            gameName: action.gameName,
            currentRank: "",
            desiredRank: "",
            notes: "",
          },
        ],
      };
    }

    case "removeTier2CoachingGame": {
      return {
        ...state,
        tier2CoachingGames: state.tier2CoachingGames.filter((_, i) => i !== action.index),
      };
    }

    case "updateTier2CoachingGame": {
      const next = [...state.tier2CoachingGames];
      next[action.index] = { ...next[action.index], [action.field]: action.value };
      return { ...state, tier2CoachingGames: next };
    }

    default:
      return state;
  }
}

/**
 * Validates form values against the user-facing subset of the schema.
 * Returns a sparse error map keyed by UI field name.
 */
function validate(state: State): FieldErrors {
  const next: FieldErrors = {};

  const email = state.email.trim();
  if (!email) next.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email.";

  const clubUsername = state.clubUsername.trim();
  if (!clubUsername) next.clubUsername = "Club username is required.";
  else if (!CLUB_USERNAME_REGEX.test(clubUsername))
    next.clubUsername =
      "2–24 chars. Letters/numbers/spaces._- allowed. Must start/end with letter/number.";

  if (!state.region) next.region = "Choose a region.";

  if (!state.selectedGameIds.length) next.games = "Pick at least one game.";

  if (state.selectedGameIds.includes("other")) {
    if (state.otherGames.length === 0) {
      next.otherGames = "Add at least one game in your rotation.";
    } else {
      state.otherGames.forEach((game, index) => {
        if (!game.name.trim()) {
          next[`otherGame_${index}_name`] = "Game name is required.";
        }
      });
    }
  }

  if (!state.desiredMembership) next.desiredMembership = "Choose a membership.";

  if (state.desiredMembership === "Coach / Leadership Track Interest") {
    if (state.coachProGames.length === 0) {
      next.coachProGames = "Add at least one game for the Leadership Track.";
    } else {
      state.coachProGames.forEach((game, index) => {
        if (!game.rank.trim()) {
          next[`coachPro_${index}_rank`] = "Rank is required.";
        }
        if (!game.rankProofUrl.trim()) {
          next[`coachPro_${index}_rankProofUrl`] = "Rank proof URL is required.";
        } else if (!/^https?:\/\/.+/.test(game.rankProofUrl.trim())) {
          next[`coachPro_${index}_rankProofUrl`] = "Enter a valid URL (http:// or https://).";
        }
        if (!game.wantsToCoach && !game.wantsToCompete && !game.wantsToShowcase) {
          next[`coachPro_${index}_goals`] = "Select at least one goal (coach, compete, or showcase).";
        }
      });
    }
  }

  if (!state.playIntent) next.playIntent = "Choose Casual / Competitive / Both.";

  if (!state.preferredPlayTimes.length) next.preferredPlayTimes = "Pick at least one time preference.";

  if (state.zipCode.trim() && !/^[0-9]{5}(-[0-9]{4})?$/.test(state.zipCode.trim()))
    next.zipCode = "Use 5-digit ZIP (optional).";

  if (state.notes && state.notes.length > 300) next.notes = "Keep notes under 300 characters.";

  if (!state.consentEmail) next.consentEmail = "Required to join the waitlist.";
  if (!state.consentPrivacy) next.consentPrivacy = "Required to join the waitlist.";

  return next;
}

function formatAvailabilitySlot(slot: string): string {
  const [day, blockId] = slot.split("-");
  const block = AVAILABILITY_BLOCKS.find((b) => b.id === blockId);
  return block ? `${day} ${block.label}` : slot;
}

function buildAvailabilityNote(state: State, maxLength: number): string {
  if (!state.availabilitySlots.length) return "";

  const dayOrder = new Map(AVAILABILITY_DAYS.map((d, i) => [d, i]));
  const blockOrder = new Map(AVAILABILITY_BLOCKS.map((b, i) => [b.id, i]));

  const normalized = state.availabilitySlots
    .map((slot) => {
      const [day, blockId] = slot.split("-");
      return { slot, day, blockId };
    })
    .sort((a, b) => {
      const da = dayOrder.get(a.day as (typeof AVAILABILITY_DAYS)[number]) ?? 999;
      const db = dayOrder.get(b.day as (typeof AVAILABILITY_DAYS)[number]) ?? 999;
      if (da !== db) return da - db;
      const ba = blockOrder.get(a.blockId) ?? 999;
      const bb = blockOrder.get(b.blockId) ?? 999;
      return ba - bb;
    });

  const prefix = "Typical windows: ";
  const parts = normalized.map((s) => formatAvailabilitySlot(s.slot));

  if (maxLength <= prefix.length + 1) return "";

  let out = prefix;
  let used = 0;
  for (const part of parts) {
    const sep = used === 0 ? "" : ", ";
    const next = `${sep}${part}`;
    if ((out + next).length > maxLength) break;
    out += next;
    used += 1;
  }

  const remaining = parts.length - used;
  if (remaining > 0) {
    const suffix = `, +${remaining} more`;
    if ((out + suffix).length <= maxLength) out += suffix;
  }

  return out;
}

function buildWaitlistNotes(state: State): string {
  const base = state.notes.trim();
  const maxTotal = 300;

  if (!base) {
    const availabilityOnly = buildAvailabilityNote(state, maxTotal);
    return availabilityOnly;
  }

  const baseTrimmed = base.slice(0, maxTotal);
  const remaining = maxTotal - baseTrimmed.length;
  if (remaining <= 2) return baseTrimmed;

  const availability = buildAvailabilityNote(state, remaining - 2);
  return [baseTrimmed, availability].filter(Boolean).join("\n\n");
}

/**
 * Builds a schema-aligned payload for API submission.
 * Server should still validate payload before persistence.
 */
function buildPayload(state: State, utm: { source?: string; medium?: string; campaign?: string }): AndoWaitlistSignup {
  const selectedGames: AndoGameEnrollment[] = state.selectedGameIds
    .map((id) => {
      if (id === "other") {
        // Return all other games
        return state.otherGames
          .filter((g) => g.name.trim())
          .map((g) => ({
            gameId: g.id.trim() || `other-${g.name.toLowerCase().replace(/\s+/g, "-")}`,
            gameName: g.name.trim(),
            ...(state.gameDetails[g.id] || {}),
          }));
      }

      const found = LAUNCH_GAMES.find((g) => g.gameId === id);
      if (!found) return null;

      return {
        gameId: found.gameId,
        gameName: found.gameName,
        ...(state.gameDetails[id] || {}),
      };
    })
    .flat()
    .filter(Boolean) as AndoGameEnrollment[];

  const connected =
    state.discordUsername.trim() || state.steamUsername.trim() || state.riotUsername.trim()
      ? {
          ...(state.discordUsername.trim() ? { discordUsername: state.discordUsername.trim() } : {}),
          ...(state.steamUsername.trim() ? { steamUsername: state.steamUsername.trim() } : {}),
          ...(state.riotUsername.trim() ? { riotUsername: state.riotUsername.trim() } : {}),
        }
      : undefined;

  const marketingAttribution =
    utm.source || utm.medium || utm.campaign
      ? {
          ...(utm.source ? { source: utm.source } : {}),
          ...(utm.campaign ? { campaign: utm.campaign } : {}),
          ...(utm.medium ? { medium: utm.medium } : {}),
        }
      : undefined;

  const notes = buildWaitlistNotes(state);

  return {
    email: state.email.trim(),
    clubUsername: state.clubUsername.trim(),
    ...(connected ? { connectedUsernames: connected } : {}),

    locality: {
      isNorthernNevadaLocal: state.isLocal,
      region: state.region,
      ...(state.zipCode.trim() ? { zipCode: state.zipCode.trim() } : {}),
    },

    games: clampArray(selectedGames, 6),

    desiredMembership: state.desiredMembership,
    playIntent: state.playIntent,
    preferredPlayTimes: clampArray(state.preferredPlayTimes, 3),

    ...(state.proInterest ? { proInterest: state.proInterest } : {}),
    ...(typeof state.eventInterest === "boolean" ? { eventInterest: state.eventInterest } : {}),
    ...(notes ? { notes } : {}),

    ...(state.desiredMembership === "Coach / Leadership Track Interest" && state.coachProGames.length > 0
      ? {
          coachProTrack: state.coachProGames.map((cp) => ({
            gameId: cp.gameId,
            gameName: cp.gameName,
            rank: cp.rank.trim(),
            rankProofUrl: cp.rankProofUrl.trim(),
            wantsToCoach: cp.wantsToCoach,
            wantsToCompete: cp.wantsToCompete,
            wantsToShowcase: cp.wantsToShowcase,
          })),
        }
      : {}),

    ...(state.desiredMembership === "Tier 3 ($5/mo) Captain Profile" &&
    state.tier2CoachingGames.length > 0
      ? {
          tier2Coaching: state.tier2CoachingGames.map((t2) => ({
            gameId: t2.gameId,
            gameName: t2.gameName,
            currentRank: t2.currentRank.trim(),
            desiredRank: t2.desiredRank.trim(),
            notes: t2.notes.trim(),
          })),
        }
      : {}),

    consent: {
      emailUpdates: true,
      privacyAcknowledgement: true,
    },

    ...(marketingAttribution ? { marketingAttribution } : {}),
  };
}

/* ============================================================
   Reusable UI primitives (small + extendable)
============================================================ */

// (moved: Pill/Card/Label/Input/Select/Textarea/ErrorText into app/_components/ui.tsx)

/* ============================================================
   Page
============================================================ */

type AboutUsMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageSrc: string;
  currentlyPlaying?: string;
  weekendRotation?: string;
  storyFavorites?: string;
  climbingBadges?: Array<
    | {
        kind: "image";
        game: string;
        label: string;
        badgeSrc: string;
        previewSrc: string;
      }
    | {
        kind: "dial";
        game: string;
        label: string;
        value: string;
        dialColorClassName: string;
        previewSrc: string;
      }
  >;
};

const ABOUT_US_MEMBERS: AboutUsMember[] = [
  {
    id: "adyn-blaed",
    name: "Adyn Blaed",
    role: "Founder",
    bio: "Born and raised in Reno/Sparks, Adyn builds Ando around structured, welcoming spaces for zillennial and local gaming communities. The goal is simple: show up weekly, improve together, and keep it respectful.",
    imageSrc: "/images/blaed_profile_pic.png",
    currentlyPlaying: "ARC Raiders, Marvel Rivals, League of Legends",
    weekendRotation: "Dawn of War, Rogue Trader, Helldivers II, Satisfactory",
    storyFavorites: "Baldur's Gate III, Elden Ring, Where Winds Meet, Cyberpunk 2077, Mass Effect Trilogy",
    climbingBadges: [
      {
        kind: "image",
        game: "Marvel Rivals",
        label: "Grandmaster",
        badgeSrc: "/images/4%20-%20Grandmaster@56.png",
        previewSrc: "/images/marvel_rivals_thumbnail.jpg",
      },
      {
        kind: "dial",
        game: "ARC Raiders",
        label: "Level 55",
        value: "55",
        dialColorClassName: "border-yellow-400/90 text-yellow-300",
        previewSrc: "/images/arc_raiders_thumbnail.jpg",
      },
    ],
  },
  {
    id: "placeholder-1",
    name: "Team Member (Placeholder)",
    role: "Staff",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    imageSrc: "/images/blaed_profile_pic.png",
    currentlyPlaying: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    weekendRotation: "Sed do eiusmod tempor incididunt ut labore et dolore.",
    storyFavorites: "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
    climbingBadges: [
      {
        kind: "image",
        game: "Marvel Rivals",
        label: "Grandmaster",
        badgeSrc: "/images/4%20-%20Grandmaster@56.png",
        previewSrc: "/images/marvel_rivals_thumbnail.jpg",
      },
      {
        kind: "dial",
        game: "ARC Raiders",
        label: "Level 55",
        value: "55",
        dialColorClassName: "border-yellow-400/90 text-yellow-300",
        previewSrc: "/images/arc_raiders_thumbnail.jpg",
      },
    ],
  },
  {
    id: "placeholder-2",
    name: "Team Member (Placeholder)",
    role: "Staff",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    imageSrc: "/images/blaed_profile_pic.png",
    currentlyPlaying: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    weekendRotation: "Sed do eiusmod tempor incididunt ut labore et dolore.",
    storyFavorites: "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
    climbingBadges: [
      {
        kind: "image",
        game: "Marvel Rivals",
        label: "Grandmaster",
        badgeSrc: "/images/4%20-%20Grandmaster@56.png",
        previewSrc: "/images/marvel_rivals_thumbnail.jpg",
      },
      {
        kind: "dial",
        game: "ARC Raiders",
        label: "Level 55",
        value: "55",
        dialColorClassName: "border-yellow-400/90 text-yellow-300",
        previewSrc: "/images/arc_raiders_thumbnail.jpg",
      },
    ],
  },
];

// Renders the main site experience with hero, waitlist, launch info, and partner CTA flows.
export default function Home() {
  const utm = useMemo(() => getUtmFromUrl(), []);

  const [eventOpen, setEventOpen] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [bracketFormatIndex, setBracketFormatIndex] = useState(0);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const bracketFormats = [
    {
      id: "group-stage",
      label: "Group Stage",
      description: "3 groups of 4 teams, top 2 advance",
      detailedDescription: {
        origin: "Originated in international soccer tournaments (FIFA World Cup, UEFA Champions League) and adapted for esports by major leagues like League of Legends World Championship and Dota 2's The International.",
        howItWorks: "Teams are divided into groups where each team plays every other team in their group. Top teams from each group advance to a playoff bracket. For 12 teams: 3 groups of 4, each team plays 3 matches, top 2 from each group (6 teams) advance to playoffs.",
        comparison: "More matches per team than single elimination, fewer than round robin. Provides recovery opportunities—teams can lose a match and still advance. Balances participation with competitive intensity.",
        esportsPerception: "Widely used in premier esports tournaments. Considered fair and engaging for viewers. Allows underdogs to prove themselves while ensuring top teams advance. Standard format for major international competitions.",
      },
    },
    {
      id: "round-robin",
      label: "Round Robin",
      description: "All teams play each other once",
      detailedDescription: {
        origin: "Classic tournament format dating back to chess and traditional sports. Used in esports for league play (Overwatch League regular season, LCS/LEC splits) and some smaller tournaments.",
        howItWorks: "Every team plays every other team exactly once. Teams are ranked by win-loss record. For 12 teams: each team plays 11 matches (66 total matches). Top teams by record advance to playoffs or win directly.",
        comparison: "Maximum matches per team, ensuring every team faces every opponent. Most time-intensive format. Provides the most comprehensive ranking but can be lengthy for tournaments.",
        esportsPerception: "Common for regular season play in professional leagues. Less common for standalone tournaments due to time requirements. Valued for fairness and comprehensive competition. Sometimes seen as less exciting than elimination formats.",
      },
    },
    {
      id: "single-elimination",
      label: "Single Elimination",
      description: "Direct knockout bracket",
      detailedDescription: {
        origin: "Traditional knockout format from tennis Grand Slams, boxing, and March Madness. Widely used in esports for quick tournaments, qualifiers, and some major events (Valorant Champions, CS:GO Majors use hybrid formats).",
        howItWorks: "Teams compete in a bracket where losing one match eliminates you. Bracket progresses through rounds until one champion remains. For 12 teams: top 4 seeds get byes, 8 teams play in first round, winners advance through quarterfinals, semifinals, to finals.",
        comparison: "Fewest total matches, fastest format. High stakes—one loss ends your run. Less forgiving than group stage or double elimination. Can feel harsh for teams that lose early.",
        esportsPerception: "Classic tournament format, exciting and dramatic. Popular for viewer engagement due to high stakes. Sometimes criticized for being too punishing—one bad day eliminates strong teams. Common in qualifiers and smaller tournaments.",
      },
    },
    {
      id: "double-elimination",
      label: "Double Elimination",
      description: "Losers bracket for second chance",
      detailedDescription: {
        origin: "Evolved from fighting game tournaments (EVO, Capcom Cup) and adopted by major esports (The International, many CS:GO events). Designed to give teams a second chance after one loss.",
        howItWorks: "Teams start in a winners bracket. After a loss, teams drop to a losers bracket where they can still compete. Losers bracket winner faces winners bracket winner in Grand Finals. For 12 teams: more matches than single elimination, but fewer than group stage.",
        comparison: "More matches than single elimination, fewer than group stage. Provides second chances while maintaining competitive intensity. More complex to follow than single elimination but fairer.",
        esportsPerception: "Highly respected in competitive esports, especially fighting games and MOBAs. Considered the fairest elimination format. Popular with players and viewers. Standard for many premier tournaments. Can be complex for casual viewers.",
      },
    },
  ];
  const currentBracketFormat = bracketFormats[bracketFormatIndex];
  const [bracketSeedings, setBracketSeedings] = useState<string[]>(() => 
    INVITED_HIGH_SCHOOLS.map(s => s.schoolId)
  );


  const [activeAboutId, setActiveAboutId] = useState<string>(ABOUT_US_MEMBERS[0]?.id ?? "");
  const [aboutAnimNonce, setAboutAnimNonce] = useState(0);
  const [hoveredAboutId, setHoveredAboutId] = useState<string | null>(null);

  const hoveredAboutIndex = useMemo(() => {
    if (!hoveredAboutId) return -1;
    return ABOUT_US_MEMBERS.findIndex((m) => m.id === hoveredAboutId);
  }, [hoveredAboutId]);

  const activeAboutIndex = useMemo(() => {
    return Math.max(
      0,
      ABOUT_US_MEMBERS.findIndex((m) => m.id === activeAboutId)
    );
  }, [activeAboutId]);

  function selectAboutMember(id: string) {
    setActiveAboutId(id);
    setAboutAnimNonce((n) => n + 1);
  }

  function goToPrevAboutMember() {
    if (!ABOUT_US_MEMBERS.length) return;
    const prevIndex = activeAboutIndex <= 0 ? ABOUT_US_MEMBERS.length - 1 : activeAboutIndex - 1;
    selectAboutMember(ABOUT_US_MEMBERS[prevIndex]!.id);
  }

  function goToNextAboutMember() {
    if (!ABOUT_US_MEMBERS.length) return;
    const nextIndex = activeAboutIndex >= ABOUT_US_MEMBERS.length - 1 ? 0 : activeAboutIndex + 1;
    selectAboutMember(ABOUT_US_MEMBERS[nextIndex]!.id);
  }

  const activeAboutMember = useMemo(() => {
    return ABOUT_US_MEMBERS.find((m) => m.id === activeAboutId) ?? ABOUT_US_MEMBERS[0];
  }, [activeAboutId]);

  const [state, dispatch] = useReducer(reducer, initialState);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<null | { ok: boolean; message: string }>(null);

  const [partnerEmail, setPartnerEmail] = useState("");
  const [partnerNotes, setPartnerNotes] = useState("");
  const [partnerErrors, setPartnerErrors] = useState<PartnerErrors>({});
  const [partnerSubmitting, setPartnerSubmitting] = useState(false);
  const [partnerSubmitted, setPartnerSubmitted] = useState<null | { ok: boolean; message: string }>(null);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
      function syncFromHash() {
        if (typeof window === "undefined") return;
        if (window.location.hash === "#waitlist") setWaitlistOpen(true);
      }

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  useEffect(() => {
    dispatch({ type: "normalizeLocality" });
  }, [state.isLocal]);

  const selectedGames: AndoGameEnrollment[] = useMemo(() => {
    const games: AndoGameEnrollment[] = [];
    
    state.selectedGameIds.forEach((id) => {
      if (id === "other") {
        state.otherGames.forEach((g) => {
          if (g.name.trim()) {
            games.push({
              gameId: g.id.trim() || `other-${g.name.toLowerCase().replace(/\s+/g, "-")}`,
              gameName: g.name.trim(),
              ...(state.gameDetails[g.id] || {}),
            });
          }
        });
      } else {
        const found = LAUNCH_GAMES.find((g) => g.gameId === id);
        if (found) {
          games.push({
            gameId: found.gameId,
            gameName: found.gameName,
            ...(state.gameDetails[id] || {}),
          });
        }
      }
    });
    
    return games;
  }, [state.selectedGameIds, state.otherGames, state.gameDetails]);

  const tierHelper = useMemo(() => {
    switch (state.desiredMembership) {
      case "Tier 1 (Free) Registered Local":
        return "Tier 1 — free registration as a Northern Nevada player.";
      case "Tier 2 ($3/mo) Player Profile":
        return "Tier 2 — Player Profile + SquadMatch + Player Card + in-store perks. Built for weekly nights you can invite friends to.";
      case "Tier 3 ($5/mo) Captain Profile":
        return "Tier 3 — Captain Queue + VOD Lite + Verified/Standing + showcase priority. Built for consistent groups and leaders.";
      case "Coach / Leadership Track Interest":
        return "Leadership Track — opt in if you want to coach, mentor, or help lead game nights and teams.";
      default:
        return "";
    }
  }, [state.desiredMembership]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (previewMode) return;
    setSubmitted(null);

    const v = validate(state);
    setErrors(v);
    if (Object.keys(v).length) {
      // Scroll to first error field
      const firstErrorKey = Object.keys(v)[0];
      const firstErrorElement = document.querySelector(`[name="${firstErrorKey}"]`) || 
                                 document.querySelector(`[id="${firstErrorKey}"]`);
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        (firstErrorElement as HTMLElement).focus();
      }
      return;
    }

    const payload = buildPayload(state, utm);

    // Abort any in-flight request (prevents duplicates on rapid submits)
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setSubmitting(true);

      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify(payload),
      });

      const json = (await res.json().catch(() => null)) as
        | { ok?: boolean; message?: string }
        | null;

      if (!res.ok || !json?.ok) {
        setSubmitted({
          ok: false,
          message: json?.message || "Could not submit. Please try again.",
        });
        return;
      }

      setSubmitted({
        ok: true,
        message:
          "You're in. Welcome to the first wave — watch your inbox for opening updates and invites.",
      });

      // Scroll to success message
      setTimeout(() => {
        const successElement = document.querySelector('[role="alert"]');
        if (successElement) {
          successElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);

      // Reset: clears contact + notes while preserving cohort preferences.
      dispatch({ type: "set", key: "email", value: "" });
      dispatch({ type: "set", key: "notes", value: "" });
    } catch (err: unknown) {
      const maybeAbort = err as { name?: string } | null;
      if (maybeAbort?.name === "AbortError") return;
      setSubmitted({
        ok: false,
        message: "Network error. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function onPartnershipSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPartnerSubmitted(null);

    const v = validatePartnership(partnerEmail, partnerNotes);
    setPartnerErrors(v);
    if (Object.keys(v).length) return;

    try {
      setPartnerSubmitting(true);
      const res = await fetch("/api/partnerships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: partnerEmail.trim(), notes: partnerNotes.trim() }),
      });

      const json = (await res.json().catch(() => null)) as
        | { ok?: boolean; message?: string }
        | null;

      if (!res.ok || !json?.ok) {
        setPartnerSubmitted({ ok: false, message: json?.message || "Could not submit. Please try again." });
        return;
      }

      setPartnerSubmitted({
        ok: true,
        message: json?.message || "Received. We will reach out as soon as possible.",
      });
      setPartnerEmail("");
      setPartnerNotes("");
    } catch {
      setPartnerSubmitted({ ok: false, message: "Network error. Please try again." });
    } finally {
      setPartnerSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--background))] text-[rgb(var(--foreground))]">
      {/* Background accents */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-120px] h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-[rgba(var(--accent),0.12)] blur-3xl" />
        <div className="absolute left-[12%] top-[35%] h-[320px] w-[420px] rounded-full bg-[rgba(var(--accent-2),0.10)] blur-3xl" />
      </div>

      {/* Header */}
      <SiteHeader primaryCtaHref="/#waitlist" primaryCtaLabel="Join Waitlist" />

      <main className="mx-auto max-w-6xl px-5 pb-20 pt-10">
        {/* Hero */}
        <section className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10">
          <div className="space-y-6">
            {/* Title and Tags */}
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Ando eSports <span className="opacity-80">(Coming Soon)</span>
              </h1>

              <div className="flex flex-wrap items-center gap-2">
                <Pill>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.0 rounded-full bg-[rgba(var(--accent),1)]" />
                    First Wave Waitlist
                  </span>
                </Pill>
                <Pill>All Skills Welcome</Pill>
                <Pill>Local Squads</Pill>
                <Pill>Local Tourneys</Pill>
                <Pill>Local Circuits</Pill>
                <Pill>Casual or Competitive</Pill>
                <Pill>PvE</Pill>
                <Pill>PvP</Pill>
                <Pill>Solo/Duo/Trio/Squad</Pill>
              </div>
            </div>

            {/* Intro Content */}
            <div className="max-w-xl space-y-4">
              <p className="text-base leading-7 text-[rgb(var(--muted))]">
                Ando eSports is a local gaming community in Reno/Sparks with weekly scheduled game nights you can count on. All skill levels welcome.
              </p>
              <p className="text-base leading-7 text-[rgb(var(--muted))]">
                Join the waitlist to help us organize teams and game nights. Invite your friends and build consistent gaming habits together.
              </p>
              <p className="text-base leading-7 text-[rgb(var(--foreground))] font-medium">
                Those of the first wave will receive an exclusive <span className="text-[rgb(var(--accent))]">Year 1 Founder&apos;s Token</span>, a first wave collectible that doubles as your esports league badge and player ID.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#waitlist"
                className="inline-flex items-center justify-center rounded-full bg-[rgb(var(--foreground))] px-5 py-3 text-sm font-semibold text-[rgb(var(--background))] shadow-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)]"
              >
                Join the Waitlist
              </a>
              <a
                href="#tiers"
                className="inline-flex items-center justify-center rounded-full border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.7)] px-5 py-3 text-sm font-semibold shadow-sm transition-all duration-200 hover:bg-[rgba(var(--foreground),0.04)] hover:border-[rgba(var(--border),0.8)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)]"
              >
                See Memberships
              </a>
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-full border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.7)] px-5 py-3 text-sm font-semibold shadow-sm transition-all duration-200 hover:bg-[rgba(var(--foreground),0.04)] hover:border-[rgba(var(--border),0.8)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)]"
              >
                Discover Services
              </Link>
            </div>

          </div>

          {/* Year 1 Content - Games */}
          <div className="w-full max-w-xl space-y-6">
            <Card className="p-5 sm:p-6">
              <h2 className="text-lg font-semibold mb-2">Year 1 Launch Games</h2>
              <p className="text-sm leading-6 text-[rgb(var(--muted))] mb-4">
                We&apos;re starting with four confirmed titles plus two community-voted slots. Select your games below
                and add up to 3 additional games from your current rotation.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {LAUNCH_GAMES.map((g) => (
                  <div
                    key={g.gameId}
                    className="group relative overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.72)] shadow-sm"
                  >
                    <div className="relative aspect-[16/9] w-full">
                      <Image
                        src={g.imageSrc}
                        alt={g.imageAlt}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-[1.02]"
                        sizes="(max-width: 1024px) 50vw, 520px"
                        priority={g.gameId === "valorant"}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-sm font-semibold text-white drop-shadow">{g.gameName}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {COMMUNITY_CHOICE_GAMES.map((g) => (
                  <div
                    key={g.gameId}
                    className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-[rgba(var(--border),0.6)] bg-[rgba(var(--surface),0.72)] shadow-sm transition-all duration-200 hover:border-[rgba(var(--accent),0.4)]"
                  >
                    <div className="relative aspect-[16/9] w-full bg-black">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[80px] font-bold text-white/80">?</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-sm font-semibold text-white drop-shadow">{g.gameName}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-4 pt-4 border-t border-[rgb(var(--border))] text-xs text-[rgb(var(--muted))]">
                Community Choices will be voted upon by players of the First Wave.
              </p>
            </Card>

          </div>
        </section>

        {/* Event Collapsible */}
        <section id="event" className="mt-14 scroll-mt-24" aria-labelledby="event-heading">
          <Card className={cx("relative", eventOpen ? "p-6 sm:p-8" : "rounded-2xl p-4 sm:p-5")}>
            <div
              className={cx(
                "relative overflow-hidden",
                eventOpen
                  ? "-mx-6 -mt-6 mb-5 rounded-t-3xl sm:-mx-8 sm:-mt-8"
                  : "-m-4 rounded-2xl sm:-m-5"
              )}
            >
              <div className="pointer-events-none absolute inset-0">
                <Image
                  src="/images/reno_city_overlook_banner.jpg"
                  alt=""
                  fill
                  priority={false}
                  sizes="(max-width: 1024px) 92vw, 960px"
                  className="object-cover opacity-65"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/55 via-black/20 to-transparent" />
              </div>

              <div
                onClick={() => setEventOpen((v) => !v)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setEventOpen((v) => !v);
                  }
                }}
                aria-expanded={eventOpen}
                aria-controls="event-panel"
                className={cx(
                  "relative z-10 w-full text-left cursor-pointer",
                  eventOpen ? "px-6 pb-5 pt-6 sm:px-8 sm:pb-6 sm:pt-8" : "p-4 sm:p-5"
                )}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 id="event-heading" className="text-2xl font-semibold tracking-tight text-white drop-shadow">
                      1st Annual Ando eSports Varsity Invitational (2026)
                    </h2>
                    <p className="mt-1 text-sm text-white/85 drop-shadow">
                      Local tournament for Northern Nevada high schools. Structured play, exhibition matches, and community showcase.
                    </p>
                  </div>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    className={cx(
                      "shrink-0 text-white/90 drop-shadow transition-transform duration-200",
                      eventOpen ? "rotate-180" : "rotate-0"
                    )}
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div
              id="event-panel"
              className={cx(
                "relative overflow-hidden transition-[max-height,opacity,transform] duration-500 ease-out motion-reduce:transition-none",
                eventOpen ? "max-h-[5000px] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-1"
              )}
            >
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <Card className="p-6 sm:p-8">
                  <h3 className="text-lg font-semibold text-[rgb(var(--accent))] mb-3">Prize Pool</h3>
                  <div className="mb-4">
                    <p className="text-3xl font-semibold tracking-tight text-[rgb(var(--foreground))]">$1,000</p>
                    <p className="mt-1 text-sm text-[rgb(var(--muted))]">Total prize pool for participating teams</p>
                  </div>
                  <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                    The tournament features a $1,000 prize pool distributed among top-performing teams. This provides meaningful recognition 
                    and rewards for student athletes while supporting the growth of competitive esports programs in Northern Nevada schools.
                  </p>
                </Card>

                <Card className="p-6 sm:p-8">
                  <h3 className="text-lg font-semibold text-[rgb(var(--accent))] mb-3">Goals</h3>
                  <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                    This tournament aims to establish an esports league within the Northern Nevada region, making competitive 
                    gaming accessible to students and faculty just like traditional sports programs.
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
                    High schools can begin to roster esports as extracurricular activities or regularly scheduled programs, providing 
                    structured pathways for team play, communication skills, and personal growth aligned with our core pillars: 
                    <span className="font-semibold text-[rgb(var(--foreground))]"> Plan</span> (decision-making and objectives), 
                    <span className="font-semibold text-[rgb(var(--foreground))]"> Execute</span> (mechanics and consistency), 
                    <span className="font-semibold text-[rgb(var(--foreground))]"> Connect</span> (communication and teamwork), and 
                    <span className="font-semibold text-[rgb(var(--foreground))]"> Control</span> (mental game and emotional regulation).
                  </p>
                </Card>
              </div>

              <div className="mt-6" style={{ overflow: 'visible', position: 'relative' }}>
                <Card className="p-6 sm:p-8" style={{ overflow: 'visible', position: 'relative' }}>
                  <h3 className="text-lg font-semibold text-[rgb(var(--accent))] mb-4">Invited Schools</h3>
                  <p className="text-sm leading-6 text-[rgb(var(--muted))] mb-6">
                    Public high schools across Northern Nevada have been invited to participate in the tournament. 
                    Hover over each school badge to learn more.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4" style={{ overflow: 'visible', position: 'relative' }}>
                    {INVITED_HIGH_SCHOOLS.map((school) => (
                      <div key={school.schoolId} className="group relative flex flex-col items-center" style={{ overflow: 'visible', position: 'relative', zIndex: 1 }}>
                        <a
                          href={school.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[rgb(var(--border))] bg-[rgba(var(--surface),0.7)] shadow-sm transition-transform duration-200 hover:scale-110 hover:border-[rgb(var(--accent))] cursor-pointer block"
                          aria-label={`Visit ${school.schoolName} website`}
                        >
                          <Image
                            src={school.badgeSrc}
                            alt={`${school.schoolName} badge`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 80px, 96px"
                            onError={(e) => {
                              // Fallback to a placeholder if image doesn't exist
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              if (target.parentElement) {
                                target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-[rgba(var(--accent),0.1)] text-[rgb(var(--accent))] font-semibold text-xs">${school.schoolName.split(' ').map(n => n[0]).join('')}</div>`;
                              }
                            }}
                          />
                        </a>
                        <p className="mt-2 text-xs font-semibold text-center text-[rgb(var(--foreground))] max-w-[100px]">
                          {school.schoolName}
                        </p>
                        <p className="mt-1 text-[10px] text-center text-[rgb(var(--muted))]">
                          {school.city}
                        </p>
                        <div
                          role="tooltip"
                          className={cx(
                            "pointer-events-none absolute left-1/2 bottom-full mb-3 -translate-x-1/2",
                            "w-auto opacity-0 transition-opacity duration-200 group-hover:opacity-100",
                            "max-w-[90vw]"
                          )}
                          style={{ 
                            zIndex: 99999,
                            position: 'absolute'
                          }}
                        >
                          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] shadow-2xl p-4 max-w-[420px] min-w-[320px]">
                            <h4 className="text-sm font-semibold text-[rgb(var(--foreground))] mb-1.5">
                              {school.schoolName}
                            </h4>
                            <p className="text-xs text-[rgb(var(--muted))] leading-5 whitespace-normal">
                              {school.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="mt-6">
                <Card className="p-6 sm:p-8">
                  <h3 className="text-lg font-semibold text-[rgb(var(--accent))] mb-4">Team Structure & Support</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-[rgb(var(--foreground))] mb-2">Roster Requirements</h4>
                      <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                        Each school is invited to roster <span className="font-semibold text-[rgb(var(--foreground))]">5 players</span> with up to <span className="font-semibold text-[rgb(var(--foreground))]">2 substitutes each</span>, for a total of <span className="font-semibold text-[rgb(var(--foreground))]">15 players per school</span>. Teams field different player counts depending on the game:
                      </p>
                      <ul className="mt-2 ml-4 space-y-1 text-sm leading-6 text-[rgb(var(--muted))] list-disc">
                        <li><span className="font-semibold text-[rgb(var(--foreground))]">5 players</span> at a time for League of Legends and Valorant</li>
                        <li><span className="font-semibold text-[rgb(var(--foreground))]">6 players</span> at a time for Marvel Rivals</li>
                        <li><span className="font-semibold text-[rgb(var(--foreground))]">3 players</span> for ARC Raiders</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-[rgb(var(--foreground))] mb-2">Coaching & Organization</h4>
                      <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                        Each team is chaperoned and organized by a designated <span className="font-semibold text-[rgb(var(--foreground))]">faculty member or alumni volunteer coach</span>. Coaches interface with Ando's event coordination teams to organize brackets, assign player roles, schedule monthly esports program meetings per school, and ensure smooth tournament operations.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-[rgb(var(--foreground))] mb-2">Recruitment & Team Management</h4>
                      <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                        Ando assists in recruitment at school-sponsored schedules and event fairs. We just need an afternoon to set up a table with flyers, and we help with <span className="font-semibold text-[rgb(var(--foreground))]">digital player signups and team management</span> in collaboration with faculty members. This makes it easy for schools to onboard students and maintain organized rosters.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="mt-6">
                <Card className="p-6 sm:p-8">
                  <h3 className="text-lg font-semibold text-[rgb(var(--accent))] mb-4">Example Brackets</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm leading-6 text-[rgb(var(--muted))] mb-4">
                        Explore different bracket formats we can support for the tournament. The <span className="font-semibold text-[rgb(var(--foreground))]">group stage format</span> is our recommended starting format for the inaugural tournament, ensuring all teams get meaningful competitive play with 12 participating schools divided into <span className="font-semibold text-[rgb(var(--foreground))]">3 groups of 4 teams</span>.
                      </p>
                    </div>

                    {/* Carousel Navigation */}
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => setBracketFormatIndex((prev) => (prev === 0 ? bracketFormats.length - 1 : prev - 1))}
                        className="p-2 rounded-full border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.7)] hover:bg-[rgba(var(--foreground),0.04)] transition-colors"
                        aria-label="Previous bracket format"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[rgb(var(--muted))]">
                          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      
                      <div className="flex-1 mx-4 text-center">
                        <h4 className="text-base font-semibold text-[rgb(var(--foreground))]">
                          {currentBracketFormat.label}
                        </h4>
                        <p className="text-xs text-[rgb(var(--muted))] mt-1">
                          {currentBracketFormat.description}
                        </p>
                        <div className="flex justify-center gap-1.5 mt-2">
                          {bracketFormats.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setBracketFormatIndex(idx)}
                              className={cx(
                                "h-1.5 rounded-full transition-all duration-200",
                                idx === bracketFormatIndex
                                  ? "w-6 bg-[rgb(var(--accent))]"
                                  : "w-1.5 bg-[rgb(var(--border))] hover:bg-[rgb(var(--muted))]"
                              )}
                              aria-label={`View ${bracketFormats[idx].label} format`}
                            />
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => setBracketFormatIndex((prev) => (prev === bracketFormats.length - 1 ? 0 : prev + 1))}
                        className="p-2 rounded-full border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.7)] hover:bg-[rgba(var(--foreground),0.04)] transition-colors"
                        aria-label="Next bracket format"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[rgb(var(--muted))]">
                          <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>

                    {/* Carousel Content */}
                    <div className="relative overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.3)] p-4 sm:p-6">
                      <div 
                        className="flex transition-transform duration-300 ease-in-out"
                        style={{ 
                          transform: `translateX(-${bracketFormatIndex * (100 / bracketFormats.length)}%)`,
                          width: `${bracketFormats.length * 100}%`
                        }}
                      >
                        {/* Group Stage Format */}
                        <div className="w-full flex-shrink-0 px-2" style={{ width: `${100 / bracketFormats.length}%` }}>
                          <div className="space-y-6">
                              <div className="grid gap-4 md:grid-cols-3">
                                {[
                                  { group: "A", teams: bracketSeedings.slice(0, 4) },
                                  { group: "B", teams: bracketSeedings.slice(4, 8) },
                                  { group: "C", teams: bracketSeedings.slice(8, 12) },
                                ].map(({ group, teams }) => (
                                  <div key={group} className="rounded-2xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.5)] p-4">
                                    <h4 className="text-sm font-semibold text-[rgb(var(--accent))] mb-3">Group {group}</h4>
                                    <div className="space-y-2">
                                      {teams.map((schoolId) => {
                                        const school = INVITED_HIGH_SCHOOLS.find(s => s.schoolId === schoolId);
                                        if (!school) return null;
                                        return (
                                          <div
                                            key={schoolId}
                                            className="flex items-center gap-2 p-2 rounded-lg bg-[rgba(var(--surface),0.7)] hover:bg-[rgba(var(--foreground),0.04)] transition-colors"
                                          >
                                            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[rgb(var(--border))] flex-shrink-0">
                                              <Image
                                                src={school.badgeSrc}
                                                alt={`${school.schoolName} badge`}
                                                fill
                                                className="object-cover"
                                                sizes="32px"
                                              />
                                            </div>
                                            <span className="text-xs font-semibold text-[rgb(var(--foreground))] truncate">
                                              {getSchoolDisplayName(school.schoolName)}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                    <p className="mt-3 text-[10px] text-[rgb(var(--muted))] italic">
                                      Top 2 advance to playoffs
                                    </p>
                                  </div>
                                ))}
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-[rgb(var(--muted))]">
                                  Each team plays 3 matches in group play • Top 2 from each group advance to playoffs
                                </p>
                              </div>
                              
                              {/* About Group Stage */}
                              <div className="rounded-xl border border-[rgb(var(--accent))] bg-[rgba(var(--accent),0.05)] p-4 mt-6">
                                <h4 className="text-sm font-semibold text-[rgb(var(--accent))] mb-3">About Group Stage</h4>
                                <div className="space-y-3 text-xs leading-5 text-[rgb(var(--muted))]">
                                  <div>
                                    <p className="font-semibold text-[rgb(var(--foreground))] mb-1">Origin:</p>
                                    <p>{bracketFormats[0].detailedDescription.origin}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-[rgb(var(--foreground))] mb-1">How It Works:</p>
                                    <p>{bracketFormats[0].detailedDescription.howItWorks}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-[rgb(var(--foreground))] mb-1">Comparison:</p>
                                    <p>{bracketFormats[0].detailedDescription.comparison}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-[rgb(var(--foreground))] mb-1">Esports Perception:</p>
                                    <p>{bracketFormats[0].detailedDescription.esportsPerception}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                        {/* Round Robin Format */}
                        <div className="w-full flex-shrink-0 px-2" style={{ width: `${100 / bracketFormats.length}%` }}>
                          <div className="space-y-4">
                              <p className="text-sm leading-6 text-[rgb(var(--muted))] text-center mb-4">
                                All 12 teams play each other once in a round-robin format. Each team plays 11 matches.
                              </p>
                              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                                {INVITED_HIGH_SCHOOLS.map((school, idx) => (
                                  <div
                                    key={school.schoolId}
                                    className="flex items-center gap-2 p-3 rounded-xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.5)]"
                                  >
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[rgb(var(--border))] flex-shrink-0">
                                      <Image
                                        src={school.badgeSrc}
                                        alt={`${school.schoolName} badge`}
                                        fill
                                        className="object-cover"
                                        sizes="40px"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-semibold text-[rgb(var(--foreground))] truncate">
                                        {getSchoolDisplayName(school.schoolName)}
                                      </p>
                                      <p className="text-[10px] text-[rgb(var(--muted))]">
                                        11 matches
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="text-center mt-4">
                                <p className="text-xs text-[rgb(var(--muted))]">
                                  Total: 66 matches • Top teams by win record advance to playoffs
                                </p>
                              </div>
                              
                              {/* About Round Robin */}
                              <div className="rounded-xl border border-[rgb(var(--accent))] bg-[rgba(var(--accent),0.05)] p-4 mt-6">
                                <h4 className="text-sm font-semibold text-[rgb(var(--accent))] mb-3">About Round Robin</h4>
                                <div className="space-y-3 text-xs leading-5 text-[rgb(var(--muted))]">
                                  <div>
                                    <p className="font-semibold text-[rgb(var(--foreground))] mb-1">Origin:</p>
                                    <p>{bracketFormats[1].detailedDescription.origin}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-[rgb(var(--foreground))] mb-1">How It Works:</p>
                                    <p>{bracketFormats[1].detailedDescription.howItWorks}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-[rgb(var(--foreground))] mb-1">Comparison:</p>
                                    <p>{bracketFormats[1].detailedDescription.comparison}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-[rgb(var(--foreground))] mb-1">Esports Perception:</p>
                                    <p>{bracketFormats[1].detailedDescription.esportsPerception}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                        {/* Single Elimination Format */}
                        <div className="w-full flex-shrink-0 px-2" style={{ width: `${100 / bracketFormats.length}%` }}>
                          <div className="space-y-4">
                            <p className="text-sm leading-6 text-[rgb(var(--muted))] text-center mb-4">
                              12 teams compete in a single-elimination bracket. Top 4 seeds receive first-round byes.
                            </p>
                            <div className="flex flex-col items-center gap-4">
                              {/* Finals - Top */}
                              <div className="w-full max-w-md">
                                <p className="text-xs font-semibold text-[rgb(var(--accent))] mb-3 text-center">Championship</p>
                                <div className="rounded-xl border-2 border-[rgb(var(--accent))] bg-[rgba(var(--accent),0.1)] p-4">
                                  <div className="flex items-center justify-center gap-3">
                                    <div className="flex items-center gap-2">
                                      <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[rgb(var(--accent))] flex-shrink-0">
                                        <Image
                                          src={INVITED_HIGH_SCHOOLS[0]?.badgeSrc || ""}
                                          alt={`${INVITED_HIGH_SCHOOLS[0]?.schoolName} badge`}
                                          fill
                                          className="object-cover"
                                          sizes="40px"
                                        />
                                      </div>
                                      <span className="text-sm font-semibold text-[rgb(var(--foreground))]">
                                        {INVITED_HIGH_SCHOOLS[0] ? getSchoolDisplayName(INVITED_HIGH_SCHOOLS[0].schoolName) : "Team 1"}
                                      </span>
                                    </div>
                                    <span className="text-xs text-[rgb(var(--muted))]">vs</span>
                                    <div className="flex items-center gap-2">
                                      <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[rgb(var(--accent))] flex-shrink-0">
                                        <Image
                                          src={INVITED_HIGH_SCHOOLS[1]?.badgeSrc || ""}
                                          alt={`${INVITED_HIGH_SCHOOLS[1]?.schoolName} badge`}
                                          fill
                                          className="object-cover"
                                          sizes="40px"
                                        />
                                      </div>
                                      <span className="text-sm font-semibold text-[rgb(var(--foreground))]">
                                        {INVITED_HIGH_SCHOOLS[1] ? getSchoolDisplayName(INVITED_HIGH_SCHOOLS[1].schoolName) : "Team 2"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="w-px h-4 bg-[rgb(var(--border))] mx-auto mt-2"></div>
                              </div>

                              {/* Semifinals */}
                              <div className="w-full max-w-2xl">
                                <p className="text-[10px] font-semibold text-[rgb(var(--muted))] mb-3 text-center">Semifinals</p>
                                <div className="grid gap-4 sm:grid-cols-2">
                                  {[
                                    { teams: [0, 1] },
                                    { teams: [2, 3] },
                                  ].map((match, matchIdx) => (
                                    <div key={matchIdx}>
                                      <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.7)] p-3">
                                        <div className="flex flex-col gap-2">
                                          {match.teams.map((teamIdx) => {
                                            const school = INVITED_HIGH_SCHOOLS[teamIdx];
                                            if (!school) return null;
                                            return (
                                              <div key={teamIdx} className="flex items-center gap-2">
                                                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[rgb(var(--border))] flex-shrink-0">
                                                  <Image
                                                    src={school.badgeSrc}
                                                    alt={`${school.schoolName} badge`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="32px"
                                                  />
                                                </div>
                                                <span className="text-xs font-semibold text-[rgb(var(--foreground))] truncate">
                                                  {getSchoolDisplayName(school.schoolName)}
                                                </span>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                      <div className="w-px h-4 bg-[rgb(var(--border))] mx-auto mt-2"></div>
                                    </div>
                                  ))}
                                </div>
                                <div className="flex justify-center mt-2">
                                  <div className="w-full max-w-md h-px bg-[rgb(var(--border))]"></div>
                                </div>
                                <div className="w-px h-4 bg-[rgb(var(--border))] mx-auto"></div>
                              </div>

                              {/* Quarterfinals */}
                              <div className="w-full max-w-4xl">
                                <p className="text-[10px] font-semibold text-[rgb(var(--muted))] mb-3 text-center">Quarterfinals</p>
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                  {[
                                    { teams: [0, 1] },
                                    { teams: [2, 3] },
                                    { teams: [4, 5] },
                                    { teams: [6, 7] },
                                  ].map((match, matchIdx) => (
                                    <div key={matchIdx}>
                                      <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.7)] p-2.5">
                                        <div className="flex flex-col gap-1.5">
                                          {match.teams.map((teamIdx) => {
                                            const school = INVITED_HIGH_SCHOOLS[teamIdx];
                                            if (!school) return null;
                                            return (
                                              <div key={teamIdx} className="flex items-center gap-1.5">
                                                <div className="relative w-6 h-6 rounded-full overflow-hidden border border-[rgb(var(--border))] flex-shrink-0">
                                                  <Image
                                                    src={school.badgeSrc}
                                                    alt={`${school.schoolName} badge`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="24px"
                                                  />
                                                </div>
                                                <span className="text-[10px] font-semibold text-[rgb(var(--foreground))] truncate">
                                                  {getSchoolDisplayName(school.schoolName)}
                                                </span>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                      <div className="w-px h-4 bg-[rgb(var(--border))] mx-auto mt-2"></div>
                                    </div>
                                  ))}
                                </div>
                                <div className="flex justify-center mt-2">
                                  <div className="w-full max-w-4xl h-px bg-[rgb(var(--border))]"></div>
                                </div>
                                <div className="w-px h-4 bg-[rgb(var(--border))] mx-auto"></div>
                              </div>

                              {/* Round of 12 - Bottom */}
                              <div className="w-full max-w-4xl">
                                <p className="text-[10px] font-semibold text-[rgb(var(--muted))] mb-3 text-center">Round of 12 (Top 4 seeds get byes)</p>
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                  {[
                                    { teams: [8, 9] },
                                    { teams: [10, 11] },
                                    { teams: [4, 5] },
                                    { teams: [6, 7] },
                                  ].map((match, matchIdx) => (
                                    <div key={matchIdx}>
                                      <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.5)] p-2.5">
                                        <div className="flex flex-col gap-1.5">
                                          {match.teams.map((teamIdx) => {
                                            const school = INVITED_HIGH_SCHOOLS[teamIdx];
                                            if (!school) return null;
                                            return (
                                              <div key={teamIdx} className="flex items-center gap-1.5">
                                                <div className="relative w-6 h-6 rounded-full overflow-hidden border border-[rgb(var(--border))] flex-shrink-0">
                                                  <Image
                                                    src={school.badgeSrc}
                                                    alt={`${school.schoolName} badge`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="24px"
                                                  />
                                                </div>
                                                <span className="text-[10px] font-semibold text-[rgb(var(--foreground))] truncate">
                                                  {getSchoolDisplayName(school.schoolName)}
                                                </span>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="text-center mt-4">
                              <p className="text-xs text-[rgb(var(--muted))]">
                                Total: 11 matches • Single elimination
                              </p>
                            </div>
                            
                            {/* About Single Elimination */}
                            <div className="rounded-xl border border-[rgb(var(--accent))] bg-[rgba(var(--accent),0.05)] p-4 mt-6">
                              <h4 className="text-sm font-semibold text-[rgb(var(--accent))] mb-3">About Single Elimination</h4>
                              <div className="space-y-3 text-xs leading-5 text-[rgb(var(--muted))]">
                                <div>
                                  <p className="font-semibold text-[rgb(var(--foreground))] mb-1">Origin:</p>
                                  <p>{bracketFormats[2].detailedDescription.origin}</p>
                                </div>
                                <div>
                                  <p className="font-semibold text-[rgb(var(--foreground))] mb-1">How It Works:</p>
                                  <p>{bracketFormats[2].detailedDescription.howItWorks}</p>
                                </div>
                                <div>
                                  <p className="font-semibold text-[rgb(var(--foreground))] mb-1">Comparison:</p>
                                  <p>{bracketFormats[2].detailedDescription.comparison}</p>
                                </div>
                                <div>
                                  <p className="font-semibold text-[rgb(var(--foreground))] mb-1">Esports Perception:</p>
                                  <p>{bracketFormats[2].detailedDescription.esportsPerception}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Double Elimination Format */}
                        <div className="w-full flex-shrink-0 px-2" style={{ width: `${100 / bracketFormats.length}%` }}>
                          <div className="space-y-4">
                              <p className="text-sm leading-6 text-[rgb(var(--muted))] text-center mb-4">
                                Double elimination format provides a second chance. Teams that lose in the winners bracket drop to the losers bracket for another opportunity.
                              </p>
                              <div className="grid gap-4 md:grid-cols-2">
                                <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.5)] p-4">
                                  <h4 className="text-sm font-semibold text-[rgb(var(--accent))] mb-3">Winners Bracket</h4>
                                  <div className="space-y-2">
                                    {INVITED_HIGH_SCHOOLS.slice(0, 6).map((school) => (
                                      <div
                                        key={school.schoolId}
                                        className="flex items-center gap-2 p-2 rounded-lg bg-[rgba(var(--surface),0.7)]"
                                      >
                                        <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[rgb(var(--border))] flex-shrink-0">
                                          <Image
                                            src={school.badgeSrc}
                                            alt={`${school.schoolName} badge`}
                                            fill
                                            className="object-cover"
                                            sizes="28px"
                                          />
                                        </div>
                                        <span className="text-xs font-semibold text-[rgb(var(--foreground))] truncate">
                                          {school.schoolName.split(" ").slice(-2).join(" ")}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.5)] p-4">
                                  <h4 className="text-sm font-semibold text-[rgb(var(--accent))] mb-3">Losers Bracket</h4>
                                  <div className="space-y-2">
                                    {INVITED_HIGH_SCHOOLS.slice(6, 12).map((school) => (
                                      <div
                                        key={school.schoolId}
                                        className="flex items-center gap-2 p-2 rounded-lg bg-[rgba(var(--surface),0.7)] opacity-75"
                                      >
                                        <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[rgb(var(--border))] flex-shrink-0">
                                          <Image
                                            src={school.badgeSrc}
                                            alt={`${school.schoolName} badge`}
                                            fill
                                            className="object-cover"
                                            sizes="28px"
                                          />
                                        </div>
                                        <span className="text-xs font-semibold text-[rgb(var(--foreground))] truncate">
                                          {getSchoolDisplayName(school.schoolName)}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                  <p className="mt-3 text-[10px] text-[rgb(var(--muted))] italic">
                                    Teams from winners bracket enter here after a loss
                                  </p>
                                </div>
                              </div>
                              <div className="text-center mt-4">
                                <p className="text-xs text-[rgb(var(--muted))]">
                                  Losers bracket winner faces winners bracket winner in Grand Finals
                                </p>
                              </div>
                              
                              {/* About Double Elimination */}
                              <div className="rounded-xl border border-[rgb(var(--accent))] bg-[rgba(var(--accent),0.05)] p-4 mt-6">
                                <h4 className="text-sm font-semibold text-[rgb(var(--accent))] mb-3">About Double Elimination</h4>
                                <div className="space-y-3 text-xs leading-5 text-[rgb(var(--muted))]">
                                  <div>
                                    <p className="font-semibold text-[rgb(var(--foreground))] mb-1">Origin:</p>
                                    <p>{bracketFormats[3].detailedDescription.origin}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-[rgb(var(--foreground))] mb-1">How It Works:</p>
                                    <p>{bracketFormats[3].detailedDescription.howItWorks}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-[rgb(var(--foreground))] mb-1">Comparison:</p>
                                    <p>{bracketFormats[3].detailedDescription.comparison}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-[rgb(var(--foreground))] mb-1">Esports Perception:</p>
                                    <p>{bracketFormats[3].detailedDescription.esportsPerception}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                </Card>
              </div>

              <div className="mt-6">
                <Card className="p-6 sm:p-8">
                  <h3 className="text-lg font-semibold text-[rgb(var(--accent))] mb-3">Ando's Recommendation</h3>
                  <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                    For single events and tournaments like the Varsity Invitational, we recommend using <span className="font-semibold text-[rgb(var(--foreground))]">Group Stage</span> or <span className="font-semibold text-[rgb(var(--foreground))]">Single/Double Elimination</span> formats. These formats provide clear progression, exciting matchups, and a definitive conclusion within the event timeframe.
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
                    We reserve <span className="font-semibold text-[rgb(var(--foreground))]">Round Robin brackets</span> for seasonal play outside of single events, particularly for partnered high school esports programs. Round Robin works best for ongoing league play where teams compete over an extended period, ensuring comprehensive competition and fair rankings across a full season.
                  </p>
                </Card>
              </div>

              <div className="mt-6">
                <Card className="p-6 sm:p-8">
                  <h3 className="text-lg font-semibold text-[rgb(var(--accent))] mb-3">For Schools, Students, and Parents</h3>
                  <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                    Esports programs offer students opportunities to develop teamwork, strategic thinking, and communication skills in a 
                    structured, supervised environment. Like traditional sports, esports teaches students how to work together toward common 
                    goals, manage pressure, and build resilience through practice and competition.
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
                    Schools can integrate esports as an extracurricular activity or scheduled program, providing students with a pathway to 
                    compete, improve, and represent their school. Faculty can oversee teams, ensuring a safe, positive environment that 
                    emphasizes growth and sportsmanship alongside competitive achievement.
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/events"
                      className="inline-flex items-center justify-center rounded-full bg-[rgb(var(--foreground))] px-5 py-3 text-sm font-semibold text-[rgb(var(--background))] shadow-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)]"
                    >
                      Learn More About Events
                    </Link>
                    <Link
                      href="/#waitlist"
                      className="inline-flex items-center justify-center rounded-full border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.7)] px-5 py-3 text-sm font-semibold shadow-sm transition-all duration-200 hover:bg-[rgba(var(--foreground),0.04)] hover:border-[rgba(var(--border),0.8)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)]"
                    >
                      Join Waitlist
                    </Link>
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        </section>

        {/* Events & Programs - Full Width */}
        <section className="mt-10">
          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-semibold mb-2">Events & Programs</h2>
            <p className="text-sm leading-6 text-[rgb(var(--muted))] mb-6">
              Structured tournaments, community programs, and services for players, locals, and institutions. Join us for competitive play, regular game nights, and pathways for growth.
            </p>

            {/* Events Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3 text-[rgb(var(--accent))]">Tournament Events</h3>
              <p className="text-sm leading-6 text-[rgb(var(--muted))] mb-4">
                Structured tournaments for high schools and colleges. Join us for competitive play, exhibition matches, and community showcases.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/events#invitational"
                  className="group relative overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.72)] shadow-sm transition-all duration-300 hover:shadow-md hover:border-[rgba(var(--accent),0.3)]"
                >
                  <div className="relative aspect-[16/9] w-full">
                    <Image
                      src="/images/reno_city_overlook_banner.jpg"
                      alt="Varsity Invitational"
                      fill
                      className="object-cover transition duration-300 group-hover:scale-[1.02]"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-base font-semibold text-white drop-shadow">Varsity Invitational</p>
                      <p className="mt-0.5 text-xs text-white/90 drop-shadow">Northern Nevada • 2026</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/events#collegiate"
                  className="group relative overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.72)] shadow-sm transition-all duration-300 hover:shadow-md hover:border-[rgba(var(--accent),0.3)]"
                >
                  <div className="relative aspect-[16/9] w-full">
                    <Image
                      src="/images/reno_city_overlook_banner.jpg"
                      alt="Collegiate Invitational"
                      fill
                      className="object-cover transition duration-300 group-hover:scale-[1.02]"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-base font-semibold text-white drop-shadow">Collegiate Invitational</p>
                      <p className="mt-0.5 text-xs text-white/90 drop-shadow">Regional Competition • 2026</p>
                    </div>
                  </div>
                </Link>
              </div>
              <p className="mt-4 text-xs text-[rgb(var(--muted))]">
                Both events feature structured brackets, prize pools, and pathways for student growth.
              </p>
            </div>

            {/* Programs Section */}
            <div className="mb-8 pt-6 border-t border-[rgb(var(--border))]">
              <h3 className="text-lg font-semibold mb-3 text-[rgb(var(--accent))]">Community Programs</h3>
              <p className="text-sm leading-6 text-[rgb(var(--muted))] mb-4">
                Regular programs and features available through memberships for players and locals.
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { title: "Weekly Game Nights", desc: "Regularly scheduled sessions you can invite friends to." },
                  { title: "Monthly Challenges", desc: "Regularly programmed challenges for chasing seasonal achievements." },
                  { title: "Find Your Squad", desc: "Get matched with local players who share your schedule." },
                  { title: "Track Progress", desc: "See your growth with monthly reports and player cards." },
                ].map((c) => (
                  <div
                    key={c.title}
                    className="rounded-xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.72)] p-4 shadow-sm backdrop-blur"
                  >
                    <p className="text-sm font-semibold mb-1">{c.title}</p>
                    <p className="text-xs leading-5 text-[rgb(var(--muted))]">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Services Section */}
            <div className="pt-6 border-t border-[rgb(var(--border))]">
              <h3 className="text-lg font-semibold mb-3 text-[rgb(var(--accent))]">Services & Offerings</h3>
              <div className="space-y-3 text-sm leading-6 text-[rgb(var(--muted))]">
                <p>
                  <span className="font-semibold text-[rgb(var(--foreground))]">For Players & Locals:</span> <Link href="/memberships" className="font-semibold text-[rgb(var(--accent))] hover:underline">Memberships</Link> provide access to weekly game nights, player profiles, and local community.
                </p>
                <p>
                  <span className="font-semibold text-[rgb(var(--foreground))]">For Institutions:</span> <Link href="/services" className="font-semibold text-[rgb(var(--accent))] hover:underline">Services</Link> provide tournament hosting, bracket organization, and esports infrastructure for schools and organizations.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Waitlist Form */}
        <section id="waitlist" className="mt-14 scroll-mt-24" aria-labelledby="waitlist-heading">
          <Card className={cx("relative", waitlistOpen ? "p-6 sm:p-8" : "rounded-2xl p-4 sm:p-5")}>
            <div
              className={cx(
                "relative overflow-hidden",
                waitlistOpen
                  ? "-mx-6 -mt-6 mb-5 rounded-t-3xl sm:-mx-8 sm:-mt-8"
                  : "-m-4 rounded-2xl sm:-m-5"
              )}
            >
              <div className="pointer-events-none absolute inset-0">
                <Image
                  src="/images/waitlist_banner.jpg"
                  alt=""
                  fill
                  priority={false}
                  sizes="(max-width: 1024px) 92vw, 960px"
                  className="object-cover opacity-65"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/55 via-black/20 to-transparent" />
              </div>

              <div
                onClick={() => setWaitlistOpen((v) => !v)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setWaitlistOpen((v) => !v);
                  }
                }}
                aria-expanded={waitlistOpen}
                aria-controls="waitlist-panel"
                className={cx(
                  "relative z-10 w-full text-left cursor-pointer",
                  waitlistOpen ? "px-6 pb-5 pt-6 sm:px-8 sm:pb-6 sm:pt-8" : "p-4 sm:p-5"
                )}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 id="waitlist-heading" className="text-2xl font-semibold tracking-tight text-white drop-shadow">
                      Join the First Wave Waitlist
                    </h2>
                    <p className="mt-1 text-sm text-white/85 drop-shadow">
                      Pre-register so we can organize teams, nights, showcases, and coaching capacity from day one.
                      <span className="font-medium text-white"> No payment today.</span>
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <div className="flex flex-col items-end gap-2">
                      <SignUpButton mode="modal">
                        <span 
                          onClick={(e) => e.stopPropagation()}
                          className="inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 cursor-pointer"
                        >
                          Join Waitlist
                        </span>
                      </SignUpButton>
                      <p className="text-xs text-white/80 drop-shadow">Takes ~30 seconds • No spam</p>
                    </div>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                      className={cx(
                        "shrink-0 text-white/90 drop-shadow transition-transform duration-200",
                        waitlistOpen ? "rotate-180" : "rotate-0"
                      )}
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div
              id="waitlist-panel"
              className={cx(
                "relative overflow-hidden transition-[max-height,opacity,transform] duration-500 ease-out motion-reduce:transition-none",
                waitlistOpen ? "max-h-[5000px] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-1"
              )}
            >
              {previewMode && (
                <div className="relative z-[99] mb-4 rounded-lg border border-[rgb(var(--accent))]/30 bg-[rgba(var(--accent),0.1)] px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[rgb(var(--accent))]">Preview Mode</span>
                      <span className="text-xs text-[rgb(var(--muted))]">Form is read-only</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreviewMode(false)}
                      className="text-xs font-semibold text-[rgb(var(--accent))] hover:underline"
                    >
                      Close preview
                    </button>
                  </div>
                </div>
              )}
              <form onSubmit={onSubmit} className={cx("relative z-0 mt-6 grid gap-6", previewMode ? "" : "pointer-events-none opacity-50")}>
              <fieldset disabled={previewMode} className={cx("contents", previewMode && "opacity-75")}>
              {/* Email + Username */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Email *</Label>
                  <Input
                    value={state.email}
                    onChange={(e) => dispatch({ type: "set", key: "email", value: e.target.value })}
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    error={!!errors.email}
                  />
                  {errors.email && <ErrorText>{errors.email}</ErrorText>}
                </div>

                <div>
                  <Label>Club Username *</Label>
                  <Input
                    value={state.clubUsername}
                    onChange={(e) =>
                      dispatch({ type: "set", key: "clubUsername", value: e.target.value })
                    }
                    type="text"
                    autoComplete="nickname"
                    placeholder="AndoName"
                    error={!!errors.clubUsername}
                  />
                  <p className="mt-2 text-xs text-[rgb(var(--muted))]">Used for lookup and your future profile (2–24 chars).</p>
                  {errors.clubUsername && <ErrorText>{errors.clubUsername}</ErrorText>}
                </div>
              </div>

              {/* Locality */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-1">
                  <Label>Local to Northern Nevada? *</Label>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => dispatch({ type: "set", key: "isLocal", value: true })}
                      className={cx(
                        "flex-1 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-sm transition",
                        state.isLocal
                          ? "border-transparent bg-[rgb(var(--foreground))] text-[rgb(var(--background))]"
                          : "border-[rgb(var(--border))] bg-[rgba(var(--surface),0.7)] hover:bg-[rgba(var(--foreground),0.04)]"
                      )}
                      aria-pressed={state.isLocal}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => dispatch({ type: "set", key: "isLocal", value: false })}
                      className={cx(
                        "flex-1 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-sm transition",
                        !state.isLocal
                          ? "border-transparent bg-[rgb(var(--foreground))] text-[rgb(var(--background))]"
                          : "border-[rgb(var(--border))] bg-[rgba(var(--surface),0.7)] hover:bg-[rgba(var(--foreground),0.04)]"
                      )}
                      aria-pressed={!state.isLocal}
                    >
                      No
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-1">
                  <Label>Region *</Label>
                  <Select
                    value={state.region}
                    onChange={(e) => dispatch({ type: "set", key: "region", value: e.target.value as BBRegion })}
                    error={!!errors.region}
                  >
                    {REGION_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </Select>
                  {errors.region && <ErrorText>{errors.region}</ErrorText>}
                </div>

                <div className="sm:col-span-1">
                  <Label>ZIP (optional)</Label>
                  <Input
                    value={state.zipCode}
                    onChange={(e) => dispatch({ type: "set", key: "zipCode", value: e.target.value })}
                    type="text"
                    inputMode="numeric"
                    placeholder="89501"
                    error={!!errors.zipCode}
                  />
                  {errors.zipCode && <ErrorText>{errors.zipCode}</ErrorText>}
                </div>
              </div>

              {/* Games */}
              <div>
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <Label>Games you want to play *</Label>
                    <p className="mt-1 text-xs text-[rgb(var(--muted))]">Pick up to 6. You can add more later.</p>
                  </div>
                  {errors.games && <p className="text-xs text-red-600">{errors.games}</p>}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {LAUNCH_GAMES.map((g) => {
                    const active = state.selectedGameIds.includes(g.gameId);
                    return (
                      <button
                        key={g.gameId}
                        type="button"
                        onClick={() => dispatch({ type: "toggleGame", gameId: g.gameId })}
                        disabled={previewMode}
                        className={cx(
                          "rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition",
                          active
                            ? "border-transparent bg-[rgb(var(--foreground))] text-[rgb(var(--background))]"
                            : "border-[rgb(var(--border))] bg-[rgba(var(--surface),0.7)] hover:bg-[rgba(var(--foreground),0.04)]",
                          previewMode && "opacity-60 cursor-not-allowed"
                        )}
                        aria-pressed={active}
                      >
                        {g.gameName}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => dispatch({ type: "toggleGame", gameId: "other" })}
                    disabled={previewMode}
                    className={cx(
                      "rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition",
                      state.selectedGameIds.includes("other")
                        ? "border-transparent bg-[rgb(var(--foreground))] text-[rgb(var(--background))]"
                        : "border-[rgb(var(--border))] bg-[rgba(var(--surface),0.7)] hover:bg-[rgba(var(--foreground),0.04)]",
                      previewMode && "opacity-60 cursor-not-allowed"
                    )}
                    aria-pressed={state.selectedGameIds.includes("other")}
                  >
                    Other
                  </button>
                </div>

                {state.selectedGameIds.includes("other") && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-sm text-[rgb(var(--muted))]">
                        These are games in your current rotation of play, whether singleplayer or multiplayer that you want to share with others.
                      </p>
                    </div>
                    {state.otherGames.map((game, index) => (
                      <div key={game.id} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                        <div>
                          <Label>Game name {index + 1} *</Label>
                          <Input
                            value={game.name}
                            onChange={(e) =>
                              dispatch({
                                type: "updateOtherGame",
                                index,
                                field: "name",
                                value: e.target.value,
                              })
                            }
                            placeholder="e.g., Apex Legends"
                            error={!!errors[`otherGame_${index}_name`]}
                          />
                          {errors[`otherGame_${index}_name`] && (
                            <ErrorText>{errors[`otherGame_${index}_name`]}</ErrorText>
                          )}
                        </div>
                        <div>
                          <Label>Game ID (optional)</Label>
                          <Input
                            value={game.id.startsWith("other-") ? "" : game.id}
                            onChange={(e) =>
                              dispatch({
                                type: "updateOtherGame",
                                index,
                                field: "id",
                                value: e.target.value,
                              })
                            }
                            placeholder="e.g., apex-legends"
                          />
                          <p className="mt-2 text-xs text-[rgb(var(--muted))]">
                            Slug for analytics. Auto-generated if blank.
                          </p>
                        </div>
                        {state.otherGames.length > 1 && (
                          <div className="flex items-end">
                            <button
                              type="button"
                              onClick={() => dispatch({ type: "removeOtherGame", index })}
                              disabled={previewMode}
                              className={cx(
                                "mb-2 rounded-lg border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.7)] px-3 py-2 text-xs font-semibold text-[rgb(var(--muted))] transition hover:bg-[rgba(var(--foreground),0.04)]",
                                previewMode && "opacity-60 cursor-not-allowed"
                              )}
                              aria-label="Remove game"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    {state.otherGames.length < 3 && (
                      <button
                        type="button"
                        onClick={() => dispatch({ type: "addOtherGame" })}
                        disabled={previewMode}
                        className={cx(
                          "text-sm font-semibold text-[rgb(var(--accent))] hover:underline",
                          previewMode && "opacity-60 cursor-not-allowed"
                        )}
                      >
                        + Add another game ({state.otherGames.length}/3)
                      </button>
                    )}
                    {state.otherGames.length > 0 && (
                      <p className="text-xs text-[rgb(var(--muted))]">
                        You can add up to 3 games in your rotation.
                      </p>
                    )}
                    {errors.otherGames && <ErrorText>{errors.otherGames}</ErrorText>}
                  </div>
                )}

                {/* Per-game optional quick fields */}
                <div className="mt-5 grid gap-4">
                  {selectedGames.map((g) => (
                    <div
                      key={g.gameId}
                      className="rounded-2xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.6)] p-4 shadow-sm"
                    >
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm font-semibold">{g.gameName}</p>
                        <p className="text-xs text-[rgb(var(--muted))]">Optional — helps matching & coaching</p>
                      </div>

                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        <div className="sm:col-span-1">
                          <label className="text-xs font-semibold text-[rgb(var(--muted))]">
                            Primary handle (optional)
                          </label>
                          <Input
                            value={(state.gameDetails[g.gameId]?.primaryHandle as string) || ""}
                            onChange={(e) =>
                              dispatch({
                                type: "setGameField",
                                gameId: g.gameId,
                                patch: { primaryHandle: e.target.value },
                              })
                            }
                            placeholder="In-game name"
                          />
                        </div>

                        <div className="sm:col-span-1">
                          <label className="text-xs font-semibold text-[rgb(var(--muted))]">
                            Role/style (optional)
                          </label>
                          <Input
                            value={(state.gameDetails[g.gameId]?.roleOrStyle as string) || ""}
                            onChange={(e) =>
                              dispatch({
                                type: "setGameField",
                                gameId: g.gameId,
                                patch: { roleOrStyle: e.target.value },
                              })
                            }
                            placeholder="Support / Duelist / Jungle / Flex…"
                          />
                        </div>

                        <div className="sm:col-span-1">
                          <label className="text-xs font-semibold text-[rgb(var(--muted))]">
                            Platform (optional)
                          </label>
                          <Select
                            value={(state.gameDetails[g.gameId]?.platforms?.[0] as BBPlatform) || ""}
                            onChange={(e) => {
                              const v = e.target.value as BBPlatform;
                              dispatch({
                                type: "setGameField",
                                gameId: g.gameId,
                                patch: { platforms: v ? [v] : [] },
                              });
                            }}
                          >
                            <option value="">Select…</option>
                            {PLATFORM_OPTIONS.map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Intent */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Desired membership *</Label>
                  <Select
                    value={state.desiredMembership}
                    onChange={(e) =>
                      dispatch({
                        type: "set",
                        key: "desiredMembership",
                        value: e.target.value as BBMembership,
                      })
                    }
                    error={!!errors.desiredMembership}
                  >
                    {MEMBERSHIP_OPTIONS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </Select>
                  <p className="mt-2 text-xs text-[rgb(var(--muted))]">{tierHelper}</p>
                  {errors.desiredMembership && <ErrorText>{errors.desiredMembership}</ErrorText>}
                </div>

                <div>
                  <Label>Play style *</Label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {PLAY_INTENT_OPTIONS.map((opt) => {
                      const active = state.playIntent === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => dispatch({ type: "set", key: "playIntent", value: opt })}
                          className={cx(
                            "rounded-2xl border px-4 py-3 text-sm font-semibold shadow-sm transition",
                            active
                              ? "border-transparent bg-[rgb(var(--foreground))] text-[rgb(var(--background))]"
                              : "border-[rgb(var(--border))] bg-[rgba(var(--surface),0.7)] hover:bg-[rgba(var(--foreground),0.04)]"
                          )}
                          aria-pressed={active}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {errors.playIntent && <ErrorText>{errors.playIntent}</ErrorText>}
                </div>
              </div>

              {/* Coach / Pro Track Fields */}
              {state.desiredMembership === "Coach / Leadership Track Interest" && (
                <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.6)] p-5 shadow-sm">
                  <div className="mb-4">
                    <Label>Leadership Track Games</Label>
                    <p className="mt-1 text-xs text-[rgb(var(--muted))]">
                      Select games where you want to coach, mentor, or help lead higher-trust groups.
                    </p>
                  </div>

                  {state.coachProGames.length === 0 && (
                    <div className="mb-4">
                      <Select
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            const game = selectedGames.find((g) => g.gameId === e.target.value);
                            if (game) {
                              dispatch({
                                type: "addCoachProGame",
                                gameId: game.gameId,
                                gameName: game.gameName,
                              });
                            }
                          }
                        }}
                        className="w-full"
                      >
                        <option value="">Select a game to add…</option>
                        {selectedGames
                          .filter((g) => !state.coachProGames.some((cg) => cg.gameId === g.gameId))
                          .map((g) => (
                            <option key={g.gameId} value={g.gameId}>
                              {g.gameName}
                            </option>
                          ))}
                      </Select>
                    </div>
                  )}

                  {state.coachProGames.map((cpGame, index) => (
                    <div
                      key={`${cpGame.gameId}-${index}`}
                      className="mb-4 space-y-4 rounded-xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.8)] p-4 last:mb-0"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">{cpGame.gameName}</p>
                        <button
                          type="button"
                          onClick={() => dispatch({ type: "removeCoachProGame", index })}
                          className="text-xs font-semibold text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <Label>Rank achieved *</Label>
                          <Input
                            value={cpGame.rank}
                            onChange={(e) =>
                              dispatch({
                                type: "updateCoachProGame",
                                index,
                                field: "rank",
                                value: e.target.value,
                              })
                            }
                            placeholder="e.g., Immortal 2, Diamond 1, Grandmaster"
                            error={!!errors[`coachPro_${index}_rank`]}
                          />
                          {errors[`coachPro_${index}_rank`] && (
                            <ErrorText>{errors[`coachPro_${index}_rank`]}</ErrorText>
                          )}
                        </div>

                        <div>
                          <Label>Rank proof URL *</Label>
                          <Input
                            value={cpGame.rankProofUrl}
                            onChange={(e) =>
                              dispatch({
                                type: "updateCoachProGame",
                                index,
                                field: "rankProofUrl",
                                value: e.target.value,
                              })
                            }
                            type="url"
                            placeholder="https://example.com/screenshot.jpg"
                            error={!!errors[`coachPro_${index}_rankProofUrl`]}
                          />
                          <p className="mt-2 text-xs text-[rgb(var(--muted))]">
                            Link to image/screenshot of rank or active stats showing current rank.
                          </p>
                          {errors[`coachPro_${index}_rankProofUrl`] && (
                            <ErrorText>{errors[`coachPro_${index}_rankProofUrl`]}</ErrorText>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <label className="flex items-center gap-3 text-sm">
                          <input
                            type="checkbox"
                            checked={cpGame.wantsToCoach}
                            onChange={(e) =>
                              dispatch({
                                type: "updateCoachProGame",
                                index,
                                field: "wantsToCoach",
                                value: e.target.checked,
                              })
                            }
                            className="h-4 w-4 rounded border-[rgb(var(--border))]"
                          />
                          <span className="text-[rgb(var(--muted))]">
                            I want to help other players reach my rank
                          </span>
                        </label>

                        <label className="flex items-center gap-3 text-sm">
                          <input
                            type="checkbox"
                            checked={cpGame.wantsToCompete}
                            onChange={(e) =>
                              dispatch({
                                type: "updateCoachProGame",
                                index,
                                field: "wantsToCompete",
                                value: e.target.checked,
                              })
                            }
                            className="h-4 w-4 rounded border-[rgb(var(--border))]"
                          />
                          <span className="text-[rgb(var(--muted))]">
                            I want to compete against players at my rank
                          </span>
                        </label>

                        <label className="flex items-center gap-3 text-sm">
                          <input
                            type="checkbox"
                            checked={cpGame.wantsToShowcase}
                            onChange={(e) =>
                              dispatch({
                                type: "updateCoachProGame",
                                index,
                                field: "wantsToShowcase",
                                value: e.target.checked,
                              })
                            }
                            className="h-4 w-4 rounded border-[rgb(var(--border))]"
                          />
                          <span className="text-[rgb(var(--muted))]">
                            I want to showcase my gameplay
                          </span>
                        </label>
                      </div>
                      {errors[`coachPro_${index}_goals`] && (
                        <ErrorText>{errors[`coachPro_${index}_goals`]}</ErrorText>
                      )}
                    </div>
                  ))}

                  {state.coachProGames.length > 0 &&
                    state.coachProGames.length < selectedGames.length && (
                      <div className="mt-4">
                        <Select
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              const game = selectedGames.find((g) => g.gameId === e.target.value);
                              if (game) {
                                dispatch({
                                  type: "addCoachProGame",
                                  gameId: game.gameId,
                                  gameName: game.gameName,
                                });
                              }
                            }
                          }}
                          className="w-full"
                        >
                          <option value="">+ Add another game</option>
                          {selectedGames
                            .filter((g) => !state.coachProGames.some((cg) => cg.gameId === g.gameId))
                            .map((g) => (
                              <option key={g.gameId} value={g.gameId}>
                                {g.gameName}
                              </option>
                            ))}
                        </Select>
                      </div>
                    )}
                </div>
              )}

              {/* Tier 3 Captains Queue Fields */}
              {state.desiredMembership === "Tier 3 ($5/mo) Captain Profile" && (
                <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.6)] p-5 shadow-sm">
                  <div className="mb-4">
                    <Label>Captain Queue Interest (optional)</Label>
                    <p className="mt-1 text-xs text-[rgb(var(--muted))]">
                      Select games where you want captain-led team placement and priority showcase eligibility. This helps us match you with serious stacks.
                    </p>
                  </div>

                  {state.tier2CoachingGames.length === 0 && (
                    <div className="mb-4">
                      <Select
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            const game = selectedGames.find((g) => g.gameId === e.target.value);
                            if (game) {
                              dispatch({
                                type: "addTier2CoachingGame",
                                gameId: game.gameId,
                                gameName: game.gameName,
                              });
                            }
                          }
                        }}
                        className="w-full"
                      >
                        <option value="">Select a game to add…</option>
                        {selectedGames
                          .filter((g) => !state.tier2CoachingGames.some((t2g) => t2g.gameId === g.gameId))
                          .map((g) => (
                            <option key={g.gameId} value={g.gameId}>
                              {g.gameName}
                            </option>
                          ))}
                      </Select>
                    </div>
                  )}

                  {state.tier2CoachingGames.map((t2Game, index) => (
                    <div
                      key={`${t2Game.gameId}-${index}`}
                      className="mb-4 space-y-4 rounded-xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.8)] p-4 last:mb-0"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">{t2Game.gameName}</p>
                        <button
                          type="button"
                          onClick={() => dispatch({ type: "removeTier2CoachingGame", index })}
                          className="text-xs font-semibold text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <Label>Current Rank or Elo</Label>
                          <Input
                            value={t2Game.currentRank}
                            onChange={(e) =>
                              dispatch({
                                type: "updateTier2CoachingGame",
                                index,
                                field: "currentRank",
                                value: e.target.value,
                              })
                            }
                            placeholder="e.g., Gold 2, 1200 Elo, Diamond 1"
                          />
                        </div>

                        <div>
                          <Label>Desired Rank or Elo</Label>
                          <Input
                            value={t2Game.desiredRank}
                            onChange={(e) =>
                              dispatch({
                                type: "updateTier2CoachingGame",
                                index,
                                field: "desiredRank",
                                value: e.target.value,
                              })
                            }
                            placeholder="e.g., Immortal 1, 2000 Elo, Master"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Notes (optional)</Label>
                        <Textarea
                          value={t2Game.notes}
                          onChange={(e) =>
                            dispatch({
                              type: "updateTier2CoachingGame",
                              index,
                              field: "notes",
                              value: e.target.value,
                            })
                          }
                          placeholder="Any specific areas you want to focus on, goals, or questions for captain-led teams…"
                          rows={3}
                        />
                        <p className="mt-2 text-xs text-[rgb(var(--muted))]">
                          Share any details that will help captains understand your goals and current skill level for team placement.
                        </p>
                      </div>
                    </div>
                  ))}

                  {state.tier2CoachingGames.length > 0 &&
                    state.tier2CoachingGames.length < selectedGames.length && (
                      <div className="mt-4">
                        <Select
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              const game = selectedGames.find((g) => g.gameId === e.target.value);
                              if (game) {
                                dispatch({
                                  type: "addTier2CoachingGame",
                                  gameId: game.gameId,
                                  gameName: game.gameName,
                                });
                              }
                            }
                          }}
                          className="w-full"
                        >
                          <option value="">+ Add another game</option>
                          {selectedGames
                            .filter((g) => !state.tier2CoachingGames.some((t2g) => t2g.gameId === g.gameId))
                            .map((g) => (
                              <option key={g.gameId} value={g.gameId}>
                                {g.gameName}
                              </option>
                            ))}
                        </Select>
                      </div>
                    )}
                </div>
              )}

              {/* Preferred play times */}
              <div>
                <Label>When do you usually play? *</Label>
                <p className="mt-1 text-xs text-[rgb(var(--muted))]">Pick up to 3.</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {PLAY_TIME_OPTIONS.map((t) => {
                    const active = state.preferredPlayTimes.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => dispatch({ type: "togglePlayTime", value: t })}
                        disabled={previewMode}
                        className={cx(
                          "rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition",
                          active
                            ? "border-transparent bg-[rgb(var(--foreground))] text-[rgb(var(--background))]"
                            : "border-[rgb(var(--border))] bg-[rgba(var(--surface),0.7)] hover:bg-[rgba(var(--foreground),0.04)]",
                          previewMode && "opacity-60 cursor-not-allowed"
                        )}
                        aria-pressed={active}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
                {errors.preferredPlayTimes && <ErrorText>{errors.preferredPlayTimes}</ErrorText>}

                {state.preferredPlayTimes.length > 0 && (
                  <div className="mt-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.55)] p-4 shadow-sm">
                    <p className="text-xs font-semibold text-[rgb(var(--muted))]">Typical gaming windows (optional)</p>
                    <p className="mt-1 text-xs text-[rgb(var(--muted))]">
                      Tap any blocks that match when you normally play.
                    </p>

                    <div className="mt-3 overflow-x-auto rounded-xl border border-[rgba(var(--border),0.9)] bg-[rgba(var(--surface),0.72)] shadow-sm">
                      <table className="w-full min-w-[640px] border-separate border-spacing-2 text-xs">
                        <thead className="sticky top-0">
                          <tr>
                            <th className="sticky left-0 z-10 bg-[rgba(var(--surface),0.92)] px-2 py-2 text-left font-semibold">
                              Time
                            </th>
                            {AVAILABILITY_DAYS.map((d) => (
                              <th
                                key={d}
                                className="bg-[rgba(var(--surface),0.92)] px-2 py-2 text-center font-semibold text-[rgb(var(--muted))]"
                              >
                                {d}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {AVAILABILITY_BLOCKS.map((b) => (
                            <tr key={b.id}>
                              <th className="sticky left-0 z-10 bg-[rgba(var(--surface),0.9)] px-2 py-2 text-left">
                                <p className="text-xs font-semibold">{b.label}</p>
                                <p className="text-[11px] text-[rgb(var(--muted))]">{b.range}</p>
                              </th>
                              {AVAILABILITY_DAYS.map((d) => {
                                const slot = `${d}-${b.id}`;
                                const selected = state.availabilitySlots.includes(slot);
                                return (
                                  <td key={slot} className="px-1 py-1">
                                    <button
                                      type="button"
                                      onClick={() => dispatch({ type: "toggleAvailabilitySlot", value: slot })}
                                      aria-pressed={selected}
                                      className={cx(
                                        "h-10 w-full rounded-lg border text-xs font-semibold transition",
                                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(var(--accent),0.25)]",
                                        selected
                                          ? "border-[rgba(var(--accent),0.45)] bg-[rgba(var(--accent),0.2)] text-[rgb(var(--foreground))]"
                                          : "border-[rgba(var(--border),0.85)] bg-[rgba(var(--surface),0.8)] text-[rgb(var(--muted))] hover:bg-[rgba(var(--foreground),0.04)]"
                                      )}
                                      title={formatAvailabilitySlot(slot)}
                                    >
                                      {selected ? "Selected" : ""}
                                    </button>
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <p className="text-xs text-[rgb(var(--muted))]">
                        Selected: <span className="font-semibold text-[rgb(var(--foreground))]">{state.availabilitySlots.length}</span>
                      </p>
                      <div className="ml-auto flex items-center gap-2">
                        {state.availabilitySlots.length > 0 && (
                          <button
                            type="button"
                            onClick={() => dispatch({ type: "set", key: "availabilitySlots", value: [] })}
                            className="rounded-full border border-[rgba(var(--border),0.85)] bg-[rgba(var(--surface),0.75)] px-3 py-1 text-xs font-semibold text-[rgb(var(--muted))] transition hover:bg-[rgba(var(--foreground),0.04)]"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>

                    {state.availabilitySlots.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {state.availabilitySlots
                          .slice()
                          .sort((a, b) => formatAvailabilitySlot(a).localeCompare(formatAvailabilitySlot(b)))
                          .map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => dispatch({ type: "toggleAvailabilitySlot", value: slot })}
                              className="rounded-full border border-[rgba(var(--border),0.85)] bg-[rgba(var(--surface),0.75)] px-3 py-1 text-xs font-semibold text-[rgb(var(--muted))] transition hover:bg-[rgba(var(--foreground),0.04)]"
                              title="Click to remove"
                            >
                              {formatAvailabilitySlot(slot)}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Optional section */}
              <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.55)] p-4 shadow-sm">
                <button
                  type="button"
                  onClick={() => dispatch({ type: "set", key: "showOptional", value: !state.showOptional })}
                  className="flex w-full items-center justify-between gap-3 text-left"
                >
                  <div>
                    <p className="text-sm font-semibold">Optional (recommended)</p>
                    <p className="mt-1 text-xs text-[rgb(var(--muted))]">
                      Link accounts for easier lookup + tell us if you want to mentor or help lead.
                    </p>
                  </div>
                  <span className="text-xs font-semibold">{state.showOptional ? "Hide" : "Show"}</span>
                </button>

                {state.showOptional && (
                  <div className="mt-4 grid gap-4">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div>
                        <label className="text-xs font-semibold text-[rgb(var(--muted))]">Discord username</label>
                        <Input
                          value={state.discordUsername}
                          onChange={(e) =>
                            dispatch({ type: "set", key: "discordUsername", value: e.target.value })
                          }
                          placeholder="optional"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[rgb(var(--muted))]">Steam username</label>
                        <Input
                          value={state.steamUsername}
                          onChange={(e) =>
                            dispatch({ type: "set", key: "steamUsername", value: e.target.value })
                          }
                          placeholder="optional"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[rgb(var(--muted))]">Riot ID</label>
                        <Input
                          value={state.riotUsername}
                          onChange={(e) => dispatch({ type: "set", key: "riotUsername", value: e.target.value })}
                          placeholder="Name#TAG"
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="sm:col-span-1">
                        <label className="text-xs font-semibold text-[rgb(var(--muted))]">
                          Growth track interest
                        </label>
                        <Select
                          value={state.proInterest}
                          onChange={(e) =>
                            dispatch({ type: "set", key: "proInterest", value: e.target.value as BBProInterest })
                          }
                        >
                          <option value="Yes">Yes</option>
                          <option value="Maybe">Maybe</option>
                          <option value="Not right now">Not right now</option>
                        </Select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-[rgb(var(--muted))]">Notes (optional)</label>
                        <Textarea
                          value={state.notes}
                          onChange={(e) => dispatch({ type: "set", key: "notes", value: e.target.value })}
                          placeholder="Goals, availability, preferred comm style, anything helpful…"
                          rows={3}
                          error={!!errors.notes}
                        />
                        <div className="mt-2 flex items-center justify-between text-xs text-[rgb(var(--muted))]">
                          <span>Max 300 characters.</span>
                          <span>{state.notes.length}/300</span>
                        </div>
                        {errors.notes && <ErrorText>{errors.notes}</ErrorText>}
                      </div>
                    </div>

                    <label className="flex items-center gap-3 text-sm">
                      <input
                        type="checkbox"
                        checked={state.eventInterest}
                        onChange={(e) => dispatch({ type: "set", key: "eventInterest", value: e.target.checked })}
                        className="h-4 w-4 rounded border-[rgb(var(--border))]"
                      />
                      <span className="text-[rgb(var(--muted))]">
                        Email me about in-store events, showcases, and first-wave invites.
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* Consent */}
              <div className="grid gap-3">
                <label className="flex items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={state.consentEmail}
                    onChange={(e) => dispatch({ type: "set", key: "consentEmail", value: e.target.checked })}
                    className="mt-0.5 h-4 w-4 rounded border-[rgb(var(--border))]"
                  />
                  <span className="text-[rgb(var(--muted))]">
                    I agree to receive email updates about the Ando eSports opening and first-wave invites.
                    <span className="text-red-600"> *</span>
                  </span>
                </label>
                {errors.consentEmail && <ErrorText>{errors.consentEmail}</ErrorText>}

                <label className="flex items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={state.consentPrivacy}
                    onChange={(e) => dispatch({ type: "set", key: "consentPrivacy", value: e.target.checked })}
                    className="mt-0.5 h-4 w-4 rounded border-[rgb(var(--border))]"
                  />
                  <span className="text-[rgb(var(--muted))]">
                    I acknowledge the privacy notice and agree to use of my info for waitlist + launch planning.
                    <span className="text-red-600"> *</span>
                  </span>
                </label>
                {errors.consentPrivacy && <ErrorText>{errors.consentPrivacy}</ErrorText>}
              </div>

              {/* Submit */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={submitting || previewMode}
                  className={cx(
                    "rounded-full px-6 py-3 text-sm font-semibold shadow-sm transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--accent),0.75)]",
                    submitting
                      ? "cursor-not-allowed bg-zinc-400 text-white opacity-60"
                      : "bg-[rgb(var(--foreground))] text-[rgb(var(--background))] hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                  )}
                  aria-busy={submitting}
                >
                  {submitting ? "Submitting…" : "Join Waitlist"}
                </button>

                <p className="text-xs leading-relaxed text-[rgb(var(--muted))]">
                  This is a waitlist signup. No payment is required.
                </p>
              </div>

              {/* Result */}
              {submitted && (
                <div
                  role="alert"
                  aria-live="polite"
                  className={cx(
                    "rounded-2xl border p-4 text-sm transition-all duration-200",
                    submitted.ok
                      ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200"
                      : "border-red-200 bg-red-50 text-red-900 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200"
                  )}
                >
                  <p className="font-semibold">{submitted.ok ? "Success" : "Submission failed"}</p>
                  <p className="mt-1">{submitted.message}</p>
                  {!submitted.ok && (
                    <p className="mt-2 text-xs opacity-90">
                      API expected at <code className="font-mono">POST /api/waitlist</code>.
                    </p>
                  )}
                </div>
              )}
              </fieldset>
            </form>
              
              {/* Soft Lock Overlay - Must be after form to ensure proper stacking */}
              {!previewMode && (
                <>
                  <div className="absolute inset-0 z-[100] bg-[rgb(var(--background))] pointer-events-auto" />
                  <div className="absolute inset-0 z-[101] flex items-center justify-center pointer-events-none">
                    <div className="mx-4 max-w-xl rounded-xl border border-[rgb(var(--border))] bg-[rgba(var(--surface),0.98)] px-8 py-7 text-center shadow-2xl pointer-events-auto">
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold leading-tight text-[rgb(var(--accent))]">
                            Coming Soon
                          </h3>
                          <p className="text-sm leading-relaxed text-[rgb(var(--muted))]">
                            Join our waitlist to be notified when signups open.
                          </p>
                        </div>
                        <div className="flex flex-col items-center gap-3 pt-2">
                          <SignUpButton mode="modal">
                            <span className="inline-block rounded-full bg-[rgb(var(--accent))] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(var(--accent))]/50 cursor-pointer">
                              Join Waitlist
                            </span>
                          </SignUpButton>
                          <button
                            type="button"
                            onClick={() => setPreviewMode(true)}
                            className="text-sm text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] underline-offset-4 hover:underline transition-colors"
                          >
                            Preview signup form
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
        </section>

        {/* Membership tiers */}
        <section id="tiers" className="mt-14 scroll-mt-24" aria-labelledby="tiers-heading">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="tiers-heading" className="text-2xl font-semibold tracking-tight">Memberships (coming soon)</h2>
              <p className="mt-1 text-sm text-[rgb(var(--muted))]">
                Join the waitlist now — no payment today. First wave gets the <span className="font-medium text-[rgb(var(--foreground))]">Year 1 Founder&apos;s Token</span>.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <Card>
              <p className="text-sm font-semibold">Tier 1 — Registered Local</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight">Free</p>
              <ul className="mt-4 space-y-2 text-sm text-[rgb(var(--muted))]">
                <li>• Join as a Northern Nevada player (opt-in roster)</li>
                <li>• Add your game usernames for local player lookup</li>
                <li>• Access to weekly game night schedules and events</li>
                <li>• Best for: trying it out and getting connected</li>
              </ul>
              <p className="mt-4 text-xs italic text-[rgb(var(--muted))]">
                Start here. Join weekly game nights, meet local players, and see if the community fits. No commitment required.
              </p>
            </Card>

            <Card>
              <p className="text-sm font-semibold">Tier 2 — Player Profile</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight">$3/mo</p>
              <p className="mt-2 text-xs text-[rgb(var(--muted))]">
                Season Pass: <span className="font-medium">$25/year</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-[rgb(var(--muted))]">
                <li>• Player Profile + member roster visibility (you control what you share)</li>
                <li>• SquadMatch weekly matching (moderated LFG that actually works)</li>
                <li>• Weekly scheduled game nights + priority event signup</li>
                <li>• Monthly Player Card + season recap (your progress, over time)</li>
                <li>• In-store member perks: Focus Hour, early merch drops, 5% discount</li>
              </ul>
              <p className="mt-4 text-xs italic text-[rgb(var(--muted))]">
                The standard membership tier. Get a local identity, local teammates, and weekly nights you can invite friends to.
              </p>
            </Card>

            <Card className="relative">
              <div className="absolute right-4 top-4 rounded-full bg-[rgba(var(--accent),0.15)] px-3 py-1 text-xs font-semibold">
                Limited spots
              </div>
              <p className="text-sm font-semibold">Tier 3 — Captain Profile</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight">$5/mo</p>
              <p className="mt-2 text-xs text-[rgb(var(--muted))]">
                Season Pass: <span className="font-medium">$40/year</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-[rgb(var(--muted))]">
                <li>• Everything in Tier 2</li>
                <li>• Captain Queue + priority matching (higher-trust, higher-consistency groups)</li>
                <li>• Weekly "VOD Lite" report (1 clip → 1-page plan within 48–72 hours, limited slots)</li>
                <li>• Verified Player badge + Club Standing (earnable, behavior-based trust signal)</li>
                <li>• Showcase / spotlight priority + reserved seating for watch nights</li>
                <li>• Monthly captain meetings: help shape schedules, scrims, and standards</li>
              </ul>
              <p className="mt-4 text-xs italic text-[rgb(var(--muted))]">
                The leadership tier. Better matches, more trust, and real responsibilities that make weekly nights feel like a club — not a one-off.
              </p>
          </Card>
        </div>

        {/* Simple Site Explanation - Collapsible */}
        <section className="mt-14 scroll-mt-24" aria-labelledby="site-explanation-heading">
          <Card className={cx("relative", howItWorksOpen ? "p-6 sm:p-8" : "rounded-2xl p-4 sm:p-5")}>
            <div
              className={cx(
                "relative overflow-hidden",
                howItWorksOpen
                  ? "-mx-6 -mt-6 mb-5 rounded-t-3xl sm:-mx-8 sm:-mt-8"
                  : "-m-4 rounded-2xl sm:-m-5"
              )}
            >
              <div className="pointer-events-none absolute inset-0">
                <Image
                  src="/images/abstract_color_banner.jpg"
                  alt=""
                  fill
                  priority={false}
                  sizes="(max-width: 1024px) 92vw, 960px"
                  className="object-cover opacity-65"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/55 via-black/20 to-transparent" />
              </div>

              <div
                onClick={() => setHowItWorksOpen((v) => !v)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setHowItWorksOpen((v) => !v);
                  }
                }}
                aria-expanded={howItWorksOpen}
                aria-controls="site-explanation-panel"
                className={cx(
                  "relative z-10 w-full text-left cursor-pointer",
                  howItWorksOpen ? "px-6 pb-5 pt-6 sm:px-8 sm:pb-6 sm:pt-8" : "p-4 sm:p-5"
                )}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 id="site-explanation-heading" className="text-2xl font-semibold tracking-tight text-white drop-shadow">
                      How Ando eSports Works
                    </h2>
                    <p className="mt-1 text-sm text-white/85 drop-shadow">
                      Simple steps for players and partners to get started with your local gaming community.
                    </p>
                  </div>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    className={cx(
                      "shrink-0 text-white/90 drop-shadow transition-transform duration-200",
                      howItWorksOpen ? "rotate-180" : "rotate-0"
                    )}
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div
              id="site-explanation-panel"
              className={cx(
                "relative overflow-hidden transition-[max-height,opacity,transform] duration-500 ease-out motion-reduce:transition-none",
                howItWorksOpen ? "max-h-[3000px] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-1"
              )}
            >
              <div className="mt-6 space-y-8">
                {/* For Players */}
                <div>
                  <h3 className="text-lg font-semibold text-[rgb(var(--accent))] mb-4">For Players & Locals</h3>
                  <div className="grid gap-6 md:grid-cols-3">
                    {[
                      {
                        step: "1",
                        title: "Join the Waitlist",
                        description: "Sign up for free with no payment required. First wave members get exclusive access, voting rights on community choice games, and a Year 1 Founder's Token that doubles as your esports league badge and player ID.",
                        icon: (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[rgb(var(--accent))]">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ),
                      },
                      {
                        step: "2",
                        title: "Select Your Games",
                        description: "Choose from our Year 1 Launch Games catalog or add your own games. All games are welcome and recognized in our community. Community choice slots are voted on by First Wave members.",
                        icon: (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[rgb(var(--accent))]">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ),
                      },
                      {
                        step: "3",
                        title: "Connect & Play",
                        description: "Find local teammates through SquadMatch, join weekly scheduled game nights, participate in community events and tournaments, and build consistent gaming habits with your squad.",
                        icon: (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[rgb(var(--accent))]">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ),
                      },
                    ].map((item) => (
                      <div key={item.step} className="flex flex-col items-start">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgba(var(--accent),0.1)] border border-[rgb(var(--accent))]">
                            <span className="text-lg font-semibold text-[rgb(var(--accent))]">{item.step}</span>
                          </div>
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgba(var(--surface),0.7)]">
                            {item.icon}
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                        <p className="text-sm leading-6 text-[rgb(var(--muted))]">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* For Partners */}
                <div className="pt-6 border-t border-[rgb(var(--border))]">
                  <h3 className="text-lg font-semibold text-[rgb(var(--accent))] mb-4">For Organizations & Institutions</h3>
                  <div className="grid gap-6 md:grid-cols-3">
                    {[
                      {
                        step: "1",
                        title: "Contact & Partnership",
                        description: "Reach out to discuss your esports program needs. We provide tournament hosting, bracket organization, and esports infrastructure for schools and organizations in your region.",
                        icon: (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[rgb(var(--accent))]">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ),
                      },
                      {
                        step: "2",
                        title: "Program Setup",
                        description: "We help establish structured esports programs with team rostering, coaching support, and digital player signups. We assist with recruitment at school events and provide team management tools.",
                        icon: (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[rgb(var(--accent))]">
                            <path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ),
                      },
                      {
                        step: "3",
                        title: "Tournament & Event Hosting",
                        description: "We organize and host tournaments like the Varsity Invitational and Collegiate Invitational, providing structured brackets, prize pools, and pathways for student growth through competitive play.",
                        icon: (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[rgb(var(--accent))]">
                            <path d="M6 9H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V11a2 2 0 0 0-2-2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <rect x="6" y="1" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ),
                      },
                    ].map((item) => (
                      <div key={item.step} className="flex flex-col items-start">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgba(var(--accent),0.1)] border border-[rgb(var(--accent))]">
                            <span className="text-lg font-semibold text-[rgb(var(--accent))]">{item.step}</span>
                          </div>
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgba(var(--surface),0.7)]">
                            {item.icon}
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                        <p className="text-sm leading-6 text-[rgb(var(--muted))]">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

          {/* How It Works */}
          <div className="mt-10">
            <Card className="p-6 sm:p-8">
              <h3 className="mb-6 text-lg font-semibold text-[rgb(var(--accent))]">
                How it works
              </h3>
              
              <div className="space-y-8">
                {/* Individual Memberships */}
                <div>
                  <h4 className="mb-4 text-base font-semibold">Individual Memberships</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="mb-1.5 text-sm font-semibold">Tier 1 — Registered Local (Free)</p>
                      <p className="text-xs leading-5 text-[rgb(var(--muted))]">
                        Join the community and attend weekly game nights. Add your game usernames so local players can find you. Perfect for trying it out.
                      </p>
                    </div>
                    <div>
                      <p className="mb-1.5 text-sm font-semibold">Tier 2 — Player Profile ($3/mo)</p>
                      <p className="text-xs leading-5 text-[rgb(var(--muted))]">
                        Get a real member profile. SquadMatch pairs you weekly, you RSVP into scheduled game nights, and your Player Card tracks progress through the season. Season Pass: $25/year.
                      </p>
                    </div>
                    <div>
                      <p className="mb-1.5 text-sm font-semibold">Tier 3 — Captain Profile ($5/mo)</p>
                      <p className="text-xs leading-5 text-[rgb(var(--muted))]">
                        For leaders and consistent groups. Priority matching, Verified Player/Standing signals, VOD Lite reports, and captain-led nights that friends can plan around. Season Pass: $40/year.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Regional Circuits & Leagues */}
                <div className="border-t border-[rgb(var(--border))] pt-6">
                  <h4 className="mb-4 text-base font-semibold">Regional Circuits & Esports Programs</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="mb-2 text-sm font-semibold">Seasonal League Format</p>
                      <p className="mb-3 text-xs leading-5 text-[rgb(var(--muted))]">
                        Our regional circuits use a two-phase seasonal format designed to maximize competitive play and team development:
                      </p>
                      <div className="space-y-3 pl-4 border-l-2 border-[rgba(var(--accent),0.2)]">
                        <div>
                          <p className="mb-1 text-xs font-semibold text-[rgb(var(--accent))]">Phase 1: Round Robin (Regular Season)</p>
                          <p className="text-xs leading-5 text-[rgb(var(--muted))]">
                            All teams play each other once during the regular season. This ensures every team faces every opponent, providing comprehensive rankings and fair competition. Teams accumulate wins and losses to determine seeding for playoffs.
                          </p>
                        </div>
                        <div>
                          <p className="mb-1 text-xs font-semibold text-[rgb(var(--accent))]">Phase 2: Group Stage (Playoffs)</p>
                          <p className="text-xs leading-5 text-[rgb(var(--muted))]">
                            Top teams from the regular season advance to group stage playoffs. Teams are divided into groups where each team plays every other team in their group. Top teams from each group advance to the final bracket, providing recovery opportunities—teams can lose a match and still advance.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-semibold">Program Examples</p>
                      <p className="text-xs leading-5 text-[rgb(var(--muted))]">
                        We host structured esports programs for schools and organizations, including the Varsity Invitational and Collegiate Invitational tournaments. These events feature structured brackets, prize pools, and pathways for student growth through competitive play. Programs integrate seamlessly with school schedules as extracurricular activities or regularly scheduled programs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Culture & Standards */}
          <div className="mt-6">
            <Card className="p-6 sm:p-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-[rgb(var(--accent))]">
                    Culture (non-negotiable)
                  </h3>
                  <ul className="space-y-2 text-sm text-[rgb(var(--muted))]">
                    <li>• Respect, teamwork, no harassment, no hate speech</li>
                    <li>• No cheating, threats, or repeated rage behavior</li>
                    <li>• 3-strike policy: third strike = permanent removal</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-[rgb(var(--accent))]">
                    Team Captains
                  </h3>
                  <p className="text-sm leading-6 text-[rgb(var(--muted))]">
                    Team Captains are Tier 3 members who host weekly game nights, help match players into teams, and maintain our welcoming culture. Verified Player and Club Standing signals help keep the community high-trust and low-tox.
                  </p>
                  <p className="mt-3 text-xs text-[rgb(var(--muted))]">
                    No food/drink. We win with programming, community infrastructure, and recurring membership.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-14 scroll-mt-24" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight">FAQ</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {[
              {
                q: "Is the club open yet?",
                a: "Not yet — Ando eSports is coming soon. The waitlist helps us organize weekly game nights and build teams for day one.",
              },
              {
                q: "Does joining cost anything?",
                a: "No. This page is a waitlist only. You'll be invited when we open first-wave access.",
              },
              {
                q: "Do I need to be good to join?",
                a: "No. All skill levels are welcome. Respect is required.",
              },
              {
                q: "How does Tier 2 matchmaking work?",
                a: "Tier 2 members fill out a weekly SquadMatch form (games, role/style, availability, intent). We publish matches and suggested squads, then you meet up at scheduled club nights. Your monthly Player Card tracks progress over time.",
              },
              {
                q: "What do Team Captains do?",
                a: "Team Captains are Tier 3 members who host weekly nights, run higher-trust queues, and help place members into consistent groups. They meet monthly with staff to plan schedules and keep standards clear and fair.",
              },
              {
                q: "What's the culture policy?",
                a: "We run a clear code of conduct and a 3-strike policy. Club teammates are your team — even in friendly scrims and exhibitions.",
              },
            ].map((item) => (
              <Card key={item.q} className="transition-all duration-200 hover:shadow-md hover:border-[rgba(var(--accent),0.3)]">
                <h3 className="text-sm font-semibold text-[rgb(var(--accent))]">
                  {item.q}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">{item.a}</p>
              </Card>
            ))}
          </div>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}
