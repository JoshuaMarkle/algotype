// Feature switches for flows that are built but turned off

// Password reset needs reliable auth emails. Off until an email service is
// set up: the "Forgot your password?" link is hidden and
// /login/password-reset/* redirects to /login
export const PASSWORD_RESET_ENABLED = false;
