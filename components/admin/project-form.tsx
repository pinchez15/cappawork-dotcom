"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create Project"}
    </Button>
  );
}

const SERVICE_TIERS = [
  {
    value: "portal_build",
    label: "Client Portal",
    price: "$10,000",
    description: "Custom portal or dashboard build",
    color: "bg-tier-portal text-white",
  },
  {
    value: "diagnostic",
    label: "Phase I Diagnostic",
    price: "$30,000",
    description: "Scale & margin diagnostic (4–6 weeks)",
    color: "bg-tier-diagnostic text-white",
  },
  {
    value: "implementation",
    label: "Phase II Build",
    price: "$50,000+",
    description: "Custom system build from diagnostic findings",
    color: "bg-tier-implementation text-white",
  },
];

interface ProjectFormProps {
  action: (formData: FormData) => Promise<void>;
  initialData?: {
    name?: string;
    description?: string;
    service_tier?: string;
  };
}

export function ProjectForm({ action, initialData }: ProjectFormProps) {
  const [state, formAction] = useActionState(async (prev: any, formData: FormData) => {
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
            <Label htmlFor="service_tier">Service Tier *</Label>
            <Select name="service_tier" required defaultValue={initialData?.service_tier}>
              <SelectTrigger id="service_tier" className="w-full">
                <SelectValue placeholder="Select a service tier" />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_TIERS.map((tier) => (
                  <SelectItem key={tier.value} value={tier.value}>
                    <div className="flex items-center gap-3">
                      <Badge className={tier.color} variant="secondary">
                        {tier.price}
                      </Badge>
                      <div>
                        <span className="font-medium">{tier.label}</span>
                        <span className="text-muted-foreground ml-2 text-sm">
                          {tier.description}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              This determines the project phases and task template
            </p>
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
