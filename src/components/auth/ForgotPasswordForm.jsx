"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { requestPasswordReset, loginWithMagicLink } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default function LoginForm({ className, ...props }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      await requestPasswordReset(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMagicLink = async () => {
    setError(null);
    setSuccess(false);

    try {
      await loginWithMagicLink();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-medium">Reset Your Password</h1>
        <h2 className="text-md text-fg-2">
          Enter your email and send a reset link
        </h2>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <div className="grid gap-6">
              {/* Email and password */}
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
                Send link
              </Button>

              {/* Error message */}
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && (
                <p className="text-green-500 text-sm">
                  Check your email to confirm.
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-bg text-fg-2 relative z-10 px-2">
                Or continue with
              </span>
            </div>

            {/* Login With Email */}
            <div className="flex flex-col gap-4">
              <Button variant="outline" className="w-full bg-bg-2">
                <Mail />
                Login with Email
              </Button>
            </div>
          </div>
        </form>
      </div>
      <div className="text-muted-foreground *:[a]:hover:text-fg text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our{" "}
        <Link href="/terms">Terms of Service</Link> and{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </div>
    </div>
  );
}
