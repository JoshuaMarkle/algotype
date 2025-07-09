"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { resendVerificationEmail } from "@/lib/auth"; // <-- NEW
import { cn } from "@/lib/utils";

export default function ReverifyEmailForm({ className, ...props }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Send (or re-send) verification e-mail
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      await resendVerificationEmail(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-medium">Verify Your Email</h1>
        <h2 className="text-md text-fg-2">
          Enter your address to start verification
        </h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          {/* Email */}
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button type="submit" className="w-full">
            Send Verification Link
          </Button>

          {/* Feedback */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && (
            <p className="text-green-500 text-sm">
              Check your inbox for the new verification e-mail.
            </p>
          )}
        </div>
      </form>
      <div className="text-muted-foreground *:[a]:hover:text-fg text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our{" "}
        <Link href="/terms">Terms of Service</Link> and{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </div>
    </div>
  );
}
