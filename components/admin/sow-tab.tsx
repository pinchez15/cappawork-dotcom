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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SowForm } from "./sow-form";
import { SignaturePad, type SignaturePadRef } from "@/components/sow/signature-pad";
import {
  deleteSowAction,
  publishSowToClientAction,
  unpublishSowFromClientAction,
  sendSowForSigningAction,
  voidSowAction,
  adminSignSowAction,
} from "@/server/actions/sow";
import {
  Eye,
  EyeOff,
  Download,
  Send,
  Link2,
  ExternalLink,
  Share2,
  Ban,
  Trash2,
  Loader2,
  FileSignature,
  PenLine,
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
    admin_signed: "bg-blue-100 text-blue-800",
    countersigned: "bg-green-100 text-green-800",
    voided: "bg-red-100 text-red-700",
  };
  const labels: Record<string, string> = {
    draft: "Draft",
    sent: "Sent",
    signed: "Signed",
    admin_signed: "Admin Signed",
    countersigned: "Fully Executed",
    voided: "Voided",
  };
  return <Badge className={styles[status] || ""}>{labels[status] || status}</Badge>;
}

export function SowTab({ projectId, sowDocuments }: SowTabProps) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [previewSowId, setPreviewSowId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [signingDialogSowId, setSigningDialogSowId] = useState<string | null>(null);
  const [adminSignerName, setAdminSignerName] = useState("Nathan Pinches");
  const signaturePadRef = useRef<SignaturePadRef>(null);

  async function handlePreview(sowId: string) {
    if (previewSowId === sowId) {
      setPreviewSowId(null);
      setPreviewUrl(null);
      return;
    }

    setLoadingPreview(true);
    setPreviewSowId(sowId);
    try {
      const res = await fetch(`/api/sow/${sowId}/pdf`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load PDF");
      setPreviewUrl(data.url);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load preview";
      toast.error(message);
      setPreviewSowId(null);
    } finally {
      setLoadingPreview(false);
    }
  }

  async function handlePublish(sowId: string, publish: boolean) {
    setLoadingAction(`publish-${sowId}`);
    try {
      if (publish) {
        await publishSowToClientAction(sowId);
        toast.success("SOW published to client portal");
      } else {
        await unpublishSowFromClientAction(sowId);
        toast.success("SOW hidden from client portal");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update";
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

  async function handleSend(sowId: string) {
    setLoadingAction(`send-${sowId}`);
    try {
      const result = await sendSowForSigningAction(sowId);
      const signingUrl = `${window.location.origin}/sign/${result.token}`;
      await navigator.clipboard.writeText(signingUrl);
      toast.success("Signing link copied to clipboard — send it to your client");
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

  async function handleDelete(sowId: string) {
    setLoadingAction(`delete-${sowId}`);
    try {
      await deleteSowAction(sowId);
      toast.success("SOW deleted");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete SOW";
      toast.error(message);
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleAdminSign(sowId: string) {
    if (!adminSignerName.trim()) {
      toast.error("Name is required");
      return;
    }
    if (signaturePadRef.current?.isEmpty()) {
      toast.error("Please draw your signature");
      return;
    }

    setLoadingAction(`admin-sign-${sowId}`);
    try {
      await adminSignSowAction({
        sowId,
        signerName: adminSignerName.trim(),
        signatureDataUrl: signaturePadRef.current!.toDataURL(),
      });
      setSigningDialogSowId(null);
      toast.success("SOW signed and published to client portal");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to sign SOW";
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
            <p>No SOWs yet. Upload one to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sowDocuments.map((sow) => (
            <Card key={sow.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2 mb-1">
                      {sow.title}
                      {statusBadge(sow.status)}
                    </CardTitle>
                    <div className="text-sm text-stone-500 space-y-0.5">
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
                      {sow.admin_signed_at && (
                        <p>
                          Admin signed by {sow.admin_signed_by_name} on{" "}
                          {new Date(sow.admin_signed_at).toLocaleDateString("en-US")}
                        </p>
                      )}
                      {sow.signed_at && (
                        <p>
                          Client signed by {sow.signed_by_name} on{" "}
                          {new Date(sow.signed_at).toLocaleDateString("en-US")}
                        </p>
                      )}
                      {sow.status === "admin_signed" && (
                        <p className="text-amber-600 text-xs font-medium">
                          Awaiting client counter-signature
                        </p>
                      )}
                      {sow.status === "sent" && sow.signing_token_expires_at && (
                        <p className="text-xs text-stone-400">
                          Signing link expires:{" "}
                          {new Date(
                            sow.signing_token_expires_at
                          ).toLocaleDateString("en-US")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {/* Action buttons — labeled */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Preview PDF */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(sow.id)}
                    disabled={loadingPreview && previewSowId === sow.id}
                  >
                    {loadingPreview && previewSowId === sow.id ? (
                      <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    ) : previewSowId === sow.id ? (
                      <EyeOff className="h-3.5 w-3.5 mr-1.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5 mr-1.5" />
                    )}
                    {previewSowId === sow.id ? "Hide Preview" : "Preview PDF"}
                  </Button>

                  {/* Download */}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={loadingAction === `download-${sow.id}`}
                    onClick={() => handleDownload(sow.id)}
                  >
                    {loadingAction === `download-${sow.id}` ? (
                      <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    ) : (
                      <Download className="h-3.5 w-3.5 mr-1.5" />
                    )}
                    Download
                  </Button>

                  {/* Admin Sign (draft only) */}
                  {sow.status === "draft" && (
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => setSigningDialogSowId(sow.id)}
                    >
                      <PenLine className="h-3.5 w-3.5 mr-1.5" />
                      Admin Sign
                    </Button>
                  )}

                  {/* Send for Signing — legacy token flow (draft only) */}
                  {sow.status === "draft" && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={loadingAction === `send-${sow.id}`}
                      onClick={() => handleSend(sow.id)}
                    >
                      {loadingAction === `send-${sow.id}` ? (
                        <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                      ) : (
                        <Send className="h-3.5 w-3.5 mr-1.5" />
                      )}
                      Send for Client Signing
                    </Button>
                  )}

                  {/* Signing actions (sent only) */}
                  {sow.status === "sent" && sow.signing_token && (
                    <>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() =>
                          window.open(`/sign/${sow.signing_token}`, "_blank")
                        }
                      >
                        <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                        Open Signing Page
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 border-blue-200"
                        onClick={() => handleCopyLink(sow.signing_token!)}
                      >
                        <Link2 className="h-3.5 w-3.5 mr-1.5" />
                        Copy Link
                      </Button>
                    </>
                  )}

                  {/* Publish to Client (signed only) */}
                  {sow.status === "signed" && (
                    <Button
                      variant={sow.client_visible ? "outline" : "default"}
                      size="sm"
                      className={sow.client_visible
                        ? "text-stone-500 border-stone-200"
                        : "bg-green-600 hover:bg-green-700 text-white"
                      }
                      disabled={loadingAction === `publish-${sow.id}`}
                      onClick={() => handlePublish(sow.id, !sow.client_visible)}
                    >
                      {loadingAction === `publish-${sow.id}` ? (
                        <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                      ) : (
                        <Share2 className="h-3.5 w-3.5 mr-1.5" />
                      )}
                      {sow.client_visible ? "Unpublish from Portal" : "Publish to Client"}
                    </Button>
                  )}

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Void (draft, sent, or admin_signed) */}
                  {["draft", "sent", "admin_signed"].includes(sow.status) && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-stone-400 hover:text-red-600"
                          disabled={loadingAction === `void-${sow.id}`}
                        >
                          <Ban className="h-3.5 w-3.5 mr-1.5" />
                          Void
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

                  {/* Delete */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-stone-400 hover:text-red-600"
                        disabled={loadingAction === `delete-${sow.id}`}
                      >
                        {loadingAction === `delete-${sow.id}` ? (
                          <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                        )}
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this SOW?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the SOW and its PDF
                          files. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => handleDelete(sow.id)}
                        >
                          Delete SOW
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                {/* PDF Preview */}
                {previewSowId === sow.id && previewUrl && (
                  <iframe
                    src={previewUrl}
                    className="w-full rounded-lg border border-stone-200"
                    style={{ height: "calc(100vh - 120px)" }}
                    title={`Preview: ${sow.title}`}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Admin Signing Dialog */}
      <Dialog
        open={!!signingDialogSowId}
        onOpenChange={(open) => {
          if (!open) setSigningDialogSowId(null);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Sign as CappaWork</DialogTitle>
            <DialogDescription>
              Your signature will be added to the SOW. The document will then be
              sent to the client portal for their counter-signature.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-signer-name">Your Name</Label>
              <Input
                id="admin-signer-name"
                value={adminSignerName}
                onChange={(e) => setAdminSignerName(e.target.value)}
                placeholder="Full name"
              />
            </div>
            <div className="space-y-2">
              <Label>Signature</Label>
              <SignaturePad ref={signaturePadRef} />
            </div>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loadingAction === `admin-sign-${signingDialogSowId}`}
              onClick={() => signingDialogSowId && handleAdminSign(signingDialogSowId)}
            >
              {loadingAction === `admin-sign-${signingDialogSowId}` ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <PenLine className="h-4 w-4 mr-2" />
              )}
              Sign & Send to Client
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
