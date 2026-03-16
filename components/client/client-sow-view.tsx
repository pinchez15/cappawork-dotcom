"use client";

import { useState, useRef } from "react";
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
  PenLine,
  CheckCircle2,
} from "lucide-react";
import { SignaturePad, type SignaturePadRef } from "@/components/sow/signature-pad";
import { toast } from "sonner";
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
  const [signingLoading, setSigningLoading] = useState<string | null>(null);
  const signaturePadRefs = useRef<Record<string, SignaturePadRef | null>>({});

  async function handleViewPdf(sowId: string) {
    if (pdfUrls[sowId]) {
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

  async function handleCounterSign(sowId: string) {
    const pad = signaturePadRefs.current[sowId];
    if (!pad || pad.isEmpty()) {
      toast.error("Please draw your signature first");
      return;
    }

    setSigningLoading(sowId);
    try {
      const res = await fetch(`/api/sow/${sowId}/countersign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signatureDataUrl: pad.toDataURL(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to counter-sign");
      toast.success("Document signed successfully!");
      // Reload page to show updated status
      window.location.reload();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to sign";
      toast.error(message);
    } finally {
      setSigningLoading(null);
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
      {sowDocuments.map((sow) => {
        const isAwaitingSignature = sow.status === "admin_signed";
        const isFullyExecuted = sow.status === "countersigned";
        const isLegacySigned = sow.status === "signed";

        return (
          <Card key={sow.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileSignature className="h-5 w-5 text-blue-600" />
                  {sow.title}
                </CardTitle>
                {isAwaitingSignature && (
                  <Badge className="bg-amber-100 text-amber-800">
                    Awaiting Your Signature
                  </Badge>
                )}
                {isFullyExecuted && (
                  <Badge className="bg-green-100 text-green-800">
                    Fully Executed
                  </Badge>
                )}
                {isLegacySigned && (
                  <Badge className="bg-green-100 text-green-800">Signed</Badge>
                )}
              </div>
              <div className="text-sm text-stone-500 space-y-0.5">
                {sow.admin_signed_at && (
                  <p>
                    Signed by CappaWork ({sow.admin_signed_by_name}) on{" "}
                    {new Date(sow.admin_signed_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
                {sow.signed_at && (
                  <p>
                    {isFullyExecuted ? "Counter-signed" : "Signed"} by{" "}
                    {sow.signed_by_name} on{" "}
                    {new Date(sow.signed_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* PDF View/Download */}
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

              {/* Counter-signing section (admin_signed only) */}
              {isAwaitingSignature && (
                <Card className="border-amber-200 bg-amber-50/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <PenLine className="h-4 w-4 text-amber-600" />
                      Your Signature Required
                    </CardTitle>
                    <p className="text-sm text-stone-600">
                      Please review the document above, then sign below to accept
                      the terms of this Statement of Work.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <SignaturePad
                      ref={(el) => {
                        signaturePadRefs.current[sow.id] = el;
                      }}
                    />
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={signingLoading === sow.id}
                      onClick={() => handleCounterSign(sow.id)}
                    >
                      {signingLoading === sow.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <PenLine className="h-4 w-4 mr-2" />
                      )}
                      Counter-Sign & Accept
                    </Button>
                    <p className="text-xs text-stone-400 text-center">
                      By signing, you agree to the terms outlined in this Statement of Work.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Fully executed confirmation */}
              {isFullyExecuted && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                  <p className="text-sm text-green-800">
                    This document has been signed by both parties and is fully executed.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

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
