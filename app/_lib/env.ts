/**
 * Environment variable accessors.
 * Validates required keys for Clerk and site metadata with concise errors.
 */

export const env = {
  // Clerk Authentication
  clerk: {
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "",
    secretKey: process.env.CLERK_SECRET_KEY || "",
  },
  
  // Node Environment
  nodeEnv: process.env.NODE_ENV || "development",
  
  // Site URL (for metadata, redirects, etc.)
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://ando.gg",
} as const;

/**
 * Validates required environment variables and throws in production if missing.
 * In development it logs a warning so local setup can continue.
 */
export function validateEnv(): void {
  const missing: string[] = [];

  if (!env.clerk.publishableKey) {
    missing.push("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY");
  }

  if (!env.clerk.secretKey && process.env.NODE_ENV !== "development") {
    // Secret key not required in development (for local testing)
    missing.push("CLERK_SECRET_KEY");
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` +
      "Please check your .env.local file or environment configuration."
    );
  }
}

// Validate in development and production (but allow missing secret in dev)
if (process.env.NODE_ENV !== "test") {
  try {
    validateEnv();
  } catch (error) {
    // Only throw in production
    if (process.env.NODE_ENV === "production") {
      throw error;
    }
    // In development, just warn
    console.warn("Environment validation warning:", error instanceof Error ? error.message : String(error));
  }
}

