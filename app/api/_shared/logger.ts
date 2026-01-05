/**
 * Structured logger for API routes and server code.
 * Uses console output; can be extended to external providers.
 */

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  info(message: string, context?: LogContext): void {
    this.log("info", message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log("warn", message, context);
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext: LogContext = {
      ...context,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined,
      } : String(error),
    };
    this.log("error", message, errorContext);
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      this.log("debug", message, context);
    }
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...context,
    };

    // In production, you might want to send to a logging service
    // For now, we use console with appropriate methods
    switch (level) {
      case "error":
        console.error(JSON.stringify(logEntry, null, this.isDevelopment ? 2 : 0));
        break;
      case "warn":
        console.warn(JSON.stringify(logEntry, null, this.isDevelopment ? 2 : 0));
        break;
      case "debug":
        console.debug(JSON.stringify(logEntry, null, 2));
        break;
      default:
        console.log(JSON.stringify(logEntry, null, this.isDevelopment ? 2 : 0));
    }
  }
}

/**
 * Singleton logger instance
 */
export const logger = new Logger();

