// @ts-nocheck
import { AgentCategory } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CATEGORIES = [
  "CODING", "TESTING", "DEVOPS", "FRONTEND", "BACKEND",
  "DATABASE", "SECURITY", "DOCUMENTATION", "PRODUCTIVITY",
  "DATA", "AI_ML", "DESIGN", "MARKETING", "FINANCE", "OTHER",
];

const TAGS = [
  "claude", "code-review", "refactoring", "testing", "ci-cd",
  "react", "nextjs", "typescript", "python", "rust",
  "security", "performance", "documentation", "api", "database",
  "docker", "kubernetes", "aws", "gcp", "azure",
  "git", "github", "formatting", "linting", "deployment",
  "monitoring", "debugging", "migration", "scaffolding", "automation",
];

const FIRST_NAMES = [
  "Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley",
  "Quinn", "Avery", "Sage", "Dakota", "Phoenix", "Skyler",
  "Reese", "Finley", "Rowan", "Emerson", "Harper", "Ellis",
  "Marlowe", "Sawyer",
];

const LAST_NAMES = [
  "Chen", "Rivera", "Patel", "Kim", "Singh", "Okafor",
  "Müller", "Santos", "Tanaka", "Andersson", "Smith",
  "Johnson", "Williams", "Brown", "Jones", "Garcia",
  "Miller", "Davis", "Rodriguez", "Martinez",
];

const AGENT_NAMES = [
  "CodeReviewer Pro", "TestGenius", "DeployMaster", "ReactForge",
  "APIShield", "DocWriter", "PerfOptimizer", "TypeChecker",
  "SecAuditor", "DBMigrator", "GitFlow", "DockerPilot",
  "K8sNavigator", "AWSArchitect", "PythonMentor", "RustAnalyzer",
  "StyleFormatter", "DebugHunter", "ScaffoldPro", "AutoPilot",
  "CodeCleaner", "TestRunner", "CIWatcher", "FrontEndHelper",
  "BackendBuilder", "SchemaDesigner", "AuthGuard", "DocGenerator",
  "DataPipeline", "MLTrainer", "DesignSystem", "AdOptimizer",
  "FinCalculator", "LogAnalyzer", "CodeSearch", "VersionSync",
  "CacheManager", "QueueMaster", "WorkFlow", "IntelliSense",
  "PromptEngineer", "ContextBuilder", "MemoryManager", "SkillOrchestrator",
  "TaskPlanner", "ErrorResolver", "CodeRefactorer", "ArchReviewer",
  "SpecWriter", "DeployGuard",
];

