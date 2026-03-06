"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, AlertTriangle, Clock, ExternalLink, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CATEGORIES,
  RELATIONSHIPS,
  type CatalystWithStats,
  type BDCatalyst,
} from "@/server/repos/bd-catalysts";
import { CatalystFormDialog } from "@/components/admin/catalyst-form-dialog";

type Props = {
  catalysts: CatalystWithStats[];
  due: BDCatalyst[];
};

function RelationshipBadge({ value }: { value: string }) {
  const rel = RELATIONSHIPS.find((r) => r.value === value);
  return (
    <Badge className={`text-[10px] ${rel?.color || "bg-stone-100 text-stone-600"}`}>
      {rel?.label || value}
    </Badge>
  );
}

function CategoryLabel({ value }: { value: string }) {
  const cat = CATEGORIES.find((c) => c.value === value);
  return <span className="text-xs text-stone-500">{cat?.label || value}</span>;
}

export function CatalystsView({ catalysts, due }: Props) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CatalystWithStats | null>(null);

  function handleSaved() {
    setDialogOpen(false);
    setEditing(null);
    router.refresh();
  }

  function handleDeleted() {
    setDialogOpen(false);
    setEditing(null);
    router.refresh();
  }

  const champions = catalysts.filter((c) => c.relationship === "champion");
  const totalReferrals = catalysts.reduce((sum, c) => sum + c.deal_count, 0);
  const totalWon = catalysts.reduce((sum, c) => sum + c.won_count, 0);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-stone-900">Catalysts</h1>
          <p className="text-stone-600 mt-1">
            People who know your ICP — build relationships, earn referrals
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
          className="rounded-full bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Catalyst
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-stone-200 rounded-xl p-4">
          <div className="text-2xl font-bold text-stone-900">
            {catalysts.length}
          </div>
          <div className="text-xs text-stone-500">Total Catalysts</div>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-4">
          <div className="text-2xl font-bold text-stone-900">
            {champions.length}
          </div>
          <div className="text-xs text-stone-500">Champions</div>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-4">
          <div className="text-2xl font-bold text-stone-900">
            {totalReferrals}
          </div>
          <div className="text-xs text-stone-500">Referrals Sent</div>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-4">
          <div className="text-2xl font-bold text-stone-900">{totalWon}</div>
          <div className="text-xs text-stone-500">Converted to Won</div>
        </div>
      </div>

      {/* Due for contact */}
      {due.length > 0 && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-800 mb-2">
            <AlertTriangle className="h-4 w-4" />
            {due.length} due for contact
          </div>
          <div className="space-y-1.5">
            {due.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  const full = catalysts.find((cat) => cat.id === c.id);
                  if (full) {
                    setEditing(full);
                    setDialogOpen(true);
                  }
                }}
                className="flex items-center gap-3 w-full text-left text-sm hover:bg-amber-100/50 rounded-lg px-2 py-1.5 transition-colors"
              >
                <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span className="font-medium text-stone-900">{c.name}</span>
                {c.next_action && (
                  <span className="text-stone-500 truncate flex-1">
                    — {c.next_action}
                  </span>
                )}
                <span className="text-xs text-amber-600 shrink-0">
                  {c.next_contact_date}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Catalyst list */}
      {catalysts.length === 0 ? (
        <div className="text-center py-16 text-stone-400">
          <p className="text-lg font-medium mb-1">No catalysts yet</p>
          <p className="text-sm">
            Add CPAs, attorneys, coaches, and other people who know your ICP
          </p>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-stone-50 text-left">
                <th className="py-3 px-4 font-medium text-stone-600">Name</th>
                <th className="py-3 px-4 font-medium text-stone-600">
                  Category
                </th>
                <th className="py-3 px-4 font-medium text-stone-600">
                  Relationship
                </th>
                <th className="py-3 px-4 font-medium text-stone-600">
                  Referrals
                </th>
                <th className="py-3 px-4 font-medium text-stone-600">
                  Next Contact
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {catalysts.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-stone-50 cursor-pointer"
                  onClick={() => {
                    setEditing(c);
                    setDialogOpen(true);
                  }}
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-stone-900">{c.name}</div>
                    <div className="text-xs text-stone-500 flex items-center gap-2">
                      {c.company && <span>{c.company}</span>}
                      {c.title && <span>· {c.title}</span>}
                      {c.linkedin_url && (
                        <a
                          href={c.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Linkedin className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <CategoryLabel value={c.category} />
                  </td>
                  <td className="py-3 px-4">
                    <RelationshipBadge value={c.relationship} />
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-stone-900">
                      {c.deal_count}
                    </span>
                    {c.won_count > 0 && (
                      <span className="text-green-600 text-xs ml-1">
                        ({c.won_count} won)
                      </span>
                    )}
                    {c.total_value > 0 && (
                      <div className="text-xs text-stone-400">
                        ${c.total_value.toLocaleString()}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {c.next_contact_date ? (
                      <div>
                        <div className="text-xs text-stone-600">
                          {c.next_contact_date}
                        </div>
                        {c.next_action && (
                          <div className="text-xs text-stone-400 truncate max-w-[150px]">
                            {c.next_action}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-stone-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CatalystFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        catalyst={editing}
        onSaved={handleSaved}
        onDeleted={handleDeleted}
      />
    </>
  );
}
