"use client";

import { useDraggable } from "@dnd-kit/core";
import { GripVertical, Linkedin, UserCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BDDeal } from "@/server/repos/bd-deals";

const AGING_THRESHOLDS: Record<string, number> = {
  lead: 10,
  contacted: 14,
  discovery: 21,
  proposal: 21,
};

function getDaysInStage(deal: BDDeal): number {
  const updated = new Date(deal.updated_at);
  const now = new Date();
  return Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24));
}

function isStale(deal: BDDeal): { stale: boolean; days: number } {
  const threshold = AGING_THRESHOLDS[deal.stage];
  if (!threshold) return { stale: false, days: 0 };
  const days = getDaysInStage(deal);
  return { stale: days >= threshold, days };
}

type Props = {
  deal: BDDeal;
  onEdit: (deal: BDDeal) => void;
};

const sourceBadge: Record<string, { label: string; className: string }> = {
  linkedin: { label: "LinkedIn", className: "bg-blue-100 text-blue-700" },
  referral: { label: "Referral", className: "bg-amber-100 text-amber-700" },
  inbound: { label: "Inbound", className: "bg-green-100 text-green-700" },
  calculator: {
    label: "Calculator",
    className: "bg-purple-100 text-purple-700",
  },
  other: { label: "Other", className: "bg-stone-100 text-stone-600" },
};

export function DealCard({ deal, onEdit }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: deal.id });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  const badge = sourceBadge[deal.source] || sourceBadge.other;
  const aging = isStale(deal);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg border p-3 shadow-sm cursor-pointer hover:border-stone-300 transition-colors ${
        isDragging ? "opacity-50" : ""
      } ${aging.stale ? "border-amber-300 bg-amber-50/30" : "border-stone-200"}`}
      onClick={() => onEdit(deal)}
    >
      <div className="flex items-start gap-2">
        <button
          {...listeners}
          {...attributes}
          className="mt-0.5 text-stone-300 hover:text-stone-500 cursor-grab active:cursor-grabbing shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-stone-900 truncate">
            {deal.name}
          </div>
          {deal.company && (
            <div className="text-xs text-stone-500 truncate mt-0.5">
              {deal.company}
            </div>
          )}
          <div className="flex items-center gap-2 mt-2">
            {deal.value && (
              <span className="text-xs font-bold text-stone-700">
                ${deal.value.toLocaleString()}
              </span>
            )}
            <Badge className={`text-[10px] px-1.5 py-0 ${badge.className}`}>
              {badge.label}
            </Badge>
            {aging.stale && (
              <span className="flex items-center gap-0.5 text-[10px] text-amber-600 font-medium">
                <Clock className="h-2.5 w-2.5" />
                {aging.days}d
              </span>
            )}
          </div>
          {(deal.contact_name || deal.referral_partner) && (
            <div className="flex items-center gap-3 mt-2 text-xs text-stone-400">
              {deal.contact_name && (
                <span className="flex items-center gap-1 truncate">
                  {deal.linkedin_url ? (
                    <Linkedin className="h-3 w-3 shrink-0" />
                  ) : (
                    <UserCircle className="h-3 w-3 shrink-0" />
                  )}
                  {deal.contact_name}
                </span>
              )}
              {deal.referral_partner && (
                <span className="truncate">
                  via {deal.referral_partner}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
