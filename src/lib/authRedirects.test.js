import { describe, expect, it } from "vitest";

import {
  accountExistsMessage,
  confirmRedirectPath,
  findAutoLinkedIdentity,
  noPasswordMessage,
  safeNext,
} from "@/lib/authRedirects";

const origin = "https://algotype.net";

describe("safeNext", () => {
  it("keeps same-origin relative paths", () => {
    expect(safeNext("/settings")).toBe("/settings");
  });

  it("rejects missing, absolute and protocol-relative targets", () => {
    expect(safeNext(null)).toBe("/account");
    expect(safeNext("https://evil.com")).toBe("/account");
    expect(safeNext("//evil.com")).toBe("/account");
    expect(safeNext("", "/login")).toBe("/login");
  });

  it("rejects backslash and whitespace tricks that resolve off-site", () => {
    expect(safeNext("/\\evil.com")).toBe("/account");
    expect(safeNext("/\\/evil.com")).toBe("/account");
    expect(safeNext("/\t/evil.com")).toBe("/account");
    expect(safeNext("/\n/evil.com")).toBe("/account");
  });

  it("keeps query and hash", () => {
    expect(safeNext("/settings?tab=account#login")).toBe(
      "/settings?tab=account#login",
    );
  });
});

describe("confirmRedirectPath via /auth/callback", () => {
  it("does not follow an off-site nested next", () => {
    expect(
      confirmRedirectPath(
        "https://algotype.net/auth/callback?next=/%5Cevil.com",
        origin,
        "email",
      ),
    ).toBe("/account");
  });
});

describe("confirmRedirectPath", () => {
  it("defaults by link type", () => {
    expect(confirmRedirectPath(null, origin, "email")).toBe("/account");
    expect(confirmRedirectPath("", origin, "recovery")).toBe(
      "/login/password-reset/callback",
    );
  });

  it("uses the path of a same-origin redirect URL", () => {
    expect(
      confirmRedirectPath(
        "https://algotype.net/login/password-reset/callback",
        origin,
        "recovery",
      ),
    ).toBe("/login/password-reset/callback");
    expect(confirmRedirectPath("/settings?x=1", origin, "email")).toBe(
      "/settings?x=1",
    );
  });

  it("falls back for other origins and the bare site URL", () => {
    expect(
      confirmRedirectPath("https://evil.com/account", origin, "email"),
    ).toBe("/account");
    expect(confirmRedirectPath("https://algotype.net", origin, "email")).toBe(
      "/account",
    );
    expect(
      confirmRedirectPath("https://algotype.net/", origin, "recovery"),
    ).toBe("/login/password-reset/callback");
  });

  it("unwraps legacy /auth/callback targets", () => {
    expect(
      confirmRedirectPath(
        "https://algotype.net/auth/callback",
        origin,
        "email",
      ),
    ).toBe("/account");
    expect(
      confirmRedirectPath(
        "https://algotype.net/auth/callback?next=/settings",
        origin,
        "email",
      ),
    ).toBe("/settings");
    expect(
      confirmRedirectPath(
        "https://algotype.net/auth/callback?next=//evil.com",
        origin,
        "email",
      ),
    ).toBe("/account");
  });
});

describe("findAutoLinkedIdentity", () => {
  const now = Date.parse("2026-10-13T12:00:00Z");
  const at = (msAgo) => new Date(now - msAgo).toISOString();
  const DAY = 24 * 60 * 60 * 1000;

  it("flags a provider just attached to an older account", () => {
    const user = {
      identities: [
        { provider: "email", created_at: at(30 * DAY) },
        { provider: "github", created_at: at(5000) },
      ],
    };
    const found = findAutoLinkedIdentity(user, now);
    expect(found.identity.provider).toBe("github");
    expect(found.existing).toEqual(["email"]);
  });

  it("ignores new accounts and single-identity users", () => {
    expect(
      findAutoLinkedIdentity(
        { identities: [{ provider: "github", created_at: at(1000) }] },
        now,
      ),
    ).toBeNull();
    expect(findAutoLinkedIdentity({ identities: [] }, now)).toBeNull();
    expect(findAutoLinkedIdentity(null, now)).toBeNull();
  });

  it("ignores identities linked long ago", () => {
    const user = {
      identities: [
        { provider: "email", created_at: at(30 * DAY) },
        { provider: "google", created_at: at(2 * DAY) },
      ],
    };
    expect(findAutoLinkedIdentity(user, now)).toBeNull();
  });

  it("ignores identities created together with the account", () => {
    const user = {
      identities: [
        { provider: "github", created_at: at(3000) },
        { provider: "google", created_at: at(2000) },
      ],
    };
    expect(findAutoLinkedIdentity(user, now)).toBeNull();
  });
});

describe("accountExistsMessage", () => {
  it("names the existing login methods and the blocked provider", () => {
    expect(accountExistsMessage("github", ["email"])).toBe(
      "An account with this email already exists. Log in with email, then link GitHub in Settings → Login methods.",
    );
    expect(accountExistsMessage("google", ["email", "github"])).toMatch(
      /Log in with email or GitHub, then link Google/,
    );
  });
});

describe("noPasswordMessage", () => {
  it("names the provider for accounts without a password", () => {
    expect(
      noPasswordMessage({ providers: ["github"], has_password: false }),
    ).toMatch(/created with GitHub and has no password/);
  });

  it("keeps the generic message otherwise", () => {
    expect(noPasswordMessage(null)).toBeNull();
    expect(
      noPasswordMessage({ providers: ["email"], has_password: true }),
    ).toBeNull();
    expect(
      noPasswordMessage({ providers: ["github"], has_password: true }),
    ).toBeNull();
  });
});
