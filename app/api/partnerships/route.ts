/**
 * POST /api/partnerships
 * Validates partnership inquiries and stores them in `.data/partnerships.ndjson`.
 * Required: email. Optional: notes (<=1000 chars).
 */
import { appendLead } from "../_shared/leadStore";
import { createErrorResponse, createSuccessResponse, ErrorCode, withErrorHandling } from "../_shared/errors";
import { logger } from "../_shared/logger";

type PartnershipsPayload = {
  email?: unknown;
  notes?: unknown;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function handlePOST(req: Request): Promise<Response> {
  // Validate request method
  if (req.method !== "POST") {
    return createErrorResponse("Method not allowed", ErrorCode.INVALID_INPUT, 405);
  }

  // Parse and validate JSON
  let body: PartnershipsPayload | null = null;
  try {
    body = (await req.json()) as PartnershipsPayload;
  } catch (error) {
    logger.warn("Invalid JSON in partnerships request", { error });
    return createErrorResponse("Invalid JSON.", ErrorCode.INVALID_INPUT);
  }

  // Extract and sanitize fields
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const notes = typeof body?.notes === "string" ? body.notes.trim() : "";

  // Validate required fields
  if (!email) {
    return createErrorResponse("Email is required.", ErrorCode.VALIDATION_ERROR);
  }
  if (!EMAIL_REGEX.test(email)) {
    return createErrorResponse("Enter a valid email.", ErrorCode.VALIDATION_ERROR);
  }
  if (notes.length > 1000) {
    return createErrorResponse("Keep notes under 1000 characters.", ErrorCode.VALIDATION_ERROR);
  }

  // Store lead
  const stored = await appendLead("partnerships", { email, notes });
  
  if (!stored.persisted) {
    logger.warn("Failed to persist partnership inquiry", { email: email.substring(0, 3) + "***" });
  } else {
    logger.info("Partnership inquiry received", { email: email.substring(0, 3) + "***" });
  }

  return createSuccessResponse("Received. We will reach out as soon as possible.", { persisted: stored.persisted });
}

// Export wrapped handler with error handling
export const POST = withErrorHandling(handlePOST);


