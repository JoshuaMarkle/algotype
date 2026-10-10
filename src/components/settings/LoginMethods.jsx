"use client";

import { useCallback, useEffect, useState } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import {
  getCurrentUser,
  getIdentities,
  isReauthenticationError,
  linkProvider,
  sendReauthenticationCode,
  setPassword,
  unlinkProvider,
  userHasPassword,
} from "@/lib/auth";

const PROVIDERS = [
  { id: "github", label: "GitHub" },
  { id: "google", label: "Google" },
];

// Name shown next to a linked provider (GitHub username or Google email)
function identityName(identity) {
  const d = identity?.identity_data ?? {};
  return d.user_name ?? d.preferred_username ?? d.email ?? null;
}

// Link/unlink GitHub and Google, and add or change the password. Linking needs
// "Manual linking" turned on in Supabase Auth settings.
export default function LoginMethods() {
  const [authUser, setAuthUser] = useState(null);
  const [identities, setIdentities] = useState(null);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const [u, ids] = await Promise.all([getCurrentUser(), getIdentities()]);
      setAuthUser(u);
      setIdentities(ids);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    refresh();

    // Errors passed back from /auth/callback after a failed link
    const params = new URLSearchParams(window.location.search);
    const message = params.get("error");
    if (message) {
      setError(message);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [refresh]);

  if (!identities) {
    return error ? <p className="text-red text-sm mt-4">{error}</p> : null;
  }

  const hasPassword = userHasPassword(authUser, identities);
  const onlyOneMethod = identities.length <= 1;

  const handleLink = async (provider) => {
    setError(null);
    setNotice(null);
    setBusy(provider);
    try {
      // Navigates to the provider; it returns through /auth/callback
      await linkProvider(provider);
    } catch (err) {
      setError(err.message);
      setBusy(null);
    }
  };

  const handleUnlink = async (provider, label) => {
    if (!window.confirm(`Remove ${label} login from your account?`)) return;
    setError(null);
    setNotice(null);
    setBusy(provider);
    try {
      await unlinkProvider(provider);
      await refresh();
      setNotice(`${label} login removed.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <h2 className="text-2xl mt-16">Login Methods</h2>
      <table className="table-fixed w-full">
        <colgroup>
          <col className="w-28 md:w-64"></col>
          <col></col>
          <col className="w-36 md:w-44"></col>
        </colgroup>
        <tbody>
          <tr>
            <td className="text-fg-2">Password</td>
            <td className={hasPassword ? "" : "text-fg-2"}>
              {hasPassword ? "Set" : "Not set"}
            </td>
            <td className="text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPasswordForm((v) => !v)}
              >
                {showPasswordForm
                  ? "Cancel"
                  : hasPassword
                    ? "Change password"
                    : "Add password"}
              </Button>
            </td>
          </tr>
          {PROVIDERS.map(({ id, label }) => {
            const identity = identities.find((i) => i.provider === id);
            return (
              <tr key={id}>
                <td className="text-fg-2">{label}</td>
                <td className={identity ? "truncate" : "text-fg-2"}>
                  {identity
                    ? `Connected${identityName(identity) ? ` as ${identityName(identity)}` : ""}`
                    : "Not connected"}
                </td>
                <td className="text-right">
                  {identity ? (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={busy !== null || onlyOneMethod}
                      title={
                        onlyOneMethod
                          ? "Add another login method before removing this one"
                          : undefined
                      }
                      onClick={() => handleUnlink(id, label)}
                    >
                      Unlink
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={busy !== null}
                      onClick={() => handleLink(id)}
                    >
                      {busy === id ? "Redirecting..." : "Link"}
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {showPasswordForm && (
        <PasswordForm
          email={authUser?.email}
          isNew={!hasPassword}
          onDone={async () => {
            setShowPasswordForm(false);
            setNotice(
              hasPassword
                ? "Password changed."
                : "Password added. You can now log in with your email and password.",
            );
            await refresh();
          }}
        />
      )}

      {error && <p className="text-red text-sm mt-4">{error}</p>}
      {notice && <p className="text-green text-sm mt-4">{notice}</p>}
    </>
  );
}

function PasswordForm({ email, isNew, onDone }) {
  const [password, setPasswordValue] = useState("");
  const [confirm, setConfirm] = useState("");
  // Set once Supabase asks for the emailed reauthentication code
  const [needsCode, setNeedsCode] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setSaving(true);
    try {
      await setPassword(password, needsCode ? code.trim() : undefined);
      await onDone();
    } catch (err) {
      if (!needsCode && isReauthenticationError(err)) {
        try {
          await sendReauthenticationCode();
          setNeedsCode(true);
        } catch (sendErr) {
          setError(sendErr.message);
        }
      } else {
        setError(err.message);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 max-w-sm mt-6">
      {isNew && email && (
        <p className="text-sm text-fg-2">
          After this you can also log in with {email} and this password.
        </p>
      )}
      <div className="grid gap-2">
        <Label htmlFor="new-password">New password</Label>
        <Input
          id="new-password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPasswordValue(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirm-password">Confirm password</Label>
        <Input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </div>
      {needsCode && (
        <div className="grid gap-2">
          <Label htmlFor="reauth-code">Verification code</Label>
          <p className="text-sm text-fg-2">
            For your security we emailed a code to {email ?? "you"}. Enter it to
            confirm the change.
          </p>
          <Input
            id="reauth-code"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
      )}
      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : isNew ? "Add password" : "Change password"}
      </Button>
      {error && <p className="text-red text-sm">{error}</p>}
    </form>
  );
}
