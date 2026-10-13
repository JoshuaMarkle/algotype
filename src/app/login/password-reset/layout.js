import { redirect } from "next/navigation";

import { PASSWORD_RESET_ENABLED } from "@/lib/features";

export default function PasswordResetLayout({ children }) {
  if (!PASSWORD_RESET_ENABLED) redirect("/login");
  return children;
}
