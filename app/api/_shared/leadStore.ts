/**
 * NDJSON file storage for leads (waitlist, partnerships, etc).
 * Writes one JSON line per entry to `.data/<name>.ndjson`, creating the directory if needed.
 */
import { mkdir, appendFile } from "node:fs/promises";
import path from "node:path";

export type LeadStoreResult = { persisted: boolean };

/**
 * Appends a JSON payload as a single NDJSON line to `.data/<name>.ndjson`.
 * Creates the directory if missing and degrades gracefully when FS is not writable.
 * @param name filename-safe identifier (letters/numbers/underscore/dash)
 * @param payload JSON-serializable content to persist
 */
/** Lazy-loaded logger to avoid circular dependencies */
let loggerInstance: typeof import("./logger").logger | null = null;

async function getLogger() {
  if (!loggerInstance) {
    loggerInstance = (await import("./logger")).logger;
  }
  return loggerInstance;
}

export async function appendLead(name: string, payload: unknown): Promise<LeadStoreResult> {
  // Validate filename to prevent directory traversal
  if (!/^[a-z0-9_-]+$/.test(name)) {
    const logger = await getLogger();
    logger.warn("Invalid lead store name", { name });
    return { persisted: false };
  }

  try {
    const dir = path.join(process.cwd(), ".data");
    await mkdir(dir, { recursive: true });
    const filePath = path.join(dir, `${name}.ndjson`);
    
    // Validate payload can be serialized
    let serialized: string;
    try {
      serialized = JSON.stringify({ receivedAt: new Date().toISOString(), payload }) + "\n";
    } catch (serializeError) {
      const logger = await getLogger();
      logger.error("Failed to serialize lead payload", serializeError, { name });
      return { persisted: false };
    }
    
    await appendFile(filePath, serialized, { encoding: "utf8" });
    return { persisted: true };
  } catch (error) {
    // Log error but don't throw - graceful degradation
    const logger = await getLogger();
    logger.error("Failed to persist lead", error, { name });
    return { persisted: false };
  }
}


