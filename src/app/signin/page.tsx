import { Metadata } from "next";
import { AuthPageClient } from "../signup/auth-client";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Claude Agent Hub account.",
};

export default function SignInPage() {
  return <AuthPageClient mode="signin" />;
}