import type {
  User,
  Agent,
  AgentVersion,
  AgentFile,
  AgentTag,
  AgentCategory,
  Review,
  Star,
  Fork,
  Follow,
  Organization,
  OrganizationMember,
  OrgRole,
  Collection,
  CollectionAgent,
  Bundle,
  BundleAgent,
  Screenshot,
  AgentDependency,
  AgentDownload,
  Report,
  ReportTarget,
  ReportStatus,
  AuditLog,
  Notification,
  NotificationType,
  UserRole,
  Visibility,
  Account,
  Session,
} from "@prisma/client";

// ============================================================================
// Re-export Prisma types
// ============================================================================

export type {
  User,
  Agent,
  AgentVersion,
  AgentFile,
  AgentTag,
  AgentCategory,
  Review,
  Star,
  Fork,
  Follow,
  Organization,
  OrganizationMember,
  OrgRole,
  Collection,
  CollectionAgent,
  Bundle,
  BundleAgent,
  Screenshot,
  AgentDependency,
  AgentDownload,
  Report,
  ReportTarget,
  ReportStatus,
  AuditLog,
  Notification,
  NotificationType,
  UserRole,
  Visibility,
  Account,
  Session,
};

// ============================================================================
// Extended / Composite types
// ============================================================================

export type AgentWithPublisher = Agent & {
  publisher: Pick<User, "id" | "username" | "displayName" | "avatarUrl" | "isVerified">;
  tags: AgentTag[];
  _count?: {
    stars: number;
    reviews: number;
    forks: number;
  };
};

export type AgentWithDetails = AgentWithPublisher & {
  versions: AgentVersion[];
  screenshots: Screenshot[];
  reviews: (Review & { user: Pick<User, "id" | "username" | "displayName" | "avatarUrl"> })[];
  dependencies: (AgentDependency & { dependency: Agent })[];
  dependents: (AgentDependency & { agent: Agent })[];
  fork?: Fork & { parentAgent: Agent };
};

export type AgentListItem = Agent & {
  publisher: Pick<User, "id" | "username" | "displayName" | "avatarUrl" | "isVerified">;
  tags: AgentTag[];
};

export type OrganizationWithMembers = Organization & {
  members: (OrganizationMember & { user: Pick<User, "id" | "username" | "displayName" | "avatarUrl"> })[];
  _count?: { agents: number };
};

export type CollectionWithAgents = Collection & {
  user: Pick<User, "id" | "username" | "displayName" | "avatarUrl">;
  agents: (CollectionAgent & { agent: AgentListItem })[];
  _count?: { agents: number };
};

export type BundleWithAgents = Bundle & {
  user: Pick<User, "id" | "username" | "displayName" | "avatarUrl">;
  agents: (BundleAgent & { agent: AgentListItem })[];
  _count?: { agents: number };
};

export type UserWithStats = User & {
  _count?: {
    agents: number;
    stars: number;
    followers: number;
    follows: number;
    collections: number;
    bundles: number;
  };
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type SearchFilters = {
  query?: string;
  category?: string;
  tags?: string[];
  sort?: string;
  page?: number;
  pageSize?: number;
  verifiedOnly?: boolean;
  publisherId?: string;
};

export type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
};

export type DashboardStats = {
  totalAgents: number;
  totalDownloads: number;
  totalViews: number;
  totalStars: number;
  weeklyDownloads: number;
  monthlyDownloads: number;
  averageRating: number;
  growthRate: number;
  downloadsByDay: { date: string; count: number }[];
  topAgents: AgentListItem[];
};

export type AdminStats = {
  totalUsers: number;
  totalAgents: number;
  totalDownloads: number;
  totalReviews: number;
  totalOrganizations: number;
  totalReports: number;
  pendingReports: number;
  usersByRole: Record<string, number>;
  agentsByCategory: Record<string, number>;
  recentSignups: number;
  recentPublishedAgents: number;
};