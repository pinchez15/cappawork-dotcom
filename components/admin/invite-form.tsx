"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendClientInvite } from "@/server/actions/organizations";
import { Send } from "lucide-react";

interface InviteFormProps {
  organizationId: string;
}

export function InviteForm({ organizationId }: InviteFormProps) {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setError(null);
    setSuccess(false);

    startTransition(async () => {
      try {
        await sendClientInvite(organizationId, email);
        setEmail("");
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to send invite";
        setError(message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email to invite..."
          required
          className="flex-1"
        />
        <Button type="submit" disabled={isPending || !email}>
          <Send className="h-4 w-4 mr-1" />
          Invite
        </Button>
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {success && (
        <p className="text-sm text-green-600">Invite sent successfully!</p>
      )}
    </form>
  );
}
