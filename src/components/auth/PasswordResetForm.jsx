"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { cn } from "@/lib/utils";

export default function ResetPasswordForm({ className, ...props }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Check if passwords match
    if (password != confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Change user password
      const { data, error } = await supabase.auth.updateUser({
        password,
      });
      setSuccess(true);

      // Redirect to homepage
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
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
          Confirm the change in password below
        </h2>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <div className="grid gap-6">
              {/* Password */}
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {/* Password */}
              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder=""
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Confirm Password
              </Button>

              {/* Error message */}
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && (
                <p className="text-green-500 text-sm">
                  Successfully reset your password
                </p>
              )}
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
