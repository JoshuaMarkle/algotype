import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/supabaseClient", () => ({ supabase: {} }));

import { validateFeedback, MESSAGE_MAX } from "@/lib/feedback";

describe("validateFeedback", () => {
  const ok = { kind: "bug", message: "The timer keeps running", email: "" };

  it("accepts a valid form and trims fields", () => {
    expect(
      validateFeedback({
        ...ok,
        message: "  hello world!  ",
        email: " a@b.co ",
      }),
    ).toEqual({
      data: { kind: "bug", message: "hello world!", email: "a@b.co" },
    });
  });

  it("turns an empty email into null", () => {
    expect(validateFeedback(ok).data.email).toBeNull();
  });

  it("rejects an unknown kind", () => {
    expect(validateFeedback({ ...ok, kind: "spam" }).error).toBeTruthy();
  });

  it("rejects short and long messages", () => {
    expect(
      validateFeedback({ ...ok, message: "   short  " }).error,
    ).toBeTruthy();
    expect(
      validateFeedback({ ...ok, message: "x".repeat(MESSAGE_MAX + 1) }).error,
    ).toBeTruthy();
  });

  it("rejects a malformed email", () => {
    expect(
      validateFeedback({ ...ok, email: "not-an-email" }).error,
    ).toBeTruthy();
  });

  it("handles missing fields", () => {
    expect(validateFeedback({ kind: "review" }).error).toBeTruthy();
  });
});
