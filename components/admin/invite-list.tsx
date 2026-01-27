"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { revokeInvite, resendInvite } from "@/server/actions/organizations";
import { Mail, X, RefreshCw } from "lucide-react";

interface Invite {
  id: string;
  email: string;
  status: string;
  clerk_invitation_id: string | null;
  created_at: string;
  invited_by_profile?: {
    id: string;
    name: string;
    email: string;
  };
}

interface InviteListProps {
  invites: Invite[];
  organizationId: string;
}

export function InviteList({ invites, organizationId }: InviteListProps) {
  const [isPending, startTransition] = useTransition();

  const handleRevoke = (inviteId: string, clerkInvitationId: string | null) => {
    startTransition(async () => {
      await revokeInvite(inviteId, clerkInvitationId);
    });
  };

  const handleResend = (inviteId: string, email: string) => {
    startTransition(async () => {
      await resendInvite(organizationId, email, inviteId);
    });
  };

  if (invites.length === 0) {
    return (
      <p className="text-sm text-stone-500">No pending invites</p>
    );
  }

  return (
    <div className="space-y-3">
      {invites.map((invite) => (
        <div
          key={invite.id}
          className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-amber-600" />
            <div>
              <p className="font-medium text-stone-900">{invite.email}</p>
              <p className="text-xs text-stone-500">
                Sent {new Date(invite.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              Pending
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleResend(invite.id, invite.email)}
              disabled={isPending}
              title="Resend invite"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRevoke(invite.id, invite.clerk_invitation_id)}
              disabled={isPending}
              className="text-stone-500 hover:text-red-600"
              title="Revoke invite"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
