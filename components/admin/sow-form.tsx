"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createSowAction } from "@/server/actions/sow";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { SowData, SowDeliverable, SowLineItem } from "@/server/repos/sow";

interface SowFormProps {
  projectId: string;
}

const DEFAULT_TERMS = `1. This Statement of Work is governed by the Master Services Agreement between the parties.
2. Either party may terminate this SOW with 30 days written notice.
3. All work product created under this SOW is owned by the client upon full payment.
4. Confidential information shared during this engagement will be protected per the MSA.
5. Any changes to scope require a written amendment signed by both parties.`;

export function SowForm({ projectId }: SowFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [scope, setScope] = useState("");
  const [deliverables, setDeliverables] = useState<SowDeliverable[]>([
    { title: "", description: "" },
  ]);
  const [timeline, setTimeline] = useState("");
  const [lineItems, setLineItems] = useState<SowLineItem[]>([
    { description: "", amount: "" },
  ]);
  const [totalAmount, setTotalAmount] = useState("");
  const [paymentTerms, setPaymentTerms] = useState(
    "50% due upon signing, 50% due upon completion."
  );
  const [termsAndConditions, setTermsAndConditions] = useState(DEFAULT_TERMS);

  function resetForm() {
    setTitle("");
    setClientName("");
    setClientEmail("");
    setClientCompany("");
    setScope("");
    setDeliverables([{ title: "", description: "" }]);
    setTimeline("");
    setLineItems([{ description: "", amount: "" }]);
    setTotalAmount("");
    setPaymentTerms("50% due upon signing, 50% due upon completion.");
    setTermsAndConditions(DEFAULT_TERMS);
  }

  function addDeliverable() {
    setDeliverables([...deliverables, { title: "", description: "" }]);
  }

  function removeDeliverable(index: number) {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  }

  function updateDeliverable(
    index: number,
    field: keyof SowDeliverable,
    value: string
  ) {
    const updated = [...deliverables];
    updated[index] = { ...updated[index], [field]: value };
    setDeliverables(updated);
  }

  function addLineItem() {
    setLineItems([...lineItems, { description: "", amount: "" }]);
  }

  function removeLineItem(index: number) {
    setLineItems(lineItems.filter((_, i) => i !== index));
  }

  function updateLineItem(
    index: number,
    field: keyof SowLineItem,
    value: string
  ) {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !clientName.trim() || !scope.trim()) {
      toast.error("Title, client name, and scope are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const sowData: SowData = {
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim(),
        clientCompany: clientCompany.trim(),
        scope: scope.trim(),
        deliverables: deliverables.filter((d) => d.title.trim()),
        timeline: timeline.trim(),
        lineItems: lineItems.filter((li) => li.description.trim()),
        totalAmount: totalAmount.trim(),
        paymentTerms: paymentTerms.trim(),
        termsAndConditions: termsAndConditions.trim(),
      };

      await createSowAction({
        projectId,
        title: title.trim(),
        sowData,
      });

      toast.success("SOW created");
      resetForm();
      setOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create SOW";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create SOW
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Statement of Work</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="sow-title">SOW Title</Label>
            <Input
              id="sow-title"
              placeholder="Phase 1 — Operational Diagnostic"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Client Info */}
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wider text-stone-500">
              Client Information
            </Label>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor="sow-client-name" className="text-xs">
                  Name
                </Label>
                <Input
                  id="sow-client-name"
                  placeholder="John Smith"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="sow-client-email" className="text-xs">
                  Email
                </Label>
                <Input
                  id="sow-client-email"
                  type="email"
                  placeholder="john@company.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="sow-client-company" className="text-xs">
                  Company
                </Label>
                <Input
                  id="sow-client-company"
                  placeholder="Acme Corp"
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Scope */}
          <div className="space-y-2">
            <Label htmlFor="sow-scope">Scope of Work</Label>
            <Textarea
              id="sow-scope"
              placeholder="Describe the scope of this engagement..."
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              rows={4}
              required
            />
          </div>

          {/* Deliverables */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Deliverables</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addDeliverable}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-3">
              {deliverables.map((d, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="flex-1 space-y-1">
                    <Input
                      placeholder="Deliverable title"
                      value={d.title}
                      onChange={(e) =>
                        updateDeliverable(i, "title", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Description (optional)"
                      value={d.description}
                      onChange={(e) =>
                        updateDeliverable(i, "description", e.target.value)
                      }
                      className="text-sm"
                    />
                  </div>
                  {deliverables.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDeliverable(i)}
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <Label htmlFor="sow-timeline">Timeline</Label>
            <Textarea
              id="sow-timeline"
              placeholder="e.g., 4-6 weeks from contract signing..."
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              rows={2}
            />
          </div>

          {/* Pricing */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Line Items</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addLineItem}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {lineItems.map((item, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input
                    className="flex-1"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) =>
                      updateLineItem(i, "description", e.target.value)
                    }
                  />
                  <Input
                    className="w-32"
                    placeholder="$30,000"
                    value={item.amount}
                    onChange={(e) =>
                      updateLineItem(i, "amount", e.target.value)
                    }
                  />
                  {lineItems.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLineItem(i)}
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Label htmlFor="sow-total" className="text-sm font-medium">
                Total Amount
              </Label>
              <Input
                id="sow-total"
                className="w-40"
                placeholder="$30,000"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
              />
            </div>
          </div>

          {/* Payment Terms */}
          <div className="space-y-2">
            <Label htmlFor="sow-payment">Payment Terms</Label>
            <Textarea
              id="sow-payment"
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              rows={2}
            />
          </div>

          {/* Terms & Conditions */}
          <div className="space-y-2">
            <Label htmlFor="sow-terms">Terms & Conditions</Label>
            <Textarea
              id="sow-terms"
              value={termsAndConditions}
              onChange={(e) => setTermsAndConditions(e.target.value)}
              rows={5}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Create SOW & Generate PDF
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
