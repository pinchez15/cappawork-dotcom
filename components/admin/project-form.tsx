"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create Project"}
    </Button>
  );
}

interface ProjectFormProps {
  action: (formData: FormData) => Promise<void>;
  initialData?: {
    name?: string;
    description?: string;
  };
}

export function ProjectForm({ action, initialData }: ProjectFormProps) {
  const [state, formAction] = useFormState(async (prev: any, formData: FormData) => {
    try {
      await action(formData);
    } catch (error: any) {
      return { error: error.message || "Failed to create project" };
    }
  }, null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={initialData?.name}
              placeholder="e.g., Client Website Redesign"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={initialData?.description}
              placeholder="Brief description of the project..."
            />
          </div>

          {state?.error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
              {state.error}
            </div>
          )}

          <div className="flex gap-4">
            <SubmitButton />
            <Button type="button" variant="outline" asChild>
              <a href="/admin">Cancel</a>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

