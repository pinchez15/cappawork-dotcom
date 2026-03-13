"use client";

import { useRef, useState } from "react";
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
import { Loader2, Check, RotateCcw } from "lucide-react";
import type { SowDocument } from "@/server/repos/sow";

interface SigningViewProps {
  sow: SowDocument;
  token: string;
}

export function SigningView({ sow, token }: SigningViewProps) {
  const sigPadRef = useRef<SignatureCanvas | null>(null);
  const [signerName, setSignerName] = useState("");
  const [signerEmail, setSignerEmail] = useState(sow.sow_data.clientEmail || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const { sow_data } = sow;

  return (
    <div className="space-y-6">
      {/* SOW Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{sow.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-stone-700">
          <div>
            <p className="font-medium text-stone-900 mb-1">Prepared for</p>
            <p>
              {sow_data.clientName}
              {sow_data.clientCompany && ` — ${sow_data.clientCompany}`}
            </p>
          </div>

          <div>
            <p className="font-medium text-stone-900 mb-1">Scope of Work</p>
            <p className="whitespace-pre-wrap">{sow_data.scope}</p>
          </div>

          {sow_data.deliverables.length > 0 && (
            <div>
              <p className="font-medium text-stone-900 mb-1">Deliverables</p>
              <ul className="list-disc list-inside space-y-1">
                {sow_data.deliverables.map((d, i) => (
                  <li key={i}>
                    <span className="font-medium">{d.title}</span>
                    {d.description && (
                      <span className="text-stone-500">
                        {" "}
                        — {d.description}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {sow_data.timeline && (
            <div>
              <p className="font-medium text-stone-900 mb-1">Timeline</p>
              <p>{sow_data.timeline}</p>
            </div>
          )}

          {sow_data.lineItems.length > 0 && (
            <div>
              <p className="font-medium text-stone-900 mb-2">Pricing</p>
              <div className="border border-stone-200 rounded-lg overflow-hidden">
                {sow_data.lineItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between px-4 py-2 border-b border-stone-100 last:border-b-0"
                  >
                    <span>{item.description}</span>
                    <span className="font-medium">{item.amount}</span>
                  </div>
                ))}
                {sow_data.totalAmount && (
                  <div className="flex justify-between px-4 py-3 bg-stone-50 font-semibold">
                    <span>Total</span>
                    <span className="text-blue-600">
                      {sow_data.totalAmount}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {sow_data.paymentTerms && (
            <div>
              <p className="font-medium text-stone-900 mb-1">Payment Terms</p>
              <p>{sow_data.paymentTerms}</p>
            </div>
          )}

          {sow_data.termsAndConditions && (
            <div>
              <p className="font-medium text-stone-900 mb-1">
                Terms & Conditions
              </p>
              <p className="whitespace-pre-wrap text-xs text-stone-500">
                {sow_data.termsAndConditions}
              </p>
            </div>
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
