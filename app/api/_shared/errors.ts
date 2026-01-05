/**
 * Error utilities for API routes.
 * Provides typed success/error payloads and a wrapper for consistent handling.
 */

export interface ApiErrorResponse {
  ok: false;
  message: string;
  code?: string;
}

export interface ApiSuccessResponse<T = unknown> {
  ok: true;
  message: string;
  data?: T;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export enum ErrorCode {
  INVALID_INPUT = "INVALID_INPUT",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  STORAGE_ERROR = "STORAGE_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  RATE_LIMIT = "RATE_LIMIT",
}

export function createErrorResponse(
  message: string,
  code?: ErrorCode,
  status: number = 400
): Response {
  const body: ApiErrorResponse = {
    ok: false,
    message,
    ...(code && { code }),
  };
  return Response.json(body, { status });
}

export function createSuccessResponse<T>(
  message: string,
  data?: T,
  status: number = 200
): Response {
  const body: ApiSuccessResponse<T> = {
    ok: true,
    message,
    ...(data !== undefined && { data }),
  };
  return Response.json(body, { status });
}

export function withErrorHandling(
  handler: (req: Request) => Promise<Response>
): (req: Request) => Promise<Response> {
  return async (req: Request): Promise<Response> => {
    try {
      return await handler(req);
    } catch (error) {
      // Log error for debugging
      const { logger } = await import("./logger");
      logger.error("Unhandled error in API route", error, {
        path: req.url,
        method: req.method,
      });

      // Return generic error response (don't leak internal details)
      return createErrorResponse(
        "An unexpected error occurred. Please try again later.",
        ErrorCode.INTERNAL_ERROR,
        500
      );
    }
  };
}

