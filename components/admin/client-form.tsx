"use client";

import { useFormState } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ClientFormProps {
  action: (formData: FormData) => Promise<void>;
}

export function ClientForm({ action }: ClientFormProps) {
  const [state, formAction] = useFormState(
    async (prev: { error?: string } | null, formData: FormData) => {
      try {
        await action(formData);
        return null;
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to create client";
        return { error: message };
      }
    },
    null
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              name="companyName"
              required
              placeholder="e.g., Acme Corporation"
            />
            <p className="text-sm text-stone-500">
              This will be the organization name in Clerk
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientEmail">Client Email *</Label>
            <Input
              id="clientEmail"
              name="clientEmail"
              type="email"
              required
              placeholder="client@example.com"
            />
            <p className="text-sm text-stone-500">
              An invitation will be sent to this email address
            </p>
          </div>

          {state?.error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
              {state.error}
            </div>
          )}

          <div className="flex gap-4">
            <Button type="submit">Create Client & Send Invite</Button>
            <Button type="button" variant="outline" asChild>
              <a href="/admin/clients">Cancel</a>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
