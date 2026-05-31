import { Metadata } from "next";
import { AuthPageClient } from "./auth-client";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your Claude Agent Hub account and start publishing agents.",
};

export default function SignUpPage() {
  return <AuthPageClient mode="signup" />;
}