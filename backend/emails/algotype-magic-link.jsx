import * as React from "react";

import EmailLayout, {
  ActionButton,
  Paragraph,
  confirmLink,
} from "./components/EmailLayout.jsx";

// Supabase template: "Magic Link"
export default function AlgotypeMagicLinkEmail({
  link = confirmLink("email"),
}) {
  return (
    <EmailLayout
      preview="Your AlgoType login link"
      heading="Log in to AlgoType"
    >
      <Paragraph>
        Tap the button below to log in to your AlgoType account. The link can
        only be used once and expires soon.
      </Paragraph>
      <ActionButton href={link}>Log in</ActionButton>
    </EmailLayout>
  );
}
