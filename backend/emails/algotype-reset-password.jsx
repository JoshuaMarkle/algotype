import * as React from "react";

import EmailLayout, {
  ActionButton,
  Paragraph,
  confirmLink,
} from "./components/EmailLayout.jsx";

// Supabase template: "Reset Password"
export default function AlgotypeResetPasswordEmail({
  link = confirmLink("recovery"),
}) {
  return (
    <EmailLayout
      preview="Reset the password for your AlgoType account"
      heading="Reset your password"
    >
      <Paragraph>
        Tap the button below to choose a new password for your AlgoType account.
        If you signed up with GitHub or Google, this also lets you add a
        password. The link can only be used once and expires soon.
      </Paragraph>
      <ActionButton href={link}>Reset password</ActionButton>
    </EmailLayout>
  );
}
