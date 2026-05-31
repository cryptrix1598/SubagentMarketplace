import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins/email-otp";
import prisma from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env["GOOGLE_CLIENT_ID"] || "",
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"] || "",
      enabled: !!(process.env["GOOGLE_CLIENT_ID"] && process.env["GOOGLE_CLIENT_SECRET"]),
    },
    github: {
      clientId: process.env["GITHUB_CLIENT_ID"] || "",
      clientSecret: process.env["GITHUB_CLIENT_SECRET"] || "",
      enabled: !!(process.env["GITHUB_CLIENT_ID"] && process.env["GITHUB_CLIENT_SECRET"]),
    },
  },
  plugins: [
    nextCookies(),
    emailOTP({
      sendVerificationOTP: async ({ email, otp }: { email: string; otp: string }) => {
        if (process.env["RESEND_API_KEY"]) {
          const { sendEmail } = await import("@/server/email");
          await sendEmail({
            to: email,
            subject: "Verify your email - Claude Agent Hub",
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #f97316; font-size: 24px;">Claude Agent Hub</h1>
                <p>Your verification code is:</p>
                <div style="background: #1a1a2e; color: #fff; padding: 16px 24px; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 4px; text-align: center;">
                  ${otp}
                </div>
                <p style="color: #666; margin-top: 16px;">This code expires in 10 minutes. If you didn't request this, please ignore this email.</p>
              </div>
            `,
          });
        }
      },
    }),
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
    updateAge: 24 * 60 * 60,
    expiresIn: 30 * 24 * 60 * 60,
  },
  user: {
    additionalFields: {
      displayName: { type: "string", required: false },
      bio: { type: "string", required: false },
      website: { type: "string", required: false },
      github: { type: "string", required: false },
      twitter: { type: "string", required: false },
      avatarUrl: { type: "string", required: false },
      location: { type: "string", required: false },
      isVerified: { type: "boolean", required: false, defaultValue: false },
    },
  },
  trustedOrigins: [process.env["BETTER_AUTH_URL"] || "http://localhost:3000"],
});

export type Auth = typeof auth;

export type Session = {
  session: {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
  };
  user: {
    id: string;
    email: string;
    name?: string;
    displayName?: string;
    username?: string;
    avatarUrl?: string;
    isVerified?: boolean;
    emailVerified: boolean;
    role: string;
  };
};