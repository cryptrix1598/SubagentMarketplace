import { z } from "zod";

export const agentPublishSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(128, "Slug must be at most 128 characters")
    .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, "Slug must be lowercase alphanumeric with dashes"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be at most 500 characters"),
  longDescription: z.string().max(10000).optional(),
  category: z.enum([
    "coding",
    "testing",
    "devops",
    "frontend",
    "backend",
    "database",
    "security",
    "documentation",
    "productivity",
    "data",
    "ai-ml",
    "design",
    "marketing",
    "finance",
    "other",
  ]),
  tags: z
    .array(z.string().max(50))
    .min(1, "At least one tag is required")
    .max(15, "Maximum 15 tags allowed"),
  license: z.enum(["MIT", "Apache-2.0", "GPL-3.0", "BSD-3-Clause", "ISC", "Unlicense", "Proprietary"]),
  version: z.string().regex(/^\d+\.\d+\.\d+(-[\w.]+)?$/, "Must be valid semver"),
  readme: z.string().max(100000).optional(),
  installationInstructions: z.string().max(5000).optional(),
  isPublic: z.boolean().default(true),
});

export type AgentPublishInput = z.infer<typeof agentPublishSchema>;

export const agentVersionSchema = z.object({
  version: z.string().regex(/^\d+\.\d+\.\d+(-[\w.]+)?$/, "Must be valid semver"),
  changelog: z.string().max(10000).optional(),
});

export type AgentVersionInput = z.infer<typeof agentVersionSchema>;

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(5000).optional(),
});

export type ReviewInput = z.infer<typeof reviewSchema>;

export const profileSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(39, "Username must be at most 39 characters")
    .regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, "Username must be lowercase alphanumeric with dashes"),
  bio: z.string().max(500).optional(),
  website: z.string().url().optional().or(z.literal("")),
  github: z.string().max(100).optional(),
  twitter: z.string().max(100).optional(),
  location: z.string().max(100).optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;

export const organizationSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z
    .string()
    .min(2)
    .max(128)
    .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, "Slug must be lowercase alphanumeric with dashes"),
  description: z.string().max(500).optional(),
  website: z.string().url().optional().or(z.literal("")),
});

export type OrganizationInput = z.infer<typeof organizationSchema>;

export const collectionSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  visibility: z.enum(["public", "private"]).default("public"),
  agentIds: z.array(z.string()).min(1).max(100),
});

export type CollectionInput = z.infer<typeof collectionSchema>;

export const bundleSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z
    .string()
    .min(2)
    .max(128)
    .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, "Slug must be lowercase alphanumeric with dashes"),
  description: z.string().min(10).max(500),
  agentIds: z.array(z.string()).min(2, "Bundle must contain at least 2 agents").max(20),
  isPublic: z.boolean().default(true),
});

export type BundleInput = z.infer<typeof bundleSchema>;

export const searchSchema = z.object({
  query: z.string().max(200),
  type: z.enum(["agents", "users", "collections", "all"]).default("agents"),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  category: z.string().optional(),
  tags: z.array(z.string()).max(10).optional(),
  sort: z
    .enum(["trending", "newest", "popular", "most-downloaded", "most-starred", "recently-updated"])
    .default("trending"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(24),
  verifiedOnly: z.boolean().default(false),
});

export type SearchInput = z.infer<typeof searchSchema>;

export const emailVerificationSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const passwordResetSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const newPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const signUpSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100),
    username: z
      .string()
      .min(3)
      .max(39)
      .regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });