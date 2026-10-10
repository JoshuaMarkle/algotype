import * as React from "react";

import EmailLayout, {
  ActionButton,
  Paragraph,
  confirmLink,
} from "./components/EmailLayout.jsx";

// Supabase template: "Confirm signup"
export default function AlgotypeConfirmEmail({ link = confirmLink("email") }) {
  return (
    <EmailLayout
      preview="Verify your AlgoType account"
      heading="Verify your account"
    >
      <Paragraph>
        Welcome to AlgoType! Tap the button below to verify your email and start
        saving your typing progress. The link can only be used once and expires
        soon.
      </Paragraph>
      <ActionButton href={link}>Verify account</ActionButton>
    </EmailLayout>
  );
}
