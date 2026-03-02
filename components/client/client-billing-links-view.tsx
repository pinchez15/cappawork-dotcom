"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  CheckCircle2,
  FileText,
} from "lucide-react";

interface BillingLink {
  id: string;
  url: string;
  label: string;
  type: string;
  amount_display: string | null;
  status: string;
  project: { id: string; name: string } | null;
}

interface ClientBillingLinksViewProps {
  billingLinks: BillingLink[];
}

export function ClientBillingLinksView({
  billingLinks,
}: ClientBillingLinksViewProps) {
  const activeLinks = billingLinks.filter((l) => l.status === "active");
  const paidLinks = billingLinks.filter((l) => l.status === "paid");

  if (activeLinks.length === 0 && paidLinks.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <FileText className="h-8 w-8 text-stone-300 mx-auto mb-3" />
            <p className="text-stone-500">No billing items yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Outstanding */}
      {activeLinks.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-stone-900">Outstanding</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {activeLinks.map((link) => (
              <Card key={link.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{link.label}</CardTitle>
                    <Badge variant="outline">
                      {link.type === "subscription"
                        ? "Subscription"
                        : "One-time"}
                    </Badge>
                  </div>
                  {link.project && (
                    <p className="text-sm text-stone-500">
                      {link.project.name}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  {link.amount_display && (
                    <p className="text-2xl font-semibold text-stone-900 mb-4">
                      {link.amount_display}
                    </p>
                  )}
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {link.type === "subscription" ? "Subscribe" : "Pay Now"}
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Completed */}
      {paidLinks.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-stone-900">Completed</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {paidLinks.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                      <div>
                        <p className="font-medium text-stone-900">
                          {link.label}
                        </p>
                        {link.project && (
                          <p className="text-sm text-stone-500">
                            {link.project.name}
                          </p>
                        )}
                      </div>
                    </div>
                    {link.amount_display && (
                      <span className="text-sm font-medium text-stone-600">
                        {link.amount_display}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
