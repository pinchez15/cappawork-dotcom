"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  FileSignature,
  CreditCard,
  Loader2,
} from "lucide-react";
import type { SowDocument } from "@/server/repos/sow";

interface ClientSowViewProps {
  sowDocuments: SowDocument[];
  billingLinks: any[];
  phases: any[];
  tasks: any[];
}

export function ClientSowView({
  sowDocuments,
  billingLinks,
  phases,
  tasks,
}: ClientSowViewProps) {
  const [loadingPdf, setLoadingPdf] = useState<string | null>(null);
  const [pdfUrls, setPdfUrls] = useState<Record<string, string>>({});

  async function handleViewPdf(sowId: string) {
    if (pdfUrls[sowId]) {
      // Already loaded — toggle off
      setPdfUrls((prev) => {
        const next = { ...prev };
        delete next[sowId];
        return next;
      });
      return;
    }

    setLoadingPdf(sowId);
    try {
      const res = await fetch(`/api/sow/${sowId}/pdf`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPdfUrls((prev) => ({ ...prev, [sowId]: data.url }));
    } catch {
      // silent
    } finally {
      setLoadingPdf(null);
    }
  }

  const activePaymentLinks = billingLinks.filter(
    (l: any) => l.status === "active"
  );

  if (sowDocuments.length === 0) {
    return (
      <div className="text-center py-12 text-stone-400">
        <FileSignature className="h-10 w-10 mx-auto mb-3" />
        <p>No documents available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Signed SOWs */}
      {sowDocuments.map((sow) => (
        <Card key={sow.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileSignature className="h-5 w-5 text-blue-600" />
                {sow.title}
              </CardTitle>
              <Badge className="bg-green-100 text-green-800">Signed</Badge>
            </div>
            {sow.signed_at && (
              <p className="text-sm text-stone-500">
                Signed by {sow.signed_by_name} on{" "}
                {new Date(sow.signed_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewPdf(sow.id)}
                disabled={loadingPdf === sow.id}
              >
                {loadingPdf === sow.id ? (
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                )}
                {pdfUrls[sow.id] ? "Hide Document" : "View Document"}
              </Button>
              {pdfUrls[sow.id] && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(pdfUrls[sow.id], "_blank")}
                >
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Download
                </Button>
              )}
            </div>

            {pdfUrls[sow.id] && (
              <iframe
                src={pdfUrls[sow.id]}
                className="w-full rounded-lg border border-stone-200"
                style={{ height: "calc(100vh - 120px)" }}
                title={sow.title}
              />
            )}
          </CardContent>
        </Card>
      ))}

      {/* Payment Links */}
      {activePaymentLinks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activePaymentLinks.map((link: any) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-3 border border-stone-200 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-stone-900">
                      {link.label}
                    </p>
                    {link.amount_display && (
                      <p className="text-sm text-stone-500">
                        {link.amount_display}
                      </p>
                    )}
                  </div>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {link.type === "subscription" ? "Subscribe" : "Pay Now"}
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Build Process */}
      {phases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Build Process</CardTitle>
            <p className="text-sm text-stone-500">
              Your project will be built in these phases
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {phases.map((phase: any, index: number) => {
                const phaseTasks = tasks.filter(
                  (t: any) => t.phase_id === phase.id
                );
                const completedCount = phaseTasks.filter(
                  (t: any) => t.is_completed
                ).length;
                const totalCount = phaseTasks.length;
                const pct =
                  totalCount > 0
                    ? Math.round((completedCount / totalCount) * 100)
                    : 0;

                return (
                  <div
                    key={phase.id}
                    className="flex items-center gap-4 p-3 border border-stone-200 rounded-lg"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-stone-100 text-sm font-semibold text-stone-600 shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-900">
                        {phase.name}
                      </p>
                      {totalCount > 0 && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-stone-400 shrink-0">
                            {completedCount}/{totalCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
