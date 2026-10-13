// Feature switches for flows that are built but turned off

// Auth emails (sign-up confirmation, login links, resend verification,
// password reset, reauthentication codes). Off until an email service is set
// up: email sign-ups are not verified and log in right away, and every UI
// path that would send an email is hidden. Needs "Confirm email" off in the
// Supabase dashboard (Authentication → Sign In / Providers → Email).
export const AUTH_EMAILS_ENABLED = false;

// Password reset needs reliable auth emails: the "Forgot your password?"
// link is hidden and /login/password-reset/* redirects to /login
export const PASSWORD_RESET_ENABLED = AUTH_EMAILS_ENABLED;
