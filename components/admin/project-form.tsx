"use client";

import { useFormState, useFormStatus } from "react-dom";
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
    value: "internal_tool",
    label: "Internal Tool",
    price: "$9,900",
    description: "Core rebuild with clean architecture",
    color: "bg-tier-internal text-white",
  },
  {
    value: "scale_ready",
    label: "Scale-Ready",
    price: "$14,900",
    description: "Scalability, RBAC, and analytics",
    color: "bg-tier-scale text-white",
  },
  {
    value: "commercial_product",
    label: "Commercial Product",
    price: "$24,900",
    description: "Full product with billing and integrations",
    color: "bg-tier-commercial text-white",
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
