export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(
      `${resource}${id ? ` with id ${id}` : ""} not found`,
      "NOT_FOUND",
      404,
    );
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "You must be logged in to perform this action") {
    super(message, "UNAUTHORIZED", 401);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You do not have permission to perform this action") {
    super(message, "FORBIDDEN", 403);
    this.name = "ForbiddenError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, "VALIDATION_ERROR", 400, details);
    this.name = "ValidationError";
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Rate limit exceeded. Please try again later.") {
    super(message, "RATE_LIMIT_EXCEEDED", 429);
    this.name = "RateLimitError";
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, "CONFLICT", 409);
    this.name = "ConflictError";
  }
}

export function getErrorCode(error: unknown): string {
  if (error instanceof AppError) return error.code;
  return "INTERNAL_ERROR";
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) return error.message;
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}

export function getErrorStatusCode(error: unknown): number {
  if (error instanceof AppError) return error.statusCode;
  return 500;
}