import * as React from "react";

import EmailLayout, { Code, Paragraph } from "./components/EmailLayout.jsx";

// Supabase template: "Reauthentication" (sent before a password change when
// "Secure password change" is on)
export default function AlgotypeReauthenticationEmail({
  token = "{{ .Token }}",
}) {
  return (
    <EmailLayout
      preview="Your AlgoType verification code"
      heading="Confirm it's you"
    >
      <Paragraph>
        Enter the code below on AlgoType to confirm the change to your account.
        The code expires soon.
      </Paragraph>
      <Code>{token}</Code>
    </EmailLayout>
  );
}
