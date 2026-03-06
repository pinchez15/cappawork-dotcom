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
import {
  CATEGORIES,
  RELATIONSHIPS,
  type BDCatalyst,
} from "@/server/repos/bd-catalysts";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  catalyst: BDCatalyst | null;
  onSaved: () => void;
  onDeleted: () => void;
};

export function CatalystFormDialog({
  open,
  onOpenChange,
  catalyst,
  onSaved,
  onDeleted,
}: Props) {
  const isEditing = !!catalyst;
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    company: "",
    title: "",
    email: "",
    phone: "",
    linkedin_url: "",
    category: "other",
    relationship: "cold",
    notes: "",
    last_contact_date: "",
    next_contact_date: "",
    next_action: "",
  });

  useEffect(() => {
    if (catalyst) {
      setForm({
        name: catalyst.name,
        company: catalyst.company || "",
        title: catalyst.title || "",
        email: catalyst.email || "",
        phone: catalyst.phone || "",
        linkedin_url: catalyst.linkedin_url || "",
        category: catalyst.category,
        relationship: catalyst.relationship,
        notes: catalyst.notes || "",
        last_contact_date: catalyst.last_contact_date || "",
        next_contact_date: catalyst.next_contact_date || "",
        next_action: catalyst.next_action || "",
      });
    } else {
      setForm({
        name: "",
        company: "",
        title: "",
        email: "",
        phone: "",
        linkedin_url: "",
        category: "other",
        relationship: "cold",
        notes: "",
        last_contact_date: "",
        next_contact_date: "",
        next_action: "",
      });
    }
  }, [catalyst, open]);

  const set = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);

    const payload = {
      ...form,
      last_contact_date: form.last_contact_date || null,
      next_contact_date: form.next_contact_date || null,
      next_action: form.next_action || null,
    };

    try {
      if (isEditing) {
        await fetch(`/api/admin/catalysts/${catalyst.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/admin/catalysts", {
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
    if (!catalyst) return;
    setDeleting(true);

    try {
      await fetch(`/api/admin/catalysts/${catalyst.id}`, {
        method: "DELETE",
      });
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
            {isEditing ? "Edit Catalyst" : "New Catalyst"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Name */}
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="Mike Johnson"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </div>

          {/* Company + Title */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                placeholder="Johnson CPA Group"
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Managing Partner"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
              />
            </div>
          </div>

          {/* Category + Relationship */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => set("category", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Relationship</Label>
              <Select
                value={form.relationship}
                onValueChange={(v) => set("relationship", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RELATIONSHIPS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="mike@johnsoncpa.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="(555) 123-4567"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="linkedin_url">
              LinkedIn
              {form.linkedin_url && (
                <a
                  href={form.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 inline-block text-blue-500"
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

          {/* Contact schedule */}
          <div className="border-t border-stone-100 pt-4">
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
              Relationship Building
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="last_contact_date">Last contacted</Label>
                <Input
                  id="last_contact_date"
                  type="date"
                  value={form.last_contact_date}
                  onChange={(e) => set("last_contact_date", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="next_contact_date">Next contact</Label>
                <Input
                  id="next_contact_date"
                  type="date"
                  value={form.next_contact_date}
                  onChange={(e) => set("next_contact_date", e.target.value)}
                />
              </div>
            </div>
            <div className="mt-3">
              <Label htmlFor="next_action">Next action</Label>
              <Input
                id="next_action"
                placeholder="Coffee meeting, send article, intro call..."
                value={form.next_action}
                onChange={(e) => set("next_action", e.target.value)}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="How you know them, what they do, why they're valuable..."
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
                    : "Add Catalyst"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
