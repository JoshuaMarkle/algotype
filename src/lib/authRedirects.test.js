import { describe, expect, it } from "vitest";

import { confirmRedirectPath, safeNext } from "@/lib/authRedirects";

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
