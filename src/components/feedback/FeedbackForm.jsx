"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/ToggleGroup";
import { cn } from "@/lib/utils";
import { FEEDBACK_KINDS, MESSAGE_MAX, submitFeedback } from "@/lib/feedback";

export default function FeedbackForm({ className }) {
  const [kind, setKind] = useState("bug");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    const { error } = await submitFeedback({ kind, message, email });
    if (error) {
      setError(error);
      setStatus("idle");
      return;
    }
    setStatus("sent");
  };

  // --- Sent ---
  if (status === "sent") {
    return (
      <div className={cn("rounded-md border border-border p-6", className)}>
        <p className="text-green">Thanks, your feedback was sent.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => {
            setMessage("");
            setStatus("idle");
          }}
        >
          Send more
        </Button>
      </div>
    );
  }

  // --- Form ---
  return (
    <form onSubmit={handleSubmit} className={cn("grid gap-6", className)}>
      <div className="grid gap-3">
        <Label>Type</Label>
        <ToggleGroup
          type="single"
          variant="outline"
          value={kind}
          onValueChange={(v) => v && setKind(v)}
          aria-label="Feedback type"
        >
          {FEEDBACK_KINDS.map((k) => (
            <ToggleGroupItem key={k.value} value={k.value} className="px-4">
              {k.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="grid gap-3">
        <Label htmlFor="feedback-message">Message</Label>
        <textarea
          id="feedback-message"
          required
          rows={6}
          maxLength={MESSAGE_MAX}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What happened, or what would you like to see?"
          className="w-full min-w-0 rounded-md border border-border bg-transparent px-3 py-2 text-base outline-none transition-[color,box-shadow] placeholder:text-fg-3 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm"
        />
        <p className="text-right text-xs text-fg-3">
          {message.length}/{MESSAGE_MAX}
        </p>
      </div>

      <div className="grid gap-3">
        <Label htmlFor="feedback-email">
          Email <span className="text-fg-3 font-normal">(optional)</span>
        </Label>
        <Input
          id="feedback-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="So we can follow up"
        />
      </div>

      <Button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Send feedback"}
      </Button>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
}
