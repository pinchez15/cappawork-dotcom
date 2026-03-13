"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  addBillingLinkAction,
  updateBillingLinkAction,
  updateBillingLinkStatusAction,
  removeBillingLinkAction,
} from "@/server/actions/billing-links";
import {
  Link2,
  ExternalLink,
  CheckCircle2,
  Archive,
  Trash2,
  Loader2,
  Plus,
  Pencil,
  X,
  Check,
} from "lucide-react";
import { toast } from "sonner";

interface BillingLink {
  id: string;
  url: string;
  label: string;
  type: string;
  amount_display: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  project: { id: string; name: string } | null;
}

interface Project {
  id: string;
  name: string;
}

interface ClientBillingLinksProps {
  organizationId: string;
  billingLinks: BillingLink[];
  projects: Project[];
}

function statusBadge(status: string) {
  const styles: Record<string, string> = {
    active: "bg-blue-100 text-blue-800",
    paid: "bg-green-100 text-green-800",
    archived: "bg-stone-100 text-stone-500",
  };
  return (
    <Badge className={styles[status] || "bg-stone-100 text-stone-800"}>
      {status}
    </Badge>
  );
}

function typeBadge(type: string) {
  return (
    <Badge variant="outline">
      {type === "subscription" ? "Subscription" : "One-time"}
    </Badge>
  );
}

export function ClientBillingLinks({
  organizationId,
  billingLinks,
  projects,
}: ClientBillingLinksProps) {
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");
  const [amountDisplay, setAmountDisplay] = useState("");
  const [type, setType] = useState<"one_time" | "subscription">("one_time");
  const [projectId, setProjectId] = useState<string>("none");
  const [notes, setNotes] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [editLabel, setEditLabel] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editType, setEditType] = useState<"one_time" | "subscription">("one_time");
  const [editProjectId, setEditProjectId] = useState("none");
  const [editNotes, setEditNotes] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();

    if (!url.trim().startsWith("https://")) {
      toast.error("Enter a valid HTTPS payment link URL");
      return;
    }
    if (!label.trim()) {
      toast.error("Enter a label for this link");
      return;
    }

    setIsAdding(true);
    try {
      await addBillingLinkAction({
        organizationId,
        projectId: projectId === "none" ? null : projectId,
        url: url.trim(),
        label: label.trim(),
        type,
        amountDisplay: amountDisplay.trim() || null,
        notes: notes.trim() || null,
      });
      toast.success("Payment link added");
      setUrl("");
      setLabel("");
      setAmountDisplay("");
      setType("one_time");
      setProjectId("none");
      setNotes("");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to add link";
      toast.error(message);
    } finally {
      setIsAdding(false);
    }
  }

  function startEditing(link: BillingLink) {
    setEditingId(link.id);
    setEditUrl(link.url);
    setEditLabel(link.label);
    setEditAmount(link.amount_display || "");
    setEditType(link.type as "one_time" | "subscription");
    setEditProjectId(link.project?.id || "none");
    setEditNotes(link.notes || "");
  }

  async function handleSaveEdit() {
    if (!editingId) return;
    setLoadingAction(editingId);
    try {
      await updateBillingLinkAction({
        linkId: editingId,
        orgId: organizationId,
        url: editUrl,
        label: editLabel,
        type: editType,
        amountDisplay: editAmount || null,
        projectId: editProjectId === "none" ? null : editProjectId,
        notes: editNotes || null,
      });
      toast.success("Payment link updated");
      setEditingId(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update link";
      toast.error(message);
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleStatusChange(
    linkId: string,
    status: "active" | "paid" | "archived"
  ) {
    setLoadingAction(linkId);
    try {
      await updateBillingLinkStatusAction(linkId, status, organizationId);
      toast.success(`Link marked as ${status}`);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update link";
      toast.error(message);
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleDelete(linkId: string) {
    setLoadingAction(linkId);
    try {
      await removeBillingLinkAction(linkId, organizationId);
      toast.success("Link deleted");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete link";
      toast.error(message);
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Add Payment Link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Add Payment Link
          </CardTitle>
          <CardDescription>
            Paste a Stripe Payment Link created in the Stripe Dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bl-url">Payment Link URL</Label>
              <Input
                id="bl-url"
                type="url"
                placeholder="https://buy.stripe.com/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bl-label">Label</Label>
                <Input
                  id="bl-label"
                  placeholder="Phase 1 Diagnostic"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bl-amount">Amount (display only)</Label>
                <Input
                  id="bl-amount"
                  placeholder="$30,000"
                  value={amountDisplay}
                  onChange={(e) => setAmountDisplay(e.target.value)}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={type}
                  onValueChange={(v) =>
                    setType(v as "one_time" | "subscription")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one_time">One-time</SelectItem>
                    <SelectItem value="subscription">Subscription</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Project (optional)</Label>
                <Select value={projectId} onValueChange={setProjectId}>
                  <SelectTrigger>
                    <SelectValue placeholder="No project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No project</SelectItem>
                    {projects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bl-notes">Notes (optional, admin only)</Label>
              <Textarea
                id="bl-notes"
                placeholder="Internal notes about this payment link..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>
            <Button type="submit" disabled={isAdding}>
              {isAdding ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Add Link
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Payment Links Table */}
      {billingLinks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Links</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Label</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingLinks.map((link) =>
                  editingId === link.id ? (
                    <TableRow key={link.id} className="bg-stone-50">
                      <TableCell>
                        <Input
                          value={editLabel}
                          onChange={(e) => setEditLabel(e.target.value)}
                          className="h-8 text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <Select value={editProjectId} onValueChange={setEditProjectId}>
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No project</SelectItem>
                            {projects.map((p) => (
                              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                          placeholder="$0"
                          className="h-8 text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <Select value={editType} onValueChange={(v) => setEditType(v as "one_time" | "subscription")}>
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="one_time">One-time</SelectItem>
                            <SelectItem value="subscription">Subscription</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{statusBadge(link.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Save"
                            disabled={loadingAction === link.id}
                            onClick={handleSaveEdit}
                          >
                            <Check className="h-3 w-3 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Cancel"
                            onClick={() => setEditingId(null)}
                          >
                            <X className="h-3 w-3 text-stone-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow key={link.id}>
                      <TableCell className="font-medium">{link.label}</TableCell>
                      <TableCell className="text-sm text-stone-600">
                        {link.project?.name || "—"}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {link.amount_display || "—"}
                      </TableCell>
                      <TableCell>{typeBadge(link.type)}</TableCell>
                      <TableCell>{statusBadge(link.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="ghost" size="sm" title="Open link">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </a>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Edit"
                            onClick={() => startEditing(link)}
                          >
                            <Pencil className="h-3 w-3 text-blue-600" />
                          </Button>
                          {link.status === "active" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Mark paid"
                              disabled={loadingAction === link.id}
                              onClick={() =>
                                handleStatusChange(link.id, "paid")
                              }
                            >
                              <CheckCircle2 className="h-3 w-3 text-green-600" />
                            </Button>
                          )}
                          {link.status !== "archived" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Archive"
                              disabled={loadingAction === link.id}
                              onClick={() =>
                                handleStatusChange(link.id, "archived")
                              }
                            >
                              <Archive className="h-3 w-3 text-stone-500" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Delete"
                            disabled={loadingAction === link.id}
                            onClick={() => handleDelete(link.id)}
                          >
                            <Trash2 className="h-3 w-3 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
