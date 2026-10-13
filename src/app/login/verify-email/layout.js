import { redirect } from "next/navigation";

import { AUTH_EMAILS_ENABLED } from "@/lib/features";

export default function VerifyEmailLayout({ children }) {
  if (!AUTH_EMAILS_ENABLED) redirect("/login");
  return children;
}
