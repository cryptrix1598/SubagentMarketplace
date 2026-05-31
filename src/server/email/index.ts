import { Resend } from "resend";

const resend = new Resend(process.env["RESEND_API_KEY"]);

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<boolean> {
  if (!process.env["RESEND_API_KEY"]) {
    console.warn("RESEND_API_KEY not set, skipping email send");
    return false;
  }

  try {
    const from = process.env["RESEND_FROM_EMAIL"] || "noreply@claudeagenthub.dev";
    const { error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Failed to send email:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Failed to send email:", err);
    return false;
  }
}

const APP_URL = process.env["NEXT_PUBLIC_APP_URL"] || "https://claudeagenthub.dev";

export async function sendWelcomeEmail(email: string, name: string): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: "Welcome to Claude Agent Hub!",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #f97316; font-size: 28px;">Welcome to Claude Agent Hub, ${name}! 🎉</h1>
        <p>You've just joined the premier marketplace for Claude Code subagents.</p>
        <h2 style="font-size: 18px;">Get Started:</h2>
        <ul>
          <li>Browse <a href="${APP_URL}/explore" style="color: #f97316;">trending agents</a></li>
          <li><a href="${APP_URL}/publish" style="color: #f97316;">Publish your first agent</a></li>
          <li>Set up your <a href="${APP_URL}/profile" style="color: #f97316;">publisher profile</a></li>
        </ul>
        <p style="color: #666; margin-top: 24px;">If you have questions, reply to this email or visit our docs.</p>
      </div>
    `,
  });
}

export async function sendNewReviewEmail(
  publisherEmail: string,
  publisherName: string,
  agentName: string,
  rating: number,
  reviewerName: string,
): Promise<boolean> {
  return sendEmail({
    to: publisherEmail,
    subject: `New ${rating}-star review on ${agentName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #f97316; font-size: 24px;">New Review on ${agentName}</h1>
        <p>Hey ${publisherName},</p>
        <p><strong>${reviewerName}</strong> just left a ${rating}-star review on your agent <strong>${agentName}</strong>.</p>
        <p style="color: #666;">Keep up the great work! Engaging with reviews helps build trust.</p>
      </div>
    `,
  });
}

export async function sendNewFollowerEmail(
  userEmail: string,
  userName: string,
  followerName: string,
): Promise<boolean> {
  return sendEmail({
    to: userEmail,
    subject: `${followerName} started following you`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #f97316; font-size: 24px;">New Follower!</h1>
        <p>Hey ${userName},</p>
        <p><strong>${followerName}</strong> just started following you on Claude Agent Hub.</p>
      </div>
    `,
  });
}

export async function sendOrganizationInviteEmail(
  email: string,
  orgName: string,
  inviterName: string,
  role: string,
): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: `You've been invited to join ${orgName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #f97316; font-size: 24px;">Organization Invitation</h1>
        <p><strong>${inviterName}</strong> has invited you to join <strong>${orgName}</strong> as a <strong>${role}</strong>.</p>
        <a href="${APP_URL}/orgs/invites" style="display: inline-block; background: #f97316; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          View Invitation
        </a>
      </div>
    `,
  });
}