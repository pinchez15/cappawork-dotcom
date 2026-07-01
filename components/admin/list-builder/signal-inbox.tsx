"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Check, X, Clock, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { GtmSignalWithAccount } from "@/server/repos/gtm-signals";

type Props = {
  initialSignals: GtmSignalWithAccount[];
};

export function SignalInbox({ initialSignals }: Props) {
  const [signals, setSignals] = useState(initialSignals);
  const [actioning, setActioning] = useState<string | null>(null);

  async function reviewSignal(
    signalId: string,
    status: "accepted" | "rejected" | "snoozed"
  ) {
    setActioning(signalId);
    try {
      const res = await fetch(`/api/admin/lists/signals/${signalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review_status: status }),
      });
      if (res.ok) {
        setSignals((prev) => prev.filter((s) => s.id !== signalId));
      }
    } finally {
      setActioning(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/list-builder">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Signal Inbox</h1>
          <p className="text-sm text-muted-foreground">
            Review buying signals and update account scores.
          </p>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Signal</TableHead>
              <TableHead>Evidence</TableHead>
              <TableHead className="text-center">Confidence</TableHead>
              <TableHead className="text-center">Fit</TableHead>
              <TableHead>Action</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {signals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  No pending signals. Run enrichment on lists to detect signals.
                </TableCell>
              </TableRow>
            ) : (
              signals.map((signal) => (
                <TableRow key={signal.id}>
                  <TableCell className="font-medium text-sm">
                    {signal.company_name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {signal.signal_type.replace(/_/g, " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs max-w-[240px]">
                    {signal.evidence_summary}
                    {signal.evidence_url && (
                      <a
                        href={signal.evidence_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1 inline text-primary"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className="text-[10px]">{signal.confidence_score}%</Badge>
                  </TableCell>
                  <TableCell className="text-center tabular-nums">
                    {signal.account_fit_score}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[120px] truncate">
                    {signal.action_recommendation || "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-green-600"
                        disabled={actioning === signal.id}
                        onClick={() => reviewSignal(signal.id, "accepted")}
                      >
                        {actioning === signal.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Check className="h-3.5 w-3.5" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        disabled={actioning === signal.id}
                        onClick={() => reviewSignal(signal.id, "snoozed")}
                      >
                        <Clock className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-red-500"
                        disabled={actioning === signal.id}
                        onClick={() => reviewSignal(signal.id, "rejected")}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
