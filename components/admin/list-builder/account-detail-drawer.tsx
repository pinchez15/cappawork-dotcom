"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  X,
  Loader2,
  Brain,
  Check,
  XCircle,
  ExternalLink,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { GtmAccount } from "@/server/repos/gtm-accounts";

type AccountDetail = GtmAccount & {
  contacts: {
    id: string;
    name: string;
    title: string | null;
    email: string | null;
    linkedin_url: string | null;
    relevance_score: number;
  }[];
  signals: {
    id: string;
    signal_type: string;
    evidence_summary: string | null;
    confidence_score: number;
    review_status: string;
  }[];
  hypothesis: {
    id: string;
    likely_pain: string | null;
    relevant_workflow: string | null;
    relevant_proof: string | null;
    recommended_offer: string | null;
    outreach_angle: string | null;
    suggested_first_question: string | null;
    suggested_email_draft: string | null;
    suggested_linkedin_message: string | null;
    confidence_score: number;
    approval_status: string;
    is_ai_generated: boolean;
  } | null;
};

type Props = {
  accountId: string | null;
  listId: string;
  onClose: () => void;
  onUpdate: () => void;
};

export function AccountDetailDrawer({
  accountId,
  listId,
  onClose,
  onUpdate,
}: Props) {
  const [account, setAccount] = useState<AccountDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [actioning, setActioning] = useState(false);

  useEffect(() => {
    if (!accountId) {
      setAccount(null);
      return;
    }
    setLoading(true);
    fetch(`/api/admin/lists/${listId}/accounts/${accountId}`)
      .then((r) => r.json())
      .then((data) => setAccount(data))
      .finally(() => setLoading(false));
  }, [accountId, listId]);

  async function generateHypothesis() {
    if (!accountId) return;
    setActioning(true);
    try {
      await fetch(`/api/admin/lists/${listId}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "hypothesis", account_ids: [accountId] }),
      });
      setTimeout(async () => {
        const res = await fetch(`/api/admin/lists/${listId}/accounts/${accountId}`);
        setAccount(await res.json());
        onUpdate();
      }, 5000);
    } finally {
      setActioning(false);
    }
  }

  async function approveHypothesis(status: "approved" | "discarded") {
    if (!accountId) return;
    setActioning(true);
    try {
      await fetch(`/api/admin/lists/${listId}/accounts/${accountId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve_hypothesis", approval_status: status }),
      });
      const res = await fetch(`/api/admin/lists/${listId}/accounts/${accountId}`);
      setAccount(await res.json());
      onUpdate();
    } finally {
      setActioning(false);
    }
  }

  async function promoteAccount() {
    if (!accountId) return;
    setActioning(true);
    try {
      await fetch(`/api/admin/lists/${listId}/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_ids: [accountId] }),
      });
      onUpdate();
      const res = await fetch(`/api/admin/lists/${listId}/accounts/${accountId}`);
      setAccount(await res.json());
    } finally {
      setActioning(false);
    }
  }

  return (
    <Sheet open={!!accountId} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : account ? (
          <>
            <SheetHeader>
              <SheetTitle>{account.company_name}</SheetTitle>
              {account.domain && (
                <a
                  href={`https://${account.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground flex items-center gap-1 hover:underline"
                >
                  {account.domain} <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </SheetHeader>

            <div className="mt-4 space-y-4">
              {/* Scores */}
              <div className="flex gap-2 flex-wrap">
                <Badge className="bg-green-100 text-green-700">
                  Fit {account.fit_score}
                </Badge>
                <Badge className="bg-purple-100 text-purple-700">
                  Pain {account.pain_score}
                </Badge>
                <Badge className="bg-blue-100 text-blue-700">
                  Founder-led {account.founder_led_score}
                </Badge>
                {account.case_study_match && (
                  <Badge variant="outline">{account.case_study_match}</Badge>
                )}
              </div>

              {/* Overview */}
              <div className="text-sm space-y-1">
                {account.industry && <p><span className="text-muted-foreground">Industry:</span> {account.industry}</p>}
                {account.location && <p><span className="text-muted-foreground">Location:</span> {account.location}</p>}
                {account.employee_count && <p><span className="text-muted-foreground">Employees:</span> {account.employee_count}</p>}
                {account.revenue_estimate && <p><span className="text-muted-foreground">Revenue:</span> {account.revenue_estimate}</p>}
                {account.description && <p className="text-muted-foreground text-xs mt-2">{account.description}</p>}
              </div>

              <Separator />

              {/* Contacts */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Contacts ({account.contacts.length})</h3>
                {account.contacts.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No contacts found. Run enrichment.</p>
                ) : (
                  <div className="space-y-2">
                    {account.contacts.map((c) => (
                      <div key={c.id} className="text-sm border rounded-lg p-2">
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-muted-foreground">{c.title}</div>
                        {c.email && <div className="text-xs">{c.email}</div>}
                        <Badge className="text-[10px] mt-1">Relevance {c.relevance_score}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              {/* Signals */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Signals ({account.signals.length})</h3>
                {account.signals.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No signals detected yet.</p>
                ) : (
                  <div className="space-y-2">
                    {account.signals.map((s) => (
                      <div key={s.id} className="text-xs border rounded-lg p-2">
                        <div className="flex justify-between">
                          <span className="font-medium capitalize">{s.signal_type.replace(/_/g, " ")}</span>
                          <Badge variant="outline" className="text-[10px]">{s.confidence_score}%</Badge>
                        </div>
                        <p className="text-muted-foreground mt-1">{s.evidence_summary}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              {/* Hypothesis */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold">Sales Hypothesis</h3>
                  {!account.hypothesis && (
                    <Button size="sm" variant="outline" disabled={actioning} onClick={generateHypothesis}>
                      {actioning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Brain className="h-3.5 w-3.5 mr-1" />}
                      Generate
                    </Button>
                  )}
                </div>

                {account.hypothesis ? (
                  <div className="space-y-3 text-sm border rounded-lg p-3 bg-muted/30">
                    {account.hypothesis.is_ai_generated && (
                      <div className="flex items-center gap-1 text-xs text-amber-600">
                        <AlertTriangle className="h-3 w-3" />
                        AI-generated — review before outreach
                      </div>
                    )}
                    {account.hypothesis.likely_pain && (
                      <div>
                        <div className="text-xs font-medium text-muted-foreground">Likely Pain</div>
                        <p>{account.hypothesis.likely_pain}</p>
                      </div>
                    )}
                    {account.hypothesis.relevant_proof && (
                      <div>
                        <div className="text-xs font-medium text-muted-foreground">Proof</div>
                        <p>{account.hypothesis.relevant_proof}</p>
                      </div>
                    )}
                    {account.hypothesis.recommended_offer && (
                      <div>
                        <div className="text-xs font-medium text-muted-foreground">Recommended Offer</div>
                        <p>{account.hypothesis.recommended_offer}</p>
                      </div>
                    )}
                    {account.hypothesis.outreach_angle && (
                      <div>
                        <div className="text-xs font-medium text-muted-foreground">Outreach Angle</div>
                        <p>{account.hypothesis.outreach_angle}</p>
                      </div>
                    )}
                    {account.hypothesis.suggested_email_draft && (
                      <div>
                        <div className="text-xs font-medium text-muted-foreground">Email Draft</div>
                        <Textarea
                          readOnly
                          value={account.hypothesis.suggested_email_draft}
                          rows={4}
                          className="text-xs mt-1"
                        />
                      </div>
                    )}
                    {account.hypothesis.approval_status === "draft" && (
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" disabled={actioning} onClick={() => approveHypothesis("approved")}>
                          <Check className="h-3.5 w-3.5 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" disabled={actioning} onClick={() => approveHypothesis("discarded")}>
                          <XCircle className="h-3.5 w-3.5 mr-1" /> Discard
                        </Button>
                      </div>
                    )}
                    {account.hypothesis.approval_status === "approved" && (
                      <Badge className="bg-green-100 text-green-700 text-[10px]">Approved</Badge>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Generate a CappaWork-specific sales hypothesis for this account.
                  </p>
                )}
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                {account.gtm_stage && !["discovered", "list_built"].includes(account.gtm_stage) ? (
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/admin/crm/${accountId}`}>
                      View in CRM
                    </Link>
                  </Button>
                ) : (
                  <Button size="sm" disabled={actioning} onClick={promoteAccount}>
                    {actioning ? (
                      <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5 mr-1" />
                    )}
                    Promote to Pipeline
                  </Button>
                )}
              </div>

              {account.next_action && (
                <p className="text-xs text-muted-foreground">
                  Next: {account.next_action}
                </p>
              )}
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
