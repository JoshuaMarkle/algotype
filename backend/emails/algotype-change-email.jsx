import * as React from "react";

import EmailLayout, {
  ActionButton,
  Paragraph,
  confirmLink,
} from "./components/EmailLayout.jsx";

// Supabase template: "Change Email Address"
export default function AlgotypeChangeEmail({
  link = confirmLink("email_change"),
  email = "{{ .Email }}",
  newEmail = "{{ .NewEmail }}",
}) {
  return (
    <EmailLayout
      preview="Confirm your new AlgoType email address"
      heading="Confirm your new email"
    >
      <Paragraph>
        Tap the button below to change the email on your AlgoType account from{" "}
        <strong>{email}</strong> to <strong>{newEmail}</strong>. The link can
        only be used once and expires soon.
      </Paragraph>
      <ActionButton href={link}>Confirm email change</ActionButton>
    </EmailLayout>
  );
}
