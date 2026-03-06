"use client";

import { useState, Fragment } from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";

type Lead = {
  id: string;
  first_name: string;
  email: string;
  company: string;
  inputs: Record<string, unknown>;
  results: Record<string, unknown>;
  created_at: string;
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatRevenue(v: unknown): string {
  if (typeof v !== "number") return "—";
  if (v >= 10000000) return "$10M+";
  if (v >= 5000000) return "$5M-$10M";
  if (v >= 3000000) return "$3M-$5M";
  return "$1M-$3M";
}

function ExpandedRow({ lead }: { lead: Lead }) {
  const i = lead.inputs;
  const r = lead.results;

  return (
    <tr>
      <td colSpan={5} className="px-4 pb-4">
        <div className="bg-stone-50 rounded-lg p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Revenue
            </div>
            <div className="text-stone-900 font-medium">
              {formatRevenue(i.revenue)}
            </div>
          </div>
          <div>
            <div className="font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Headcount
            </div>
            <div className="text-stone-900 font-medium">
              {(i.headcount as number) || "—"} people
            </div>
          </div>
          <div>
            <div className="font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Admin Time
            </div>
            <div className="text-stone-900 font-medium">
              {(i.admin as number) || "—"}%
            </div>
          </div>
          <div>
            <div className="font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Bottleneck
            </div>
            <div className="text-stone-900 font-medium">
              {(i.bottleneck as string) || "—"}
            </div>
          </div>
          <div>
            <div className="font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Capacity Unlocked
            </div>
            <div className="text-stone-900 font-medium">
              +{(r.capacityPct as number) || 0}%
            </div>
          </div>
          <div>
            <div className="font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Revenue Capacity
            </div>
            <div className="text-stone-900 font-medium">
              ${((r.revenueCapacity as number) || 0).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Hours Freed/wk
            </div>
            <div className="text-stone-900 font-medium">
              {(r.recoverableHoursPerWeek as number) || 0}
            </div>
          </div>
          <div>
            <div className="font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Equiv. FTEs
            </div>
            <div className="text-stone-900 font-medium">
              {(r.equivalentFTEs as number) || 0}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

export function CalculatorLeadsTable({ leads }: { leads: Lead[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-3 pr-4 font-medium text-stone-600">Date</th>
            <th className="pb-3 pr-4 font-medium text-stone-600">Name</th>
            <th className="pb-3 pr-4 font-medium text-stone-600">Email</th>
            <th className="pb-3 pr-4 font-medium text-stone-600">Company</th>
            <th className="pb-3 font-medium text-stone-600 w-8"></th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {leads.map((lead) => {
            const isExpanded = expandedId === lead.id;
            const rev = lead.inputs?.revenue as number | undefined;

            return (
              <Fragment key={lead.id}>
                <tr
                  className="hover:bg-stone-50 cursor-pointer"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : lead.id)
                  }
                >
                  <td className="py-3 pr-4 text-stone-600 whitespace-nowrap">
                    {formatDate(lead.created_at)}
                  </td>
                  <td className="py-3 pr-4 font-medium text-stone-900">
                    {lead.first_name}
                  </td>
                  <td className="py-3 pr-4 text-stone-600">{lead.email}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-stone-900">{lead.company}</span>
                      {rev && rev >= 3000000 && (
                        <Badge className="bg-green-100 text-green-800 text-[10px]">
                          ICP
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="py-3 text-stone-400">
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </td>
                </tr>
                {isExpanded && <ExpandedRow lead={lead} />}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