const AGENT_DESCRIPTIONS = [
  "Automated code review agent that catches bugs, security issues, and style violations before they reach production.",
  "Intelligent test generation agent that creates comprehensive unit and integration tests from your code.",
  "Zero-downtime deployment agent with rollback capabilities and health checks for any cloud platform.",
  "React component generator with TypeScript, testing, and Storybook integration out of the box.",
  "API security auditor that scans for OWASP vulnerabilities, auth issues, and rate limiting problems.",
  "Documentation writer that generates API docs, READMEs, and guides from your codebase.",
  "Performance optimization agent that identifies bottlenecks and suggests fixes for web applications.",
  "TypeScript type checker that catches type errors, suggests improvements, and enforces strict typing.",
  "Security audit agent that performs comprehensive vulnerability scans across your entire stack.",
  "Database migration agent that handles schema changes, data migrations, and rollback procedures.",
  "Git workflow automation agent that manages branches, rebases, and merge strategies for teams.",
  "Docker optimization agent that creates minimal, secure containers with multi-stage builds.",
  "Kubernetes configuration agent that generates and optimizes manifests, Helm charts, and policies.",
  "AWS infrastructure agent that designs and provisions cost-effective cloud architectures.",
  "Python code assistant that handles formatting, linting, type checking, and dependency management.",
  "Rust code analyzer that checks for memory safety issues, performance problems, and idiomatic patterns.",
  "Code style formatter that enforces consistent formatting across your entire codebase.",
  "Intelligent debugging agent that traces errors, identifies root causes, and suggests fixes.",
  "Project scaffolding agent that generates boilerplate for any framework with best practices built in.",
  "Workflow automation agent that chains multiple tools and agents for end-to-end automation.",
  "Code cleanup agent that removes dead code, unused imports, and refactors for readability.",
  "Test runner agent that executes tests in parallel, manages fixtures, and generates coverage reports.",
  "CI/CD monitoring agent that tracks pipeline health, detects flaky tests, and optimizes build times.",
  "Frontend development assistant with component patterns, accessibility checks, and responsive design.",
  "Backend service builder that generates REST/GraphQL APIs with auth, validation, and documentation.",
  "Database schema designer that normalizes data models and generates optimized SQL schemas.",
  "Authentication guard agent that implements secure auth flows with JWT, OAuth, and session management.",
  "Documentation generator that creates comprehensive docs from code comments and type definitions.",
  "Data pipeline orchestrator that manages ETL processes, data validation, and transformation workflows.",
  "Machine learning training agent that handles model training, hyperparameter tuning, and evaluation.",
  "Design system generator that creates consistent UI component libraries with tokens and variants.",
  "Ad copy optimization agent that generates and A/B tests marketing content for conversion.",
  "Financial calculation agent that handles complex computations, tax logic, and compliance checks.",
  "Log analysis agent that parses, filters, and identifies patterns in application logs.",
  "Code search agent that finds relevant code across repositories using semantic understanding.",
  "Version synchronization agent that keeps dependencies and packages up to date across projects.",
  "Cache management agent that optimizes caching strategies, invalidation, and TTL configurations.",
  "Message queue agent that designs and manages asynchronous processing with retry and dead-letter handling.",
  "Workflow orchestration agent that coordinates multi-step processes with branching and error recovery.",
  "Intelligent code completion agent with context-aware suggestions and auto-imports.",
];

const ORG_NAMES = [
  "Anthropic Tools", "CloudForge Labs", "DevOps Collective",
  "Security First", "Open Agent Alliance", "AI Builders Guild",
  "Frontend Masters", "Data Pipeline Co", "Scale Systems",
  "Code Craft Studio",
];

const REVIEW_COMMENTS = [
  "This agent saved me hours of work on every code review. Highly recommended!",
  "Excellent agent! The suggestions are always relevant and actionable.",
  "Good overall, but sometimes produces false positives on newer codebases.",
  "Game changer for our team. We use it on every PR now.",
  "Solid agent with great defaults. Easy to configure for our specific needs.",
  "Works great for standard projects but could use more framework-specific rules.",
  "The best agent I've found for this purpose. Five stars!",
  "Really helpful for catching security issues before they make it to production.",
  "Good documentation and easy to install. Does exactly what it promises.",
  "Solid foundation but hoping for more features in future versions.",
];

const BUNDLE_NAMES = [
  "Full Stack Web Dev", "Security Audit Suite", "DevOps Starter Pack",
  "Frontend Accelerator", "Data Engineering Toolkit", "AI/ML Research Pack",
  "Mobile Dev Bundle", "Infrastructure as Code", "Testing Power Pack",
];

