/**
 * POST /api/waitlist
 * Validates waitlist submissions and stores them in `.data/waitlist.ndjson`.
 * Required: email, clubUsername, locality, games[1-6], preferredPlayTimes[1-3], consent.
 * Optional: desiredMembership, playIntent, marketingAttribution, connectedUsernames, proInterest, eventInterest, notes (<=300 chars).
 */
import { appendLead } from "../_shared/leadStore";
import { createErrorResponse, createSuccessResponse, ErrorCode, withErrorHandling } from "../_shared/errors";
import { logger } from "../_shared/logger";

type WaitlistPayload = {
  email?: unknown;
  clubUsername?: unknown;
  locality?: unknown;
  games?: unknown;
  desiredMembership?: unknown;
  playIntent?: unknown;
  preferredPlayTimes?: unknown;
  consent?: unknown;
  marketingAttribution?: unknown;
  connectedUsernames?: unknown;
  proInterest?: unknown;
  eventInterest?: unknown;
  notes?: unknown;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CLUB_USERNAME_REGEX = /^[A-Za-z0-9][A-Za-z0-9 _\-\.]{0,22}[A-Za-z0-9]$/;

async function handlePOST(req: Request): Promise<Response> {
  // Validate request method
  if (req.method !== "POST") {
    return createErrorResponse("Method not allowed", ErrorCode.INVALID_INPUT, 405);
  }

  // Parse and validate JSON
  let body: WaitlistPayload | null = null;
  try {
    body = (await req.json()) as WaitlistPayload;
  } catch (error) {
    logger.warn("Invalid JSON in waitlist request", { error });
    return createErrorResponse("Invalid JSON.", ErrorCode.INVALID_INPUT);
  }

  // Extract and sanitize fields
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const clubUsername = typeof body?.clubUsername === "string" ? body.clubUsername.trim() : "";
  const notes = typeof body?.notes === "string" ? body.notes.trim() : "";

  // Validate required fields
  if (!email) {
    return createErrorResponse("Email is required.", ErrorCode.VALIDATION_ERROR);
  }
  if (!EMAIL_REGEX.test(email)) {
    return createErrorResponse("Enter a valid email.", ErrorCode.VALIDATION_ERROR);
  }

  if (!clubUsername) {
    return createErrorResponse("Club username is required.", ErrorCode.VALIDATION_ERROR);
  }
  if (!CLUB_USERNAME_REGEX.test(clubUsername)) {
    return createErrorResponse("Club username format is invalid.", ErrorCode.VALIDATION_ERROR);
  }

  if (!body?.locality || typeof body.locality !== "object") {
    return createErrorResponse("Locality is required.", ErrorCode.VALIDATION_ERROR);
  }
  if (!Array.isArray(body?.games) || body.games.length < 1 || body.games.length > 6) {
    return createErrorResponse("Games must be 1–6 items.", ErrorCode.VALIDATION_ERROR);
  }
  if (!Array.isArray(body?.preferredPlayTimes) || body.preferredPlayTimes.length < 1 || body.preferredPlayTimes.length > 3) {
    return createErrorResponse("Preferred play times must be 1–3 items.", ErrorCode.VALIDATION_ERROR);
  }
  if (!body?.consent || typeof body.consent !== "object") {
    return createErrorResponse("Consent is required.", ErrorCode.VALIDATION_ERROR);
  }

  if (notes.length > 300) {
    return createErrorResponse("Keep notes under 300 characters.", ErrorCode.VALIDATION_ERROR);
  }

  // Store lead
  const stored = await appendLead("waitlist", body);
  
  if (!stored.persisted) {
    logger.warn("Failed to persist waitlist submission", { email: email.substring(0, 3) + "***" });
  } else {
    logger.info("Waitlist submission received", { email: email.substring(0, 3) + "***" });
  }

  return createSuccessResponse("Received.", { persisted: stored.persisted });
}

// Export wrapped handler with error handling
export const POST = withErrorHandling(handlePOST);


