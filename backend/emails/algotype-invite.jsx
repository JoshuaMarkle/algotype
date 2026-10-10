import * as React from "react";

import EmailLayout, {
  ActionButton,
  Paragraph,
  confirmLink,
} from "./components/EmailLayout.jsx";

// Supabase template: "Invite user"
export default function AlgotypeInviteEmail({ link = confirmLink("invite") }) {
  return (
    <EmailLayout
      preview="You have been invited to AlgoType"
      heading="You have been invited"
    >
      <Paragraph>
        You have been invited to create an account on AlgoType, typing practice
        for programmers. Tap the button below to accept the invite.
      </Paragraph>
      <ActionButton href={link}>Accept invite</ActionButton>
    </EmailLayout>
  );
}
