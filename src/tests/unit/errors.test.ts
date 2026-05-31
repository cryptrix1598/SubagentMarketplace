import { describe, it, expect } from "vitest";
import {
  AppError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ValidationError,
  RateLimitError,
  ConflictError,
} from "@/lib/errors";

describe("Custom Errors", () => {
  describe("AppError", () => {
    it("should create an error with message and statusCode", () => {
      const error = new AppError("Test error", "TEST_ERROR", 500);
      expect(error.message).toBe("Test error");
      expect(error.code).toBe("TEST_ERROR");
      expect(error.statusCode).toBe(500);
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
    });
  });

  describe("NotFoundError", () => {
    it("should create a 404 error", () => {
      const error = new NotFoundError("Agent not found");
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe("Agent not found");
      expect(error).toBeInstanceOf(AppError);
    });
  });

  describe("UnauthorizedError", () => {
    it("should create a 401 error", () => {
      const error = new UnauthorizedError();
      expect(error.statusCode).toBe(401);
      expect(error).toBeInstanceOf(AppError);
    });
  });

  describe("ForbiddenError", () => {
    it("should create a 403 error", () => {
      const error = new ForbiddenError("Not allowed");
      expect(error.statusCode).toBe(403);
      expect(error.message).toBe("Not allowed");
    });
  });

  describe("ValidationError", () => {
    it("should create a 400 error with details", () => {
      const details = [{ field: "name", message: "Required" }];
      const error = new ValidationError("Validation failed", details);
      expect(error.statusCode).toBe(400);
      expect(error.details).toEqual(details);
    });
  });

  describe("RateLimitError", () => {
    it("should create a 429 error", () => {
      const error = new RateLimitError("Too many requests");
      expect(error.statusCode).toBe(429);
      expect(error.message).toBe("Too many requests");
    });
  });

  describe("ConflictError", () => {
    it("should create a 409 error", () => {
      const error = new ConflictError("Already exists");
      expect(error.statusCode).toBe(409);
      expect(error.message).toBe("Already exists");
    });
  });
});
