"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Check,
  XCircle,
  AlertTriangle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { GTM_STAGES } from "@/server/repos/gtm-accounts";
import { OUTREACH_STAGES } from "@/server/repos/gtm-contacts";

type AccountDetail = {
  id: string;
  company_name: string;
  domain: string | null;
  industry: string | null;
  location: string | null;
  employee_count: number | null;
  revenue_estimate: string | null;
  description: string | null;
  fit_score: number;
  pain_score: number;
  founder_led_score: number;
  case_study_match: string | null;
  gtm_stage: string;
  next_action: string | null;
  vertical_name: string | null;
  contacts: {
    id: string;
    name: string;
    title: string | null;
    email: string | null;
    linkedin_url: string | null;
    relevance_score: number;
    outreach_stage: string;
    is_primary: boolean;
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
    relevant_proof: string | null;
    recommended_offer: string | null;
    outreach_angle: string | null;
    suggested_email_draft: string | null;
    suggested_linkedin_message: string | null;
    approval_status: string;
    is_ai_generated: boolean;
  } | null;
  source_history: {
    source_type: string;
    source_name: string | null;
    list_name: string | null;
    added_at: string;
  }[];
};

type Props = { account: AccountDetail };

export function CrmAccountDetail({ account: initial }: Props) {
  const [account, setAccount] = useState(initial);
  const [saving, setSaving] = useState(false);

  async function updateStage(stage: string) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/crm/${account.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gtm_stage: stage }),
      });
      if (res.ok) {
        const updated = await res.json();
        setAccount((prev) => ({ ...prev, gtm_stage: updated.gtm_stage }));
      }
    } finally {
      setSaving(false);
    }
  }

  async function approveHypothesis(status: "approved" | "discarded") {
    setSaving(true);
    try {
      await fetch(`/api/admin/crm/${account.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve_hypothesis", approval_status: status }),
      });
      window.location.reload();
    } finally {
      setSaving(false);
    }
  }

  const stageInfo = GTM_STAGES.find((s) => s.value === account.gtm_stage);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/crm"><ChevronLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{account.company_name}</h1>
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
        </div>
        <Badge className={stageInfo?.color}>{stageInfo?.label}</Badge>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Badge className="bg-green-100 text-green-700">Fit {account.fit_score}</Badge>
        <Badge className="bg-purple-100 text-purple-700">Pain {account.pain_score}</Badge>
        <Badge className="bg-blue-100 text-blue-700">Founder {account.founder_led_score}</Badge>
        {account.case_study_match && <Badge variant="outline">{account.case_study_match}</Badge>}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Pipeline Stage</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={account.gtm_stage} onValueChange={updateStage} disabled={saving}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {GTM_STAGES.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {account.next_action && (
            <p className="text-xs text-muted-foreground mt-2">Next: {account.next_action}</p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 text-sm">
        {account.industry && <div><span className="text-muted-foreground">Industry:</span> {account.industry}</div>}
        {account.location && <div><span className="text-muted-foreground">Location:</span> {account.location}</div>}
        {account.employee_count && <div><span className="text-muted-foreground">Employees:</span> {account.employee_count}</div>}
        {account.vertical_name && <div><span className="text-muted-foreground">Vertical:</span> {account.vertical_name}</div>}
      </div>
      {account.description && (
        <p className="text-sm text-muted-foreground">{account.description}</p>
      )}

      <Separator />

      <div>
        <h2 className="text-sm font-semibold mb-3">Contacts</h2>
        <div className="space-y-2">
          {account.contacts.map((c) => {
            const outreach = OUTREACH_STAGES.find((s) => s.value === c.outreach_stage);
            return (
              <Card key={c.id}>
                <CardContent className="py-3 flex justify-between items-start">
                  <div>
                    <div className="font-medium text-sm">
                      {c.name} {c.is_primary && <Badge variant="outline" className="text-[10px] ml-1">Primary</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground">{c.title}</div>
                    {c.email && <div className="text-xs">{c.email}</div>}
                  </div>
                  <Badge className={`text-[10px] ${outreach?.color}`}>{outreach?.label}</Badge>
                </CardContent>
              </Card>
            );
          })}
          {account.contacts.length === 0 && (
            <p className="text-xs text-muted-foreground">No contacts. Enrich from List Builder.</p>
          )}
        </div>
      </div>

      <Separator />

      <div>
        <h2 className="text-sm font-semibold mb-3">Hypothesis</h2>
        {account.hypothesis ? (
          <Card>
            <CardContent className="pt-4 space-y-3 text-sm">
              {account.hypothesis.is_ai_generated && (
                <div className="flex items-center gap-1 text-xs text-amber-600">
                  <AlertTriangle className="h-3 w-3" /> AI-generated
                </div>
              )}
              {account.hypothesis.likely_pain && <p><strong>Pain:</strong> {account.hypothesis.likely_pain}</p>}
              {account.hypothesis.recommended_offer && <p><strong>Offer:</strong> {account.hypothesis.recommended_offer}</p>}
              {account.hypothesis.outreach_angle && <p><strong>Angle:</strong> {account.hypothesis.outreach_angle}</p>}
              {account.hypothesis.suggested_email_draft && (
                <Textarea readOnly value={account.hypothesis.suggested_email_draft} rows={4} className="text-xs" />
              )}
              {account.hypothesis.approval_status === "draft" && (
                <div className="flex gap-2">
                  <Button size="sm" disabled={saving} onClick={() => approveHypothesis("approved")}>
                    <Check className="h-3.5 w-3.5 mr-1" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" disabled={saving} onClick={() => approveHypothesis("discarded")}>
                    <XCircle className="h-3.5 w-3.5 mr-1" /> Discard
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <p className="text-xs text-muted-foreground">No hypothesis yet.</p>
        )}
      </div>

      {account.signals.length > 0 && (
        <>
          <Separator />
          <div>
            <h2 className="text-sm font-semibold mb-3">Signals</h2>
            <div className="space-y-2">
              {account.signals.map((s) => (
                <div key={s.id} className="text-xs border rounded-lg p-2">
                  <span className="font-medium capitalize">{s.signal_type.replace(/_/g, " ")}</span>
                  <span className="text-muted-foreground ml-2">{s.evidence_summary}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {account.source_history.length > 0 && (
        <>
          <Separator />
          <div>
            <h2 className="text-sm font-semibold mb-2">Source History</h2>
            {account.source_history.map((s, i) => (
              <div key={i} className="text-xs text-muted-foreground">
                {s.list_name || s.source_name || s.source_type} — {new Date(s.added_at).toLocaleDateString()}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
