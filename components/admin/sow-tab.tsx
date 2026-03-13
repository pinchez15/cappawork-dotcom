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
import { SowForm } from "./sow-form";
import {
  sendSowForSigningAction,
  voidSowAction,
} from "@/server/actions/sow";
import {
  Send,
  Download,
  Copy,
  Ban,
  Loader2,
  FileSignature,
} from "lucide-react";
import { toast } from "sonner";
import type { SowDocument } from "@/server/repos/sow";

interface SowTabProps {
  projectId: string;
  sowDocuments: SowDocument[];
}

function statusBadge(status: SowDocument["status"]) {
  const styles: Record<string, string> = {
    draft: "bg-stone-100 text-stone-700",
    sent: "bg-blue-100 text-blue-800",
    signed: "bg-green-100 text-green-800",
    voided: "bg-red-100 text-red-700",
  };
  return <Badge className={styles[status] || ""}>{status}</Badge>;
}

export function SowTab({ projectId, sowDocuments }: SowTabProps) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  async function handleSend(sowId: string) {
    setLoadingAction(`send-${sowId}`);
    try {
      const result = await sendSowForSigningAction(sowId);
      const signingUrl = `${window.location.origin}/sign/${result.token}`;
      await navigator.clipboard.writeText(signingUrl);
      toast.success("SOW sent for signing — signing link copied to clipboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send SOW";
      toast.error(message);
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleCopyLink(token: string) {
    const signingUrl = `${window.location.origin}/sign/${token}`;
    await navigator.clipboard.writeText(signingUrl);
    toast.success("Signing link copied");
  }

  async function handleVoid(sowId: string) {
    setLoadingAction(`void-${sowId}`);
    try {
      await voidSowAction(sowId);
      toast.success("SOW voided");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to void SOW";
      toast.error(message);
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleDownload(sowId: string) {
    setLoadingAction(`download-${sowId}`);
    try {
      const res = await fetch(`/api/sow/${sowId}/pdf`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get PDF");
      window.open(data.url, "_blank");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to download";
      toast.error(message);
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Statements of Work</h2>
        <SowForm projectId={projectId} />
      </div>

      {sowDocuments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-stone-500">
            <FileSignature className="h-10 w-10 mx-auto mb-3 text-stone-400" />
            <p>No SOWs yet. Create one to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sowDocuments.map((sow) => (
            <Card key={sow.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    {sow.title}
                    {statusBadge(sow.status)}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    {/* Download PDF */}
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Download PDF"
                      disabled={loadingAction === `download-${sow.id}`}
                      onClick={() => handleDownload(sow.id)}
                    >
                      {loadingAction === `download-${sow.id}` ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                    </Button>

                    {/* Send for signing (draft only) */}
                    {sow.status === "draft" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Send for signing"
                        disabled={loadingAction === `send-${sow.id}`}
                        onClick={() => handleSend(sow.id)}
                      >
                        {loadingAction === `send-${sow.id}` ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4 text-blue-600" />
                        )}
                      </Button>
                    )}

                    {/* Copy signing link (sent only) */}
                    {sow.status === "sent" && sow.signing_token && (
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Copy signing link"
                        onClick={() => handleCopyLink(sow.signing_token!)}
                      >
                        <Copy className="h-4 w-4 text-blue-600" />
                      </Button>
                    )}

                    {/* Void (not already voided) */}
                    {sow.status !== "voided" && sow.status !== "signed" && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Void SOW"
                            disabled={loadingAction === `void-${sow.id}`}
                          >
                            <Ban className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Void this SOW?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will invalidate any signing links. The SOW
                              will be marked as voided and cannot be sent again.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => handleVoid(sow.id)}
                            >
                              Void SOW
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-sm text-stone-500 space-y-1">
                  <p>
                    Created:{" "}
                    {new Date(sow.created_at).toLocaleDateString("en-US")}
                  </p>
                  {sow.sent_at && (
                    <p>
                      Sent:{" "}
                      {new Date(sow.sent_at).toLocaleDateString("en-US")}
                    </p>
                  )}
                  {sow.signed_at && (
                    <p>
                      Signed by {sow.signed_by_name} on{" "}
                      {new Date(sow.signed_at).toLocaleDateString("en-US")}
                    </p>
                  )}
                  {sow.status === "sent" && sow.signing_token_expires_at && (
                    <p className="text-xs text-stone-400">
                      Link expires:{" "}
                      {new Date(
                        sow.signing_token_expires_at
                      ).toLocaleDateString("en-US")}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