const COLLECTION_TITLES = [
  "Best Coding Agents", "Frontend Stack", "Productivity Pack",
  "Security Essentials", "DevOps Must-Haves", "Testing Toolkit",
  "AI/ML Foundations", "Cloud Native Collection", "Database Tools",
  "Beginner Friendly",
];

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.agentDownload.deleteMany();
  await prisma.agentFile.deleteMany();
  await prisma.agentVersion.deleteMany();
  await prisma.agentTag.deleteMany();
  await prisma.agentDependency.deleteMany();
  await prisma.fork.deleteMany();
  await prisma.star.deleteMany();
  await prisma.review.deleteMany();
  await prisma.screenshot.deleteMany();
  await prisma.bundleAgent.deleteMany();
  await prisma.collectionAgent.deleteMany();
  await prisma.bundle.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.organizationMember.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.agent!.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.report.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const passwordHash = await hashPassword("password123");
  const users = [];

  for (let i = 0; i < 20; i++) {
  const firstName = FIRST_NAMES[i % FIRST_NAMES.length]!;
  const lastName = LAST_NAMES[i % LAST_NAMES.length]!;
    const username = `${firstName.toLowerCase()}${lastName.toLowerCase().slice(0, 3)}${i}`;

    const user = await prisma.user.create({
      data: {
        email: `${username}@example.com`,
        emailVerified: true,
        name: `${firstName} ${lastName}`,
        displayName: `${firstName} ${lastName}`,
        username,
        bio: `Software engineer passionate about building great tools. Agent #${i + 1} publisher on Claude Agent Hub.`,
        github: username,
        twitter: username,
        location: ["San Francisco, CA", "New York, NY", "London, UK", "Berlin, DE", "Tokyo, JP", "Sydney, AU"][i % 6],
        isVerified: i < 8,
        role: i === 0 ? "SUPER_ADMIN" : i < 3 ? "ADMIN" : "USER",
      },
    });

    // Create account with password
    await prisma.account.create({
      data: {
        userId: user!.id,
        accountId: user!.email,
        providerId: "credential",
        password: passwordHash,
      },
    });

    users.push(user);
  }

  console.log(`✅ Created ${users.length} users`);

  // Create organizations
  const orgs = [];
  for (let i = 0; i < 10; i++) {
    const org = await prisma.organization.create({
      data: {
        name: ORG_NAMES[i]!,
        slug: ORG_NAMES[i]!.toLowerCase().replace(/\s+/g, "-"),
        description: `${ORG_NAMES[i]!} — building the future of AI-powered development tools.`,
        website: `https://${ORG_NAMES[i]!.toLowerCase().replace(/\s+/g, "")}.dev`,
        isVerified: i < 5,
      },
    });

    // Add owner
    await prisma.organizationMember.create({
      data: {
        organizationId: org.id,
        userId: users[i]!.id,
        role: "OWNER",
      },
    });

    // Add some members
    for (let j = 1; j <= 3; j++) {
      const memberIdx = (i + j + 1) % users.length;
      await prisma.organizationMember.create({
        data: {
          organizationId: org.id,
          userId: users[memberIdx]!.id,
          role: j === 1 ? "ADMIN" : j === 2 ? "MAINTAINER" : "MEMBER",
        },
      });
    }

    orgs.push(org);
  }

  console.log(`✅ Created ${orgs.length} organizations`);

  // Create agents
  const agents = [];
  for (let i = 0; i < 50; i++) {
    const publisher = users[i % users.length]!;
    const agentName = AGENT_NAMES[i % AGENT_NAMES.length]!;
    const slug = agentName!.toLowerCase().replace(/\s+/g, "-");
    const category = CATEGORIES[i % CATEGORIES.length]! as AgentCategory;
    const version = `${Math.floor(i / 10) + 1}.${i % 5}.${i % 3}`;
    const tags = TAGS.slice(i % TAGS.length, (i % TAGS.length) + 3 + (i % 4));
    const downloads = Math.floor(Math.random() * 10000) + 100;
    const stars = Math.floor(Math.random() * 500) + 10;

    const agent = await prisma.agent!.create({
      data: {
        name: agentName,
        slug,
        description: AGENT_DESCRIPTIONS[i % AGENT_DESCRIPTIONS.length]!,
        longDescription: `${AGENT_DESCRIPTIONS[i % AGENT_DESCRIPTIONS.length]!}\n\n## Features\n\n- Feature 1: Automated analysis and suggestions\n- Feature 2: Real-time feedback\n- Feature 3: Customizable configuration\n- Feature 4: Team collaboration support\n\n## Installation\n\n\`\`\`bash\nclaude agent install ${publisher!.username}/${slug}\n\`\`\`\n\n## Usage\n\nAfter installation, the agent integrates directly into your Claude Code workflow. Just start a conversation and the agent will activate automatically when relevant.`,
        category,
        license: ["MIT", "Apache-2.0", "GPL-3.0", "BSD-3-Clause", "ISC"][i % 5],
        version,
        readme: `# ${agentName}\n\n${AGENT_DESCRIPTIONS[i % AGENT_DESCRIPTIONS.length]!}\n\n## Installation\n\n\`\`\`bash\nclaude agent install ${publisher!.username}/${slug}\n\`\`\`\n\n## Features\n\n- Automated analysis\n- Real-time suggestions\n- Configurable rules\n\n## Configuration\n\nCreate a \`.agentrc\` file in your project root:\n\n\`\`\`json\n{\n  "rules": ["strict", "security"],\n  "ignore": ["vendor/**"]\n}\n\`\`\``,
        installationInstructions: `Run \`claude agent install ${publisher!.username}/${slug}\` to install. Configure with \`.agentrc\` file.`,
        isPublic: true,
        isFeatured: i < 6,
        isVerified: i < 15,
        publisherId: publisher!.id,
        organizationId: i < 10 ? orgs[i % orgs.length]!.id : null,
        publishedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        downloads,
        views: downloads * 5 + Math.floor(Math.random() * 1000),
        starsCount: stars,
        forksCount: Math.floor(Math.random() * 20),
        reviewsCount: Math.floor(Math.random() * 10),
        averageRating: 3 + Math.random() * 2,
        trendingScore: Math.random() * 50 + 10,
        weeklyDownloads: Math.floor(downloads * 0.25),
        monthlyDownloads: Math.floor(downloads * 0.8),
        tags: {
          create: [...new Set(tags)].slice(0, 5).map((tag) => ({ tag })),
        },
        versions: {
          create: [
            {
              version: "1.0.0",
              changelog: "Initial release",
              isLatest: false,
              createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
            },
            {
              version,
              changelog: i > 5 ? "Major improvements and bug fixes" : "Initial release",
              isLatest: true,
            },
          ],
        },
      },
    });

    agents.push(agent);
  }

  console.log(`✅ Created ${agents.length} agents`);

  // Create reviews
  for (let i = 0; i < 100; i++) {
    const agent = agents[i % agents.length];
    const reviewer = users[(i + 3) % users.length]!;

    if (reviewer!.id === agent!.publisherId) continue;

    try {
      await prisma.review.create({
        data: {
          agentId: agent!.id,
          userId: reviewer!.id,
          rating: Math.min(5, Math.max(1, Math.floor(3 + Math.random() * 3))),
          comment: REVIEW_COMMENTS[i % REVIEW_COMMENTS.length],
        },
      });
    } catch {
      // Skip duplicate reviews
    }
  }

  console.log("✅ Created reviews");

  // Create stars
  for (let i = 0; i < 150; i++) {
    const agent = agents[i % agents.length];
    const user = users[(i + 5) % users.length];

    try {
      await prisma.star.create({
        data: { agentId: agent!.id, userId: user!.id },
      });
    } catch {
      // Skip duplicates
    }
  }

  console.log("✅ Created stars");

  // Create follows
  for (let i = 0; i < 60; i++) {
    const follower = users[i % users.length]!;
    const following = users[(i + 7) % users.length];

    if (follower!.id === following!.id) continue;

    try {
      await prisma.follow.create({
        data: { followerId: follower!.id, followingId: following!.id },
      });
    } catch {
      // Skip duplicates
    }
  }

  console.log("✅ Created follows");

  // Create forks
  for (let i = 0; i < 15; i++) {
    const parentAgent = agents[i % agents.length];
    const forkUser = users[(i + 11) % users.length];

    try {
      const forkSlug = `${parentAgent!.slug}-fork-${i}`;
      const forkAgent = await prisma.agent!.create({
        data: {
          name: `${parentAgent!.name} (Fork)`,
          slug: forkSlug,
          description: parentAgent!.description,
          longDescription: parentAgent!.longDescription,
          category: parentAgent!.category,
          license: parentAgent!.license,
          version: parentAgent!.version,
          readme: parentAgent!.readme,
          publisherId: forkUser!.id,
          isPublic: true,
          publishedAt: new Date(),
          tags: {
            create: parentAgent!.tags ? (await prisma.agentTag.findMany({ where: { agentId: parentAgent!.id } })).map((t) => ({ tag: t.tag })) : [],
          },
          versions: {
            create: {
              version: parentAgent!.version,
              changelog: `Forked from ${parentAgent!.slug}`,
              isLatest: true,
            },
          },
        },
      });

      await prisma.fork.create({
        data: { agentId: forkAgent.id, parentAgentId: parentAgent!.id },
      });

      await prisma.agent!.update({
        where: { id: parentAgent!.id },
        data: { forksCount: { increment: 1 } },
      });
    } catch {
      // Skip duplicates
    }
  }

  console.log("✅ Created forks");

  // Create bundles
  for (let i = 0; i < 8; i++) {
    const user = users[i % users.length]!;
    const bundleAgents = agents.slice(i * 4, i * 4 + 4);

    const bundle = await prisma.bundle.create({
      data: {
        name: BUNDLE_NAMES[i % BUNDLE_NAMES.length],
        slug: BUNDLE_NAMES[i % BUNDLE_NAMES.length].toLowerCase().replace(/\s+/g, "-"),
        description: `A curated bundle of agents for ${BUNDLE_NAMES[i % BUNDLE_NAMES.length].toLowerCase()}. Get started quickly with this comprehensive toolkit.`,
        userId: user!.id,
        isPublic: true,
        downloads: Math.floor(Math.random() * 500) + 50,
        agents: {
          create: bundleAgents.map((agent, index) => ({
            agentId: agent!.id,
            order: index,
          })),
        },
      },
    });
  }

  console.log("✅ Created bundles");

  // Create collections
  for (let i = 0; i < 10; i++) {
    const user = users[(i + 2) % users.length];
    const collectionAgents = agents.slice(i * 5, i * 5 + 5);

    await prisma.collection.create({
      data: {
        title: COLLECTION_TITLES[i],
        description: `A curated collection of the best agents for ${COLLECTION_TITLES[i].toLowerCase()}.`,
        visibility: "PUBLIC",
        userId: user!.id,
        agents: {
          create: collectionAgents.map((agent, index) => ({
            agentId: agent!.id,
            order: index,
          })),
        },
      },
    });
  }

  console.log("✅ Created collections");

  // Create some download records
  for (let i = 0; i < 200; i++) {
    const agent = agents[i % agents.length];
    const user = i % 3 === 0 ? users[(i + 9) % users.length] : null;

    await prisma.agentDownload.create({
      data: {
        agentId: agent!.id,
        userId: user?.id,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log("✅ Created download records");

  // Create notifications
  for (let i = 0; i < 30; i++) {
    const user = users[i % users.length]!;
    await prisma.notification.create({
      data: {
        userId: user!.id,
        type: ["NEW_STAR", "NEW_REVIEW", "NEW_FOLLOWER", "NEW_FORK"][i % 4] as never,
        title: ["New star!", "New review!", "New follower!", "Your agent was forked!"][i % 4],
        message: `Notification ${i + 1}: Activity on your agents and profile.`,
        isRead: Math.random() > 0.4,
      },
    });
  }

  console.log("✅ Created notifications");

  // Recalculate trending scores
  for (const agent of agents) {
    const trendingScore = Math.random() * 50 + 10;
    await prisma.agent!.update({
      where: { id: agent!.id },
      data: { trendingScore },
    });
  }

  console.log("✅ Updated trending scores");
  console.log("🎉 Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });