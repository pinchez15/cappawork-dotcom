"use client";

import { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Check, RotateCcw, Download } from "lucide-react";
import type { SowDocument } from "@/server/repos/sow";

interface SigningViewProps {
  sow: SowDocument;
  token: string;
}

export function SigningView({ sow, token }: SigningViewProps) {
  const sigPadRef = useRef<SignatureCanvas | null>(null);
  const [signerName, setSignerName] = useState("");
  const [signerEmail, setSignerEmail] = useState(sow.sow_data?.clientEmail || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(true);

  useEffect(() => {
    async function loadPdf() {
      try {
        const res = await fetch(`/api/sow/preview?token=${token}`);
        if (res.ok) {
          const data = await res.json();
          setPdfUrl(data.url);
        }
      } catch {
        // PDF preview optional — signing still works
      } finally {
        setLoadingPdf(false);
      }
    }
    loadPdf();
  }, [token]);

  function clearSignature() {
    sigPadRef.current?.clear();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!signerName.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!signerEmail.trim()) {
      setError("Please enter your email");
      return;
    }
    if (sigPadRef.current?.isEmpty()) {
      setError("Please sign above before submitting");
      return;
    }

    const signatureDataUrl = sigPadRef.current?.toDataURL("image/png");
    if (!signatureDataUrl) {
      setError("Could not capture signature");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/sow/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          signerName: signerName.trim(),
          signerEmail: signerEmail.trim(),
          signatureDataUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signing failed");

      setIsSigned(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Signing failed";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSigned) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-semibold text-stone-900 mb-2">
          Document Signed
        </h1>
        <p className="text-stone-500">
          Thank you, {signerName}. The signed document has been recorded. You
          will receive a copy from the CappaWork team.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* PDF Document Preview */}
      <Card>
        <CardHeader>
          <CardTitle>{sow.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingPdf ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
            </div>
          ) : pdfUrl ? (
            <div className="space-y-3">
              <iframe
                src={pdfUrl}
                className="w-full h-[600px] rounded-lg border border-stone-200"
                title="Statement of Work"
              />
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(pdfUrl, "_blank")}
                >
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Download PDF
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-stone-500 py-4">
              Please review the document sent to you before signing below.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Signature Section */}
      <Card>
        <CardHeader>
          <CardTitle>Sign Document</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="signer-name">Full Name</Label>
                <Input
                  id="signer-name"
                  placeholder="Your full name"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signer-email">Email</Label>
                <Input
                  id="signer-email"
                  type="email"
                  placeholder="your@email.com"
                  value={signerEmail}
                  onChange={(e) => setSignerEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Signature</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearSignature}
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              </div>
              <div className="border-2 border-stone-200 rounded-lg bg-white touch-none">
                <SignatureCanvas
                  ref={sigPadRef}
                  canvasProps={{
                    className: "w-full h-40",
                    style: { width: "100%", height: "160px" },
                  }}
                  penColor="#1c1917"
                  minWidth={1.5}
                  maxWidth={3}
                />
              </div>
              <p className="text-xs text-stone-400">
                Sign in the box above using your mouse or finger
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              Sign & Submit
            </Button>

            <p className="text-xs text-stone-400 text-center">
              By clicking &ldquo;Sign & Submit&rdquo;, you agree to the terms
              outlined in this Statement of Work. Your signature, name, email,
              and IP address will be recorded for audit purposes.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
