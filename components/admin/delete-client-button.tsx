"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { deleteClientOrganization } from "@/server/actions/organizations";

interface DeleteClientButtonProps {
  orgId: string;
  clerkOrgId: string;
  orgName: string;
}

export function DeleteClientButton({
  orgId,
  clerkOrgId,
  orgName,
}: DeleteClientButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete Client
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete &ldquo;{orgName}&rdquo;?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this client organization. All team
            members will lose portal access and any assigned projects will become
            unassigned. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            disabled={isDeleting}
            onClick={async () => {
              setIsDeleting(true);
              await deleteClientOrganization(orgId, clerkOrgId);
            }}
          >
            {isDeleting ? "Deleting..." : "Delete Client"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
