import { describe, it, expect } from "vitest";
import {
  agentPublishSchema,
  reviewSchema,
  profileSchema,
  organizationSchema,
  bundleSchema,
  searchSchema,
  signUpSchema,
  signInSchema,
} from "@/lib/validations";

describe("agentPublishSchema", () => {
  const validAgent = {
    name: "Test Agent",
    slug: "test-agent",
    description: "A test agent for validation testing purposes",
    category: "coding" as const,
    tags: ["test", "agent"],
    license: "MIT" as const,
    version: "1.0.0",
  };

  it("validates a correct agent", () => {
    const result = agentPublishSchema.safeParse(validAgent);
    expect(result.success).toBe(true);
  });

  it("rejects short name", () => {
    const result = agentPublishSchema.safeParse({ ...validAgent, name: "A" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid slug format", () => {
    const result = agentPublishSchema.safeParse({ ...validAgent, slug: "INVALID" });
    expect(result.success).toBe(false);
  });

  it("rejects short description", () => {
    const result = agentPublishSchema.safeParse({ ...validAgent, description: "Too short" });
    expect(result.success).toBe(false);
  });

  it("rejects empty tags", () => {
    const result = agentPublishSchema.safeParse({ ...validAgent, tags: [] });
    expect(result.success).toBe(false);
  });

  it("rejects too many tags", () => {
    const result = agentPublishSchema.safeParse({
      ...validAgent,
      tags: Array.from({ length: 20 }, (_, i) => `tag${i}`),
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid version format", () => {
    const result = agentPublishSchema.safeParse({ ...validAgent, version: "1.0" });
    expect(result.success).toBe(false);
  });

  it("accepts valid semver with prerelease", () => {
    const result = agentPublishSchema.safeParse({ ...validAgent, version: "1.0.0-beta.1" });
    expect(result.success).toBe(true);
  });
});

describe("reviewSchema", () => {
  it("validates a correct review", () => {
    const result = reviewSchema.safeParse({ rating: 5, comment: "Great agent!" });
    expect(result.success).toBe(true);
  });

  it("rejects rating below 1", () => {
    const result = reviewSchema.safeParse({ rating: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects rating above 5", () => {
    const result = reviewSchema.safeParse({ rating: 6 });
    expect(result.success).toBe(false);
  });

  it("accepts review without comment", () => {
    const result = reviewSchema.safeParse({ rating: 3 });
    expect(result.success).toBe(true);
  });
});

describe("profileSchema", () => {
  it("validates a correct profile", () => {
    const result = profileSchema.safeParse({
      username: "janedoe",
      displayName: "Jane Doe",
      bio: "Software engineer",
    });
    expect(result.success).toBe(true);
  });

  it("rejects short username", () => {
    const result = profileSchema.safeParse({ username: "ab" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid username format", () => {
    const result = profileSchema.safeParse({ username: "INVALID_USERNAME" });
    expect(result.success).toBe(false);
  });
});

describe("bundleSchema", () => {
  it("validates a correct bundle", () => {
    const result = bundleSchema.safeParse({
      name: "My Bundle",
      slug: "my-bundle",
      description: "A test bundle with multiple agents for validation",
      agentIds: ["id1", "id2"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects bundle with fewer than 2 agents", () => {
    const result = bundleSchema.safeParse({
      name: "My Bundle",
      slug: "my-bundle",
      description: "A test bundle with multiple agents for validation",
      agentIds: ["id1"],
    });
    expect(result.success).toBe(false);
  });
});

describe("signUpSchema", () => {
  it("validates correct sign up", () => {
    const result = signUpSchema.safeParse({
      name: "Jane Doe",
      username: "janedoe",
      email: "jane@example.com",
      password: "Password1",
      confirmPassword: "Password1",
    });
    expect(result.success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = signUpSchema.safeParse({
      name: "Jane Doe",
      username: "janedoe",
      email: "jane@example.com",
      password: "Password1",
      confirmPassword: "Password2",
    });
    expect(result.success).toBe(false);
  });

  it("rejects weak password", () => {
    const result = signUpSchema.safeParse({
      name: "Jane Doe",
      username: "janedoe",
      email: "jane@example.com",
      password: "password",
      confirmPassword: "password",
    });
    expect(result.success).toBe(false);
  });
});

describe("searchSchema", () => {
  it("validates with defaults", () => {
    const result = searchSchema.safeParse({ query: "test" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.sort).toBe("trending");
      expect(result.data.page).toBe(1);
    }
  });

  it("coerces page to number", () => {
    const result = searchSchema.safeParse({ query: "test", page: "3" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(3);
    }
  });
});