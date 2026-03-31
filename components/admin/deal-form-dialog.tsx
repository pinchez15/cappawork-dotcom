"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, ExternalLink } from "lucide-react";
import { STAGES, type BDDeal } from "@/server/repos/bd-deals";
import type { BDCatalyst } from "@/server/repos/bd-catalysts";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deal: BDDeal | null;
  defaultStage: string;
  catalysts: BDCatalyst[];
  onSaved: () => void;
  onDeleted: () => void;
};

const SOURCES = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "referral", label: "Referral" },
  { value: "inbound", label: "Inbound" },
  { value: "calculator", label: "Calculator Lead" },
  { value: "other", label: "Other" },
];

export function DealFormDialog({
  open,
  onOpenChange,
  deal,
  defaultStage,
  catalysts,
  onSaved,
  onDeleted,
}: Props) {
  const isEditing = !!deal;

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    contact_name: "",
    contact_title: "",
    email: "",
    linkedin_url: "",
    value: "",
    stage: defaultStage,
    source: "linkedin",
    referral_partner: "",
    catalyst_id: "",
    follow_up_date: "",
    next_action: "",
    notes: "",
  });

  useEffect(() => {
    if (deal) {
      setForm({
        name: deal.name,
        company: deal.company || "",
        contact_name: deal.contact_name || "",
        contact_title: deal.contact_title || "",
        email: deal.email || "",
        linkedin_url: deal.linkedin_url || "",
        value: deal.value ? String(deal.value) : "",
        stage: deal.stage,
        source: deal.source,
        referral_partner: deal.referral_partner || "",
        catalyst_id: deal.catalyst_id || "",
        follow_up_date: deal.follow_up_date || "",
        next_action: deal.next_action || "",
        notes: deal.notes || "",
      });
    } else {
      setForm({
        name: "",
        company: "",
        contact_name: "",
        contact_title: "",
        email: "",
        linkedin_url: "",
        value: "",
        stage: defaultStage,
        source: "linkedin",
        referral_partner: "",
        catalyst_id: "",
        follow_up_date: "",
        next_action: "",
        notes: "",
      });
    }
  }, [deal, defaultStage, open]);

  const set = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);

    const payload = {
      ...form,
      catalyst_id: form.catalyst_id || null,
      follow_up_date: form.follow_up_date || null,
      next_action: form.next_action || null,
    };

    try {
      if (isEditing) {
        await fetch(`/api/admin/bd-deals/${deal.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/admin/bd-deals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      onSaved();
    } catch {
      // handled silently
    }

    setSaving(false);
  }

  async function handleDelete() {
    if (!deal) return;
    setDeleting(true);

    try {
      await fetch(`/api/admin/bd-deals/${deal.id}`, { method: "DELETE" });
      onDeleted();
    } catch {
      // handled silently
    }

    setDeleting(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Deal" : "New Deal"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Deal name */}
          <div>
            <Label htmlFor="name">Deal name *</Label>
            <Input
              id="name"
              placeholder="e.g., Acme Services — Phase 1 Diagnostic"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </div>

          {/* Company + Value row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                placeholder="Acme Services"
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="value">Value ($)</Label>
              <Input
                id="value"
                type="number"
                placeholder="30000"
                value={form.value}
                onChange={(e) => set("value", e.target.value)}
              />
            </div>
          </div>

          {/* Contact info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="contact_name">Contact name</Label>
              <Input
                id="contact_name"
                placeholder="John Smith"
                value={form.contact_name}
                onChange={(e) => set("contact_name", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="contact_title">Title</Label>
              <Input
                id="contact_title"
                placeholder="CEO"
                value={form.contact_title}
                onChange={(e) => set("contact_title", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@acme.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="linkedin_url">
                LinkedIn URL
                {form.linkedin_url && (
                  <a
                    href={form.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 inline-block text-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-3 w-3 inline" />
                  </a>
                )}
              </Label>
              <Input
                id="linkedin_url"
                placeholder="https://linkedin.com/in/..."
                value={form.linkedin_url}
                onChange={(e) => set("linkedin_url", e.target.value)}
              />
            </div>
          </div>

          {/* Stage + Source */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Stage</Label>
              <Select
                value={form.stage}
                onValueChange={(v) => set("stage", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAGES.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Source</Label>
              <Select
                value={form.source}
                onValueChange={(v) => set("source", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SOURCES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Referral / Catalyst */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Referred by</Label>
              <Select
                value={form.catalyst_id || "none"}
                onValueChange={(v) =>
                  set("catalyst_id", v === "none" ? "" : v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="No referral" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No referral</SelectItem>
                  {catalysts.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                      {c.company ? ` (${c.company})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="referral_partner">Referral note</Label>
              <Input
                id="referral_partner"
                placeholder="Additional context"
                value={form.referral_partner}
                onChange={(e) => set("referral_partner", e.target.value)}
              />
            </div>
          </div>

          {/* Follow-up */}
          <div className="border-t border-stone-100 pt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Follow-up
              </div>
              <div className="flex gap-1">
                {[
                  { label: "Tomorrow", days: 1 },
                  { label: "1 week", days: 7 },
                  { label: "2 weeks", days: 14 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      const d = new Date();
                      d.setDate(d.getDate() + preset.days);
                      set("follow_up_date", d.toISOString().split("T")[0]);
                    }}
                    className="text-[10px] px-2 py-0.5 rounded-full border border-stone-200 text-stone-500 hover:bg-stone-100 hover:text-stone-700 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
                {form.follow_up_date && (
                  <button
                    type="button"
                    onClick={() => set("follow_up_date", "")}
                    className="text-[10px] px-2 py-0.5 rounded-full border border-red-200 text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="follow_up_date">Follow-up date</Label>
                <Input
                  id="follow_up_date"
                  type="date"
                  value={form.follow_up_date}
                  onChange={(e) => set("follow_up_date", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="next_action">Next action</Label>
                <Input
                  id="next_action"
                  placeholder="Send proposal, schedule call..."
                  value={form.next_action}
                  onChange={(e) => set("next_action", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Context, next steps, anything relevant..."
              rows={3}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            {isEditing ? (
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={handleDelete}
                disabled={deleting}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || !form.name.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {saving
                  ? "Saving..."
                  : isEditing
                    ? "Save Changes"
                    : "Create Deal"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
