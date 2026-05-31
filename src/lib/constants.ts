export const APP_NAME = "Claude Agent Hub";
export const APP_DESCRIPTION =
  "The marketplace, registry, and package manager for Claude Code subagents";
export const APP_URL = process.env["NEXT_PUBLIC_APP_URL"] || "https://claudeagenthub.dev";

export const CATEGORY_VALUES = [
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
] as const;

export type Category = (typeof CATEGORY_VALUES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  coding: "Coding",
  testing: "Testing",
  devops: "DevOps",
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
  security: "Security",
  documentation: "Documentation",
  productivity: "Productivity",
  data: "Data",
  "ai-ml": "AI & ML",
  design: "Design",
  marketing: "Marketing",
  finance: "Finance",
  other: "Other",
};

export const CATEGORY_ICONS: Record<Category, string> = {
  coding: "Code2",
  testing: "TestTube2",
  devops: "Server",
  frontend: "Layout",
  backend: "Database",
  database: "HardDrive",
  security: "Shield",
  documentation: "FileText",
  productivity: "Zap",
  data: "BarChart3",
  "ai-ml": "Brain",
  design: "Palette",
  marketing: "Megaphone",
  finance: "DollarSign",
  other: "Package",
};

export const CATEGORIES = CATEGORY_VALUES.map((value) => ({
  value,
  label: CATEGORY_LABELS[value],
  icon: CATEGORY_ICONS[value],
}));

export const LICENSES = [
  { value: "MIT", label: "MIT" },
  { value: "Apache-2.0", label: "Apache 2.0" },
  { value: "GPL-3.0", label: "GPL 3.0" },
  { value: "BSD-3-Clause", label: "BSD 3-Clause" },
  { value: "ISC", label: "ISC" },
  { value: "Unlicense", label: "Unlicense" },
  { value: "Proprietary", label: "Proprietary" },
];

export const ORG_ROLES = ["owner", "admin", "maintainer", "member"] as const;
export type OrgRole = (typeof ORG_ROLES)[number];

export const AGENT_FILE_MAX_SIZE = 5 * 1024 * 1024; // 5MB
export const AGENT_TOTAL_MAX_SIZE = 50 * 1024 * 1024; // 50MB
export const SCREENSHOT_MAX_SIZE = 10 * 1024 * 1024; // 10MB
export const AVATAR_MAX_SIZE = 2 * 1024 * 1024; // 2MB
export const MAX_SCREENSHOTS = 10;
export const MAX_TAGS = 15;
export const MAX_TAG_LENGTH = 50;
export const MAX_SLUG_LENGTH = 128;
export const MAX_NAME_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 500;
export const MAX_LONG_DESCRIPTION_LENGTH = 10000;
export const MAX_README_LENGTH = 100000;
export const MAX_REVIEW_LENGTH = 5000;

export const SORT_OPTIONS = [
  { value: "trending", label: "Trending" },
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "most-downloaded", label: "Most Downloaded" },
  { value: "most-starred", label: "Most Starred" },
  { value: "recently-updated", label: "Recently Updated" },
] as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 24,
  MAX_PAGE_SIZE: 100,
} as const;

export const TRENDING_WEIGHTS = {
  DOWNLOADS: 1,
  RECENT_DOWNLOADS: 3,
  STARS: 2,
  GROWTH: 4,
  ENGAGEMENT: 1.5,
} as const;